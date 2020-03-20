using System.ComponentModel.DataAnnotations;

namespace truemuz.API.Resources
{
    public class SaveAlbumResource
    {
        [Required]
        [MaxLength(30)]
        public string Name { get; set; }

        [Required]
        public int AlbumId { get; set; }
    }
}