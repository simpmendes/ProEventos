﻿using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ProEventos.Application.Contratos;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Http;
using ProEventos.Application.Dtos;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System.Linq;
using ProEventos.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using ProEventos.Persistence.Helpers;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {

        private readonly IEventoService _eventoService;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IUserService _userService;

        public EventosController(IEventoService eventoService, 
                                 IWebHostEnvironment hostEnvironment,
                                 IUserService userService)
        {
            _hostEnvironment = hostEnvironment;
            _userService = userService;
            _eventoService = eventoService;
            
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery]PageParams pageParams)
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(User.GetUserId(), pageParams, true);
                if (eventos ==null) return NoContent();
                Response.AddPagination(eventos.CurrentPage, eventos.PageSize, eventos.TotalCount, eventos.TotalPages);
                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. Erro: {ex.Message}");
            }
            
        }
        [HttpGet("{id}")]
        public async Task<IActionResult>GetById(int id)
        {
            try
            {
                var eventos = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id, true);
                if (eventos ==null) return NoContent();
                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar evento. Erro: {ex.Message}");
            }
            
        }
       
        [HttpPost("upload-image/{eventoId}")]
        public async Task<IActionResult> UploadImage(int eventoId)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), eventoId, true);
                if (evento ==null) return NoContent();

                var file = Request.Form.Files[0];
                if (file.Length > 0)
                {
                     DeleteImage(evento.ImagemURL);
                    evento.ImagemURL = await SaveImage(file);   
                }
                var EventoRetorno = await _eventoService.UpdateEvento(User.GetUserId(), eventoId, evento);
                return Ok(EventoRetorno);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar inserir evento. Erro: {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var eventos = await _eventoService.AddEventos(User.GetUserId(), model);
                if (eventos ==null) return NoContent();
                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar inserir evento. Erro: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model)
        {
            try
            {
                var eventos = await _eventoService.UpdateEvento(User.GetUserId(), id, model);
                if (eventos ==null) return NoContent();
                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar evento. Erro: {ex.Message}");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), id, true);
                if (evento ==null) return NoContent();

                if (await _eventoService.DeleteEvento(User.GetUserId(), id))
                {
                    DeleteImage(evento.ImagemURL);
                    return Ok(new {message = "Deletado"}); 

                } else{
                throw new Exception("Ocorre um problema não específico ao tentar delatar o evento");
                } 
                
            }
            catch (Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar evento. Erro: {ex.Message}");
            }
        }
        [NonAction]
        public void DeleteImage(string imageName)
        {
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/images", imageName);
            if (System.IO.File.Exists(imagePath))
                System.IO.File.Delete(imagePath);
        }
        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName)
            .Take(10)
            .ToArray()
            ).Replace(' ', '-');

            imageName = $"{imageName}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";

            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, @"Resources/images", imageName);

            using(var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }
            return imageName;
        }
    }
}
