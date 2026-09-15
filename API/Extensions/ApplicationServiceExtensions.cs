using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            #region Add Scoped services to the container
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserRepository, UserRepository>();
            #endregion

            #region Add AutoMapper to the container
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            #endregion

            #region Add Dbcontext to the container
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });
            #endregion

            #region Add CORS policy to the container
            services.AddCors();
            #endregion

            return services;
        }
    }
}