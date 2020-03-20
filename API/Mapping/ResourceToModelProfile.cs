using AutoMapper;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Models.Queries;
using truemuz.API.Resources;

namespace truemuz.API.Mapping
{
    public class ResourceToModelProfile : Profile
    {
        public ResourceToModelProfile()
        {
            CreateMap<SaveBandResource, Band>();

            CreateMap<SaveAlbumResource, Album>();

            CreateMap<AlbumsQueryResource, AlbumsQuery>();
        }
    }
}