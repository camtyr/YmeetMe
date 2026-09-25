namespace API.Entities
{
    public class Connection
    {
        public Connection() { }
        public Connection(string connectionId, string userName)
        {
            ConnectionId = connectionId;
            UserName = userName;
        }
        public string ConnectionId { get; set; } = null!;
        public string UserName { get; set; } = null!;
    }
}