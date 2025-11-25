using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopBanDoTheThao.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddThongBaoTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ThongBao",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NguoiDungId = table.Column<int>(type: "int", nullable: false),
                    TieuDe = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Loai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LienKet = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DonHangId = table.Column<int>(type: "int", nullable: true),
                    SanPhamId = table.Column<int>(type: "int", nullable: true),
                    DaDoc = table.Column<bool>(type: "bit", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongBao", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ThongBao_DonHang_DonHangId",
                        column: x => x.DonHangId,
                        principalTable: "DonHang",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ThongBao_NguoiDung_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ThongBao_SanPham_SanPhamId",
                        column: x => x.SanPhamId,
                        principalTable: "SanPham",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ThongBao_DonHangId",
                table: "ThongBao",
                column: "DonHangId");

            migrationBuilder.CreateIndex(
                name: "IX_ThongBao_NguoiDungId",
                table: "ThongBao",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_ThongBao_SanPhamId",
                table: "ThongBao",
                column: "SanPhamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ThongBao");
        }
    }
}
