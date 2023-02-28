using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Persistence.Helpers;

namespace ProEventos.Persistence.Interfaces
{
    public interface IEventoPersist
    {
        

        //EVENTOS
        Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false);
        Task<Evento> GetEventoByIdAsync(int userId, int EventoId, bool includePalestrantes = false); 

        

    }
}