namespace truemuz.API.Domain.Models
{
    public class Link: BaseModel
    {
        public string Url { get; set; }

        public int SongId { get; set; }

        public int LinkTypeId { get; set; }

        #region Navigation properties
        public Song Song { get; set; }

        public LinkType LinkType { get; set; }
        #endregion
    }
}
