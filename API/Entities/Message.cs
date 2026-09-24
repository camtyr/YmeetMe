namespace API.Entities
{
    public class Message
    {
        public int MessageId { get; set; }
        public int SenderId { get; set; }
        public string SenderUserName { get; set; } = string.Empty;
        public AppUser Sender { get; set; } = null!;
        public int RecipientId { get; set; }
        public string RecipientUserName { get; set; } = string.Empty;
        public AppUser Recipient { get; set; } = null!;
        public string Content { get; set; } = string.Empty;
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.UtcNow;
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }
    }
}