using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [MinLength(3, ErrorMessage = "{0} deve ter no mínimo 4 caracteres")]
        [MaxLength(50, ErrorMessage = "{0} deve ter no máximo 50 caracteres")]
        public string Tema { get; set; }
        [Display(Name ="Qtd de Pessoas")]
        [Range(1, 120000, ErrorMessage ="{0} não pode ser menor que e 1 maior que 120000")]
        public int QtdPessoas { get; set; }
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage =" Não é uma imagem válida. (gif, jpeg, jpg, bmp, ou png)")]
        public string ImagemURL { get; set; }
        [Required(ErrorMessage ="{0} é obrigatório")]
        [Phone(ErrorMessage ="{0} é um número inválido")]
        public string Telefone { get; set; }
        [Required(ErrorMessage ="O campo {0} é obrigatório")]
        [Display(Name = "e-mail")]
        [EmailAddress(ErrorMessage = "O campo {0} precisa ser e-mail válido")]
        public string Email { get; set; }
        public IEnumerable<LoteDto> Lotes{ get; set; }
        public IEnumerable<RedeSocialDto> RedeSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}