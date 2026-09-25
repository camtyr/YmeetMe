using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMessageRepository
    {
        public void AddGroup(Group group);
        public void RemoveConnection(Connection connection);
        public Task<Connection?> GetConnection(string connectionId);
        public Task<Group?> GetMessageGroup(string groupName);
        public Task<Group?> GetGroupForConnection(string connectionId);

        //
        public void AddMessage(Message message);
        public void DeleteMessage(Message message);
        public Task<Message?> GetMessage(int messageId);
        public Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams);
        public Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName);
        Task<bool> SaveAllAsync();
    }
}