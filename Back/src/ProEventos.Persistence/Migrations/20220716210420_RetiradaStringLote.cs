using Microsoft.EntityFrameworkCore.Migrations;

namespace ProEventos.Persistence.Migrations
{
    public partial class RetiradaStringLote : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lote",
                table: "Eventos");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Lote",
                table: "Eventos",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
