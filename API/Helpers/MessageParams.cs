namespace API.Helpers
{
    public class MessageParams : PaginationParams
    {
        public string UserName { get; set; } = string.Empty;
        public string Container { get; set; } = "Unread";
    }
}