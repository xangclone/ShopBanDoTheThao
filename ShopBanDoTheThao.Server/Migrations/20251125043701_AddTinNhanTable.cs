using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopBanDoTheThao.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddTinNhanTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LyDoHoanTra",
                table: "DonHang",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ViTriHienTai",
                table: "DonHang",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TinNhan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NguoiDungId = table.Column<int>(type: "int", nullable: false),
                    NguoiPhanHoiId = table.Column<int>(type: "int", nullable: true),
                    NoiDung = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Loai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SanPhamId = table.Column<int>(type: "int", nullable: true),
                    DaDoc = table.Column<bool>(type: "bit", nullable: false),
                    NgayGui = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TinNhan", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TinNhan_NguoiDung_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TinNhan_NguoiDung_NguoiPhanHoiId",
                        column: x => x.NguoiPhanHoiId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TinNhan_SanPham_SanPhamId",
                        column: x => x.SanPhamId,
                        principalTable: "SanPham",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TinNhan_NguoiDungId",
                table: "TinNhan",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_TinNhan_NguoiPhanHoiId",
                table: "TinNhan",
                column: "NguoiPhanHoiId");

            migrationBuilder.CreateIndex(
                name: "IX_TinNhan_SanPhamId",
                table: "TinNhan",
                column: "SanPhamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TinNhan");

            migrationBuilder.DropColumn(
                name: "LyDoHoanTra",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "ViTriHienTai",
                table: "DonHang");
        }
    }
}
