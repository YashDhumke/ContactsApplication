namespace ContactApp.Helpers
{
    public class PagedResult<T>
    {
        public IEnumerable<T> Contacts { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int? TotalPages { get; set; }
    }
}
