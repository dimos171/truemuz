namespace truemuz.API.Domain.Models
{
    public class History : Entity<int>
    {
        public string Text { get; set; }

        public int SongGroupId { get; set; }

        public SongGroup SongGroup { get; set; }
    }
}