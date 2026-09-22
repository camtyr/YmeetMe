using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikeRepository
    {
        public Task<UserLike> GetUserLike(int sourceUserId, int likedUserId);
        public Task<AppUser> GetUserWithLikes(int userId);
        public Task<PagedList<LikeDto>> GetUserLikes(LikeParams likeParams);
    }
}