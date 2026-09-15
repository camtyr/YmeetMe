namespace API.Errors
{
    public class ApiException
    {
        public ApiException(int statuscCode, string title = null, string details = null)
        {
            StatusCode = statuscCode;
            Title = title;
            Details = details;
        }

        public int StatusCode { get; set; }
        public string Title { get; set;}
        public string Details { get; set; }
    }
}