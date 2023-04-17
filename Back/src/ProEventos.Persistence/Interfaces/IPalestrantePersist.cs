using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Persistence.Helpers;

namespace ProEventos.Persistence.Interfaces
{
    public interface IPalestrantePersist : IGeralPersist
    {       
        //PALESTRANTES
        Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false);
        Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false);

    }
}