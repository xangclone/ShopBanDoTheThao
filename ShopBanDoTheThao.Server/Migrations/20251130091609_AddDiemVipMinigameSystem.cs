using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopBanDoTheThao.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddDiemVipMinigameSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DiemKhaDung",
                table: "NguoiDung",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HangVipId",
                table: "NguoiDung",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "HangVip",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ten = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    MauSac = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Icon = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DiemToiThieu = table.Column<int>(type: "int", nullable: false),
                    DiemToiDa = table.Column<int>(type: "int", nullable: false),
                    TiLeTichDiem = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TiLeGiamGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ThuTu = table.Column<int>(type: "int", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HangVip", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Minigame",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    LoaiGame = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    HinhAnh = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SoDiemCanThi = table.Column<int>(type: "int", nullable: false),
                    SoLanChoiToiDa = table.Column<int>(type: "int", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    NgayBatDau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayKetThuc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Minigame", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VoucherDoiDiem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    HinhAnh = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SoDiemCanDoi = table.Column<int>(type: "int", nullable: false),
                    LoaiVoucher = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MaGiamGiaId = table.Column<int>(type: "int", nullable: true),
                    LoaiGiamGia = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    GiaTriGiamGia = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GiaTriDonHangToiThieu = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GiaTriGiamGiaToiDa = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    SoLuongDaDoi = table.Column<int>(type: "int", nullable: false),
                    NgayBatDau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayKetThuc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    ThuTuHienThi = table.Column<int>(type: "int", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoucherDoiDiem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VoucherDoiDiem_MaGiamGia_MaGiamGiaId",
                        column: x => x.MaGiamGiaId,
                        principalTable: "MaGiamGia",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "KetQuaMinigame",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NguoiDungId = table.Column<int>(type: "int", nullable: false),
                    MinigameId = table.Column<int>(type: "int", nullable: false),
                    LoaiPhanThuong = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    SoDiemNhanDuoc = table.Column<int>(type: "int", nullable: true),
                    VoucherDoiDiemId = table.Column<int>(type: "int", nullable: true),
                    MoTa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NgayChoi = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KetQuaMinigame", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KetQuaMinigame_Minigame_MinigameId",
                        column: x => x.MinigameId,
                        principalTable: "Minigame",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KetQuaMinigame_NguoiDung_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_KetQuaMinigame_VoucherDoiDiem_VoucherDoiDiemId",
                        column: x => x.VoucherDoiDiemId,
                        principalTable: "VoucherDoiDiem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "LichSuDiem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NguoiDungId = table.Column<int>(type: "int", nullable: false),
                    Loai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SoDiem = table.Column<int>(type: "int", nullable: false),
                    DiemTruoc = table.Column<int>(type: "int", nullable: false),
                    DiemSau = table.Column<int>(type: "int", nullable: false),
                    DonHangId = table.Column<int>(type: "int", nullable: true),
                    VoucherDoiDiemId = table.Column<int>(type: "int", nullable: true),
                    MinigameId = table.Column<int>(type: "int", nullable: true),
                    GhiChu = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LichSuDiem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LichSuDiem_DonHang_DonHangId",
                        column: x => x.DonHangId,
                        principalTable: "DonHang",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_LichSuDiem_Minigame_MinigameId",
                        column: x => x.MinigameId,
                        principalTable: "Minigame",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_LichSuDiem_NguoiDung_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LichSuDiem_VoucherDoiDiem_VoucherDoiDiemId",
                        column: x => x.VoucherDoiDiemId,
                        principalTable: "VoucherDoiDiem",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_HangVipId",
                table: "NguoiDung",
                column: "HangVipId");

            migrationBuilder.CreateIndex(
                name: "IX_KetQuaMinigame_MinigameId",
                table: "KetQuaMinigame",
                column: "MinigameId");

            migrationBuilder.CreateIndex(
                name: "IX_KetQuaMinigame_NguoiDungId",
                table: "KetQuaMinigame",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_KetQuaMinigame_VoucherDoiDiemId",
                table: "KetQuaMinigame",
                column: "VoucherDoiDiemId");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuDiem_DonHangId",
                table: "LichSuDiem",
                column: "DonHangId");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuDiem_MinigameId",
                table: "LichSuDiem",
                column: "MinigameId");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuDiem_NguoiDungId",
                table: "LichSuDiem",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_LichSuDiem_VoucherDoiDiemId",
                table: "LichSuDiem",
                column: "VoucherDoiDiemId");

            migrationBuilder.CreateIndex(
                name: "IX_VoucherDoiDiem_MaGiamGiaId",
                table: "VoucherDoiDiem",
                column: "MaGiamGiaId");

            migrationBuilder.AddForeignKey(
                name: "FK_NguoiDung_HangVip_HangVipId",
                table: "NguoiDung",
                column: "HangVipId",
                principalTable: "HangVip",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NguoiDung_HangVip_HangVipId",
                table: "NguoiDung");

            migrationBuilder.DropTable(
                name: "HangVip");

            migrationBuilder.DropTable(
                name: "KetQuaMinigame");

            migrationBuilder.DropTable(
                name: "LichSuDiem");

            migrationBuilder.DropTable(
                name: "Minigame");

            migrationBuilder.DropTable(
                name: "VoucherDoiDiem");

            migrationBuilder.DropIndex(
                name: "IX_NguoiDung_HangVipId",
                table: "NguoiDung");

            migrationBuilder.DropColumn(
                name: "DiemKhaDung",
                table: "NguoiDung");

            migrationBuilder.DropColumn(
                name: "HangVipId",
                table: "NguoiDung");
        }
    }
}
