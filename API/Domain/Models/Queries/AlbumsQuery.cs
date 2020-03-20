namespace truemuz.API.Domain.Models.Queries
{
    public class AlbumsQuery : Query
    {
        public int? BandId { get; set; }

        public AlbumsQuery(int? bandId, int page, int itemsPerPage) : base(page, itemsPerPage)
        {
            BandId = bandId;
        }
    }
}