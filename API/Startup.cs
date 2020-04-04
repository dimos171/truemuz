﻿using System;
using System.IO;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using truemuz.API.Controllers.Config;
using truemuz.API.Domain.Repositories;
using truemuz.API.Domain.Services;
using truemuz.API.Extensions;
using truemuz.API.Infrastructure.Configuration;
using truemuz.API.Persistence.Contexts;
using truemuz.API.Persistence.Repositories;
using truemuz.API.Services;

namespace truemuz.API
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true, true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();

            InitializeStaticAppSettings();
        }

        private void InitializeStaticAppSettings()
        {
            ApplicationConfig.BaseUrl = Configuration.GetSection("Application").GetValue<string>("BaseUrl");

            IConfigurationSection linkGeneratorSection = Configuration.GetSection("LinkGenerator");
            LinkGeneratorConfig.AadClientId = linkGeneratorSection.GetValue<string>("AadClientId");
            LinkGeneratorConfig.AadEndpoint = linkGeneratorSection.GetValue<Uri>("AadEndpoint");
            LinkGeneratorConfig.AadSecret = linkGeneratorSection.GetValue<string>("AadSecret");
            LinkGeneratorConfig.AadTenantId = linkGeneratorSection.GetValue<string>("AadTenantId");
            LinkGeneratorConfig.AccountName = linkGeneratorSection.GetValue<string>("AccountName");
            LinkGeneratorConfig.ArmAadAudience = linkGeneratorSection.GetValue<Uri>("ArmAadAudience");
            LinkGeneratorConfig.ArmEndpoint = linkGeneratorSection.GetValue<Uri>("ArmEndpoint");
            LinkGeneratorConfig.Region = linkGeneratorSection.GetValue<string>("Region");
            LinkGeneratorConfig.ResourceGroup = linkGeneratorSection.GetValue<string>("ResourceGroup");
            LinkGeneratorConfig.SubscriptionId = linkGeneratorSection.GetValue<string>("SubscriptionId");
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMemoryCache();

            services.AddCustomSwagger();

            services.AddControllers().ConfigureApiBehaviorOptions(options =>
            {
                // Adds a custom error response factory when ModelState is invalid
                options.InvalidModelStateResponseFactory = InvalidModelStateResponseFactory.ProduceErrorResponse;
            });

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlite(Configuration.GetConnectionString("sqlite"));
            });

            services.AddScoped<IBandRepository, BandRepository>();
            services.AddScoped<IAlbumRepository, AlbumRepository>();
            services.AddScoped<ISongRepository, SongRepository>();
            services.AddScoped<ILinkRepository, LinkRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IBandService, BandService>();
            services.AddScoped<IAlbumService, AlbumService>();
            services.AddScoped<ISongService, SongService>();
            services.AddScoped<ILinkGenerationService, LinkGenerationService>();

            services.AddAutoMapper(typeof(Startup));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCustomSwagger();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}