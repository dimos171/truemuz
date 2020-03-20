namespace truemuz.API.Domain.Models
{
    public class History: BaseModel
    {
        public int SongGroupId { get; set; }

        #region Navigation properties
        public SongGroup SongGroup { get; set; }
        #endregion
    }
}
