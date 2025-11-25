using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopBanDoTheThao.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddSanPhamBienThe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SanPhamBienThe",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SanPhamId = table.Column<int>(type: "int", nullable: false),
                    KichThuoc = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    MauSac = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SKU = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SoLuongTon = table.Column<int>(type: "int", nullable: false),
                    Gia = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    HinhAnh = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SanPhamBienThe", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SanPhamBienThe_SanPham_SanPhamId",
                        column: x => x.SanPhamId,
                        principalTable: "SanPham",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SanPhamBienThe_SanPhamId",
                table: "SanPhamBienThe",
                column: "SanPhamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SanPhamBienThe");
        }
    }
}
