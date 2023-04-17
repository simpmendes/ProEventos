using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Interfaces;

namespace ProEventos.Application
{
    public class RedeSocialService : IRedeSocialService
    {
        private readonly IRedeSocialPersist _redeSocialPersist;
        private readonly IMapper _mapper;
        public RedeSocialService( IRedeSocialPersist redeSocialPersist, 
                            IMapper mapper)
        {
            _redeSocialPersist = redeSocialPersist;
            _mapper = mapper;
            
        }
        public async Task AddRedeSocial(int Id, RedeSocialDto model, bool isEvento)
        {
            
            try
            {
                var redeSocial  = _mapper.Map<RedeSocial>(model);
                if(isEvento){
                    redeSocial.EventoId = Id;
                    redeSocial.PalestranteId = null;
                }
                else{
                    redeSocial.PalestranteId = Id;
                    redeSocial.EventoId = null;
                }
                
                _redeSocialPersist.Add<RedeSocial>(redeSocial);
                await _redeSocialPersist.SaveChangesAsync();
                
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if (redeSocial == null)throw new Exception("Rede Social por Evento para Delete não foi encontrada");
                

                _redeSocialPersist.Delete<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();
                
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteByPalestrante(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);
                if (redeSocial == null)throw new Exception("Rede Social por Palestrante para Delete não foi encontrada");
                

                _redeSocialPersist.Delete<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();
                
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> GetAllByEventoIdAsync(int eventoId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                if (redeSocial == null) return null;
                var resultado =  _mapper.Map<RedeSocialDto[]>(redeSocial);
                return resultado;
            }
            catch (Exception ex)
            {   
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> GetAllByPalestranteIdAsync(int palestranteId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);
                if (redeSocial == null) return null;
                var resultado =  _mapper.Map<RedeSocialDto[]>(redeSocial);
                return resultado;
            }
            catch (Exception ex)
            {   
                throw new Exception(ex.Message);
            }
        }
        public async Task<RedeSocialDto> GetRedeSocialEventoByIdsAsync(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if (redeSocial == null) return null;
                var resultado =  _mapper.Map<RedeSocialDto>(redeSocial);
                return resultado;
            }
            catch (Exception ex)
            {   
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialPalestranteByIdsAsync(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);
                if (redeSocial == null) return null;
                var resultado =  _mapper.Map<RedeSocialDto>(redeSocial);
                return resultado;
            }
            catch (Exception ex)
            {   
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> SaveByEvento(int eventoId, RedeSocialDto[] models)
        {
            
            try
            {
                var redeSociais = await _redeSocialPersist.GetAllByEventoIdAsync(eventoId);
                if (redeSociais == null)return null;

                foreach (var model in models)
                {
                    if(model.Id == 0)
                    {
                        await AddRedeSocial(eventoId, model, true);
                    }
                    else{
                        var RedeSocial = redeSociais.FirstOrDefault(RedeSocial => RedeSocial.Id==model.Id);
                        model.EventoId = eventoId;
                
                        _mapper.Map(model, RedeSocial);
                        _redeSocialPersist.Update<RedeSocial>(RedeSocial);
                        await _redeSocialPersist.SaveChangesAsync();
                    }
                }
                return _mapper.Map<RedeSocialDto[]>(await _redeSocialPersist.GetAllByEventoIdAsync(eventoId));
                
                
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> SaveByPalestrante(int palestranteId, RedeSocialDto[] models)
        {
            
            try
            {
                var redeSociais = await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId);
                if (redeSociais == null)return null;

                foreach (var model in models)
                {
                    if(model.Id == 0)
                    {
                        await AddRedeSocial(palestranteId, model, false);
                    }
                    else{
                        var redeSocial = redeSociais.FirstOrDefault(RedeSocial => RedeSocial.Id==model.Id);
                        model.PalestranteId = palestranteId;
                
                        _mapper.Map(model, redeSocial);
                        _redeSocialPersist.Update<RedeSocial>(redeSocial);
                        await _redeSocialPersist.SaveChangesAsync();
                    }
                }
                return _mapper.Map<RedeSocialDto[]>(await _redeSocialPersist.GetAllByPalestranteIdAsync(palestranteId));
                
                
            }
            catch (Exception ex)
            {
                
                throw new Exception(ex.Message);
            }
        }
        

        
    }
}