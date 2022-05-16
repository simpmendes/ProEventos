using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.API.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        
        public IEnumerable <Evento>  _eventos = new Evento[]{
                new Evento(){
                EventoId = 1,
                Local = " São Paulo",
                DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy"),
                Tema = "Angular 11 e .NET 5",
                QtdPessoas = 250,
                Lote = "1 Lote",
                ImagemURL = "foto.png"
                },
            new Evento(){
                EventoId = 2,
                Local = " São Paulo",
                DataEvento = DateTime.Now.AddDays(3).ToString("dd/MM/yyyy"),
                Tema = "Angular 11 e suas novidades",
                QtdPessoas = 350,
                Lote = "2 Lote",
                ImagemURL = "foto2.png"
                
            }
            };

        public EventoController()
        {
            
        }

        [HttpGet]
        public IEnumerable <Evento> Get()
        {
            return _eventos;
            
        }
        [HttpGet("{id}")]
        public IEnumerable <Evento> GetById(int id)
        {
            return _eventos.Where(evento => evento.EventoId ==id);
            
        }
        [HttpPost]
        public string Post()
        {
            return "Exemplo de Post";
        }
        [HttpPut("{id}")]
        public string Put(int id)
        {
            return $"Exemplo de put com id igual {id}";
        }
        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            return $"Exemplo de Delete com id igual {id}";
        }
    }
}
