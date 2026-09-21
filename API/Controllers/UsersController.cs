using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using API.DTOs;
using AutoMapper;
using System.Security.Claims;
using API.Extensions;
using API.Services;
using API.Helpers;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IPhotoService _photoService;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IPhotoService photoService, IMapper mapper)
        {
            _userRepository = userRepository;
            _photoService = photoService;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var username = User.GetUserName();
            if (username != null)
            {
                var user = await _userRepository.GetUserByUserNameAsync(username);
                if (user != null)
                {
                    userParams.CurrentUserName = user.UserName;
                    if (string.IsNullOrEmpty(userParams.Gender))
                    {
                        userParams.Gender = user.Gender == "male" ? "female" : "male";
                    }
                    
                    var users = await _userRepository.GetMembersAsync(userParams);

                    Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

                    return Ok(users);
                }
            }
            return BadRequest("Failed to get members");
        }

        [Authorize]
        [HttpGet("{userName}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string userName)
        {
            var user = await _userRepository.GetMemberAsync(userName);
            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [Authorize]
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUserName();

            if (username != null)
            {
                var user = await _userRepository.GetUserByUserNameAsync(username);

                if (user != null)
                {
                    _mapper.Map(memberUpdateDto, user);

                    _userRepository.Update(user);

                    if (await _userRepository.SaveAllAsync()) return NoContent();
                }
            }

            return BadRequest("Failed to update user");
        }

        [Authorize]
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {

            var username = User.GetUserName();

            if (username != null)
            {
                var user = await _userRepository.GetUserByUserNameAsync(username);

                if (user != null)
                {
                    var result = await _photoService.AddPhotoAsync(file);

                    if (result.Error != null) return BadRequest(result.Error.Message);

                    var photo = new Photo
                    {
                        Url = result.SecureUrl.AbsoluteUri,
                        PublicId = result.PublicId,
                    };

                    if (user.Photos?.Count == 0)
                    {
                        photo.IsMain = true;
                    }

                    user.Photos?.Add(photo);

                    if (await _userRepository.SaveAllAsync())
                    {
                        return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
                    }
                }
            }

            return BadRequest("Problem adding photo");
        }

        [Authorize]
        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var username = User.GetUserName();

            if (username != null)
            {
                var user = await _userRepository.GetUserByUserNameAsync(username);

                if (user != null)
                {
                    var photo = user.Photos?.FirstOrDefault(x => x.Id == photoId);
                    if (photo != null)
                    {
                        if (photo.IsMain) return BadRequest("This is already your main photo");

                        var currentMain = user.Photos?.FirstOrDefault(x => x.IsMain);
                        if (currentMain != null) currentMain.IsMain = false;
                        photo.IsMain = true;

                        if (await _userRepository.SaveAllAsync()) return NoContent();
                    }
                }
            }

            return BadRequest("Failed to set main photo");
        }

        [Authorize]
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var username = User.GetUserName();

            if (username != null)
            {
                var user = await _userRepository.GetUserByUserNameAsync(username);

                if (user != null)
                {
                    var photo = user.Photos?.FirstOrDefault(x => x.Id == photoId);

                    if (photo == null) return NotFound();

                    if (photo.IsMain) return BadRequest("You can't delete your main photo");

                    if (photo.PublicId != null)
                    {
                        var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                        if (result.Error != null) return BadRequest(result.Error.Message);
                    }

                    user.Photos?.Remove(photo);

                    if (await _userRepository.SaveAllAsync()) return Ok();
                }
            }

            return BadRequest("Failed to delete photo");
        }
    }
}