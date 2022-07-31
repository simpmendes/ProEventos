using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;


namespace ProEventos.Persistence.Interfaces
{
    public interface IPalestrantePersist
    {       
        //PALESTRANTES
        Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string tema, bool includeEventos);
        Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos);
        Task<Palestrante> GetPalestranteByIdAsync(int PalestranteId, bool includeEventos );

    }
}