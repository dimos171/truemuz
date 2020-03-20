using System.ComponentModel.DataAnnotations;

namespace truemuz.API.Resources
{
    public class SaveBandResource
    {
        [Required]
        [MaxLength(30)]
        public string Name { get; set; }
    }
}