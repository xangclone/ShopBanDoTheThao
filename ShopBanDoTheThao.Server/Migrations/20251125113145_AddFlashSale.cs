using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopBanDoTheThao.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFlashSale : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DanhGiaSanPham_NguoiDung_NguoiDungId",
                table: "DanhGiaSanPham");

            migrationBuilder.DropForeignKey(
                name: "FK_DanhGiaSanPham_SanPham_SanPhamId",
                table: "DanhGiaSanPham");

            migrationBuilder.CreateTable(
                name: "FlashSale",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ten = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    HinhAnh = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ThoiGianBatDau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ThoiGianKetThuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    UuTien = table.Column<int>(type: "int", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlashSale", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FlashSaleSanPham",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FlashSaleId = table.Column<int>(type: "int", nullable: false),
                    SanPhamId = table.Column<int>(type: "int", nullable: false),
                    GiaFlashSale = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SoLuongToiDa = table.Column<int>(type: "int", nullable: false),
                    SoLuongDaBan = table.Column<int>(type: "int", nullable: false),
                    UuTien = table.Column<int>(type: "int", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlashSaleSanPham", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FlashSaleSanPham_FlashSale_FlashSaleId",
                        column: x => x.FlashSaleId,
                        principalTable: "FlashSale",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FlashSaleSanPham_SanPham_SanPhamId",
                        column: x => x.SanPhamId,
                        principalTable: "SanPham",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FlashSaleSanPham_FlashSaleId",
                table: "FlashSaleSanPham",
                column: "FlashSaleId");

            migrationBuilder.CreateIndex(
                name: "IX_FlashSaleSanPham_SanPhamId",
                table: "FlashSaleSanPham",
                column: "SanPhamId");

            migrationBuilder.AddForeignKey(
                name: "FK_DanhGiaSanPham_NguoiDung_NguoiDungId",
                table: "DanhGiaSanPham",
                column: "NguoiDungId",
                principalTable: "NguoiDung",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DanhGiaSanPham_SanPham_SanPhamId",
                table: "DanhGiaSanPham",
                column: "SanPhamId",
                principalTable: "SanPham",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DanhGiaSanPham_NguoiDung_NguoiDungId",
                table: "DanhGiaSanPham");

            migrationBuilder.DropForeignKey(
                name: "FK_DanhGiaSanPham_SanPham_SanPhamId",
                table: "DanhGiaSanPham");

            migrationBuilder.DropTable(
                name: "FlashSaleSanPham");

            migrationBuilder.DropTable(
                name: "FlashSale");

            migrationBuilder.AddForeignKey(
                name: "FK_DanhGiaSanPham_NguoiDung_NguoiDungId",
                table: "DanhGiaSanPham",
                column: "NguoiDungId",
                principalTable: "NguoiDung",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DanhGiaSanPham_SanPham_SanPhamId",
                table: "DanhGiaSanPham",
                column: "SanPhamId",
                principalTable: "SanPham",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
