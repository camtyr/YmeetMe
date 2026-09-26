using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public MessageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Connection?> GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);
        }

        public async Task<Group?> GetGroupForConnection(string connectionId)
        {
            return await _context.Groups
                .Include(g => g.Connections)
                .Where(g => g.Connections.Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message?> GetMessage(int messageId)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Recipient)
                .SingleOrDefaultAsync(m => m.MessageId == messageId);
        }

        public async Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                .OrderByDescending(m => m.MessageSent)
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.RecipientUserName == messageParams.UserName && !u.RecipientDeleted),
                "Outbox" => query.Where(u => u.SenderUserName == messageParams.UserName && !u.SenderDeleted),
                _ => query.Where(u => u.RecipientUserName == messageParams.UserName && u.DateRead == null && !u.RecipientDeleted)
            };

            return await PagedList<MessageDto>.CreateAsync(query, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<Group?> GetMessageGroup(string groupName)
        {
            return await _context.Groups
             .Include(g => g.Connections)
             .FirstOrDefaultAsync(g => g.Name == groupName);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName)
        {
            var messages = await _context.Messages
                .Where(
                    m => m.RecipientUserName == currentUserName
                    && m.Sender.UserName == recipientUserName && !m.RecipientDeleted
                    || m.RecipientUserName == recipientUserName
                    && m.Sender.UserName == currentUserName && !m.SenderDeleted
                )
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null && m.RecipientUserName == currentUserName).ToList();
            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<List<MessageDto>>(messages);
        }

        public void RemoveConnection(Connection connection)
        {
             _context.Connections.Remove(connection);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}