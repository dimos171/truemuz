namespace truemuz.API.Domain.Models.Queries
{
    public class SongQuery
    {
        public int SongId { get; set; }

        public SongQuery(int bandId, int albumId, int songId)
        {
            SongId = songId;
        }
    }
}
