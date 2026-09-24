using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
                    src.Photos == null ? null
                        : src.Photos.Where(x => x.IsMain).Select(x => x.Url).FirstOrDefault()))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src =>
                    src.DateOfBirth.CalculateAge()));
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderPhotoUrl, opt => opt.MapFrom(src =>
                    src.Sender.Photos == null ? null
                        : src.Sender.Photos.Where(x => x.IsMain).Select(x => x.Url).FirstOrDefault()))
                .ForMember(dest => dest.RecipientPhotoUrl, opt => opt.MapFrom(src =>
                    src.Recipient.Photos == null ? null
                        : src.Recipient.Photos.Where(x => x.IsMain).Select(x => x.Url).FirstOrDefault()));
            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
            CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : d);
        }
    }
}