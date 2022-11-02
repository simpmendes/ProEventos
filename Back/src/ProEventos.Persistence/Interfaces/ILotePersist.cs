using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProEventos.Domain;


namespace ProEventos.Persistence.Interfaces
{
    public interface ILotePersist
    {
        //LOTES
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);
        Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId); 

    }
}