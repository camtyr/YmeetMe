using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using API.Interfaces;
using API.DTOs;
using AutoMapper;
using System.Security.Claims;

namespace API.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public UsersController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            return Ok(await _userRepository.GetMembersAsync());
        }
        
        [Authorize]
        [HttpGet("{userName}")]
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
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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
    }
}