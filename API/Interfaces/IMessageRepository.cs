using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMessageRepository
    {
        public void AddMessage(Message message);
        public void DeleteMessage(Message message);
        public Task<Message?> GetMessage(int messageId);
        public Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams);
        public Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName);
        Task<bool> SaveAllAsync();
    }
}