using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProEventos.API.Models
{
    public class PaginationHeader
    {
       
        public PaginationHeader(int currentPage, int totalItems, int itensPerPage, int totalPages) 
        {
            this.CurrentPage = currentPage;
            this.ItensPerPage = itensPerPage;
            this.TotalItems = totalItems;
            this.TotalPages = totalPages;
   
        }
        public int CurrentPage { get; set; }
        public int ItensPerPage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}