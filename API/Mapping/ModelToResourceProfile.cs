using AutoMapper;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Models.Queries;
using truemuz.API.Resources;

namespace truemuz.API.Mapping
{
    public class ModelToResourceProfile : Profile
    {
        public ModelToResourceProfile()
        {
            CreateMap<Band, BandResource>();

            CreateMap<Album, AlbumResource>();

            CreateMap<QueryResult<Album>, QueryResultResource<AlbumResource>>();
        }
    }
}