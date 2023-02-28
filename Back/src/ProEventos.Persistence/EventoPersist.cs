using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;
using Microsoft.EntityFrameworkCore;
using ProEventos.Persistence.Interfaces;
using ProEventos.Persistence.Contexto;
using ProEventos.Persistence.Helpers;

namespace ProEventos.Persistence
{
    public class EventoPersist : IEventoPersist  
    {
        private readonly ProEventosContext _context;
        public EventoPersist(ProEventosContext context)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;    
        }
        
        public async Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedeSociais);

            if(includePalestrantes)
            {
                query = query.Include(e => e.PalestrantesEventos)
                .ThenInclude(pe => pe.Palestrante);
            }

            query = query.AsNoTracking()
                        .Where(e => e.Tema.ToLower().Contains(pageParams.Term.ToLower()) ||
                          e.Local.ToLower().Contains(pageParams.Term.ToLower()) &&
                          e.UserId == userId)
                         .OrderBy(e => e.Id);
                         
            return await PageList<Evento>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }
        public async Task<Evento> GetEventoByIdAsync(int userId, int EventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedeSociais);

            if(includePalestrantes)
            {
                query = query.Include(e => e.PalestrantesEventos)
                .ThenInclude(pe => pe.Palestrante);
            }

            query = query.OrderBy(e => e.Id)
                        .Where(e => e.Id == EventoId && e.UserId == userId);

            return await query.FirstOrDefaultAsync();
        }
        
    }
}