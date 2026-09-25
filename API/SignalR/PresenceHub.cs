using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            if (Context.User is not null)
            {
                var username = Context.User.GetUserName();
                if (username is null) return;

                var isOnline = await _tracker.UserConnected(username, Context.ConnectionId);
                if (isOnline)
                    await Clients.Others.SendAsync("UserIsOnline", username);

                var currentUsers = await _tracker.GetOnlineUsers();
                await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (Context.User is not null)
            {
                var username = Context.User.GetUserName();
                if (username is null) return;

                var isOffline = await _tracker.UserDisconnected(username, Context.ConnectionId);
                if (isOffline) await Clients.Others.SendAsync("UserIsOffline", username);

                await base.OnDisconnectedAsync(exception);
            }
        }
    }
}