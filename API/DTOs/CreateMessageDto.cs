namespace API.DTOs
{
    public class CreateMessageDto
    {
        public string RecipientUserName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
    }
}