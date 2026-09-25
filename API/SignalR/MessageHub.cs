using System.Text.RegularExpressions;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IUserRepository _userRepository;
        private readonly IMessageRepository _messageRepository;
        private readonly IMapper _mapper;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _presenceTracker;
        public MessageHub(
            IMessageRepository messageRepository, IMapper mapper,
            IUserRepository userRepository, IHubContext<PresenceHub> presenceHub,
            PresenceTracker presenceTracker)
        {
            _userRepository = userRepository;
            _messageRepository = messageRepository;
            _mapper = mapper;
            _presenceHub = presenceHub;
            _presenceTracker = presenceTracker;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            if (httpContext == null) throw new HubException("HTTP context is unavailable.");

            var otherUser = httpContext.Request.Query["user"].ToString();
            var caller = Context.User?.GetUserName();
            if (string.IsNullOrEmpty(caller)) throw new HubException("User is unavailable.");

            var groupName = GetGroupName(caller, otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var group = await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await _messageRepository.GetMessageThread(caller, otherUser);

            await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var group = await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User?.GetUserName();

            if (username != null)
            {
                if (username == createMessageDto.RecipientUserName.ToLower())
                    throw new HubException("You cannot send messages to yourself");

                var sender = await _userRepository.GetUserByUserNameAsync(username);

                var recipient = await _userRepository.GetUserByUserNameAsync(createMessageDto.RecipientUserName);

                if (sender == null || recipient == null) throw new HubException("Not found user");

                var message = new Message
                {
                    Sender = sender!,
                    Recipient = recipient,
                    SenderUserName = sender!.UserName,
                    RecipientUserName = recipient.UserName,
                    Content = createMessageDto.Content
                };

                var groupName = GetGroupName(sender.UserName, recipient.UserName);

                var group = await _messageRepository.GetMessageGroup(groupName);

                if (group == null) throw new HubException("Not found group");

                if (group.Connections.Any(x => x.UserName == recipient.UserName))
                {
                    message.DateRead = DateTime.UtcNow;
                }
                else
                {
                    var connection = await _presenceTracker.GetConnectionForUser(recipient.UserName);
                    if (connection != null)
                    {
                        await _presenceHub.Clients.Clients(connection).SendAsync("NewMessageReceived",
                            new { userName = sender.UserName, knownAs = sender.KnownAs }
                        );
                    }
                }

                _messageRepository.AddMessage(message);

                if (await _messageRepository.SaveAllAsync())
                {
                    await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
                }
            }
        }

        private async Task<Entities.Group> AddToGroup(string groupName)
        {
            var userName = Context.User?.GetUserName();

            if (userName != null)
            {
                var group = await _messageRepository.GetMessageGroup(groupName);
                var connection = new Connection(Context.ConnectionId, userName);

                if (group == null)
                {
                    group = new Entities.Group(groupName);
                    _messageRepository.AddGroup(group);
                }

                group.Connections.Add(connection);

                if (await _messageRepository.SaveAllAsync()) return group;
            }

            throw new HubException("Failed to join group");
        }

        private async Task<Entities.Group> RemoveFromMessageGroup()
        {
            var group = await _messageRepository.GetGroupForConnection(Context.ConnectionId);
            if (group == null) throw new HubException("Failed to get group");

            var connection = group.Connections.FirstOrDefault(c => c.ConnectionId == Context.ConnectionId);

            if (connection != null)
            {
                _messageRepository.RemoveConnection(connection);
                if (await _messageRepository.SaveAllAsync()) return group;
            }

            throw new HubException("Failed to remove from group");
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}