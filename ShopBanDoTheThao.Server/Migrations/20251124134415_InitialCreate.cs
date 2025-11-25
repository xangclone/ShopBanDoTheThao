using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopBanDoTheThao.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DanhMuc",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    HinhAnh = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DanhMucChaId = table.Column<int>(type: "int", nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ThuTuHienThi = table.Column<int>(type: "int", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhMuc", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DanhMuc_DanhMuc_DanhMucChaId",
                        column: x => x.DanhMucChaId,
                        principalTable: "DanhMuc",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MaGiamGia",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ma = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    LoaiGiamGia = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GiaTriGiamGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GiaTriDonHangToiThieu = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    GiaTriGiamGiaToiDa = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SoLuongSuDung = table.Column<int>(type: "int", nullable: true),
                    SoLuongDaSuDung = table.Column<int>(type: "int", nullable: false),
                    NgayBatDau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayKetThuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaGiamGia", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    MatKhauHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Ho = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: true),
                    GioiTinh = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    AnhDaiDien = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DaXacThucEmail = table.Column<bool>(type: "bit", nullable: false),
                    DaXacThucSoDienThoai = table.Column<bool>(type: "bit", nullable: false),
                    VaiTro = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiemTichLuy = table.Column<int>(type: "int", nullable: false),
                    GoogleId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FacebookId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDung", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ThuongHieu",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ten = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Logo = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TrangWeb = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThuongHieu", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TinTuc",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TieuDe = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TomTat = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", maxLength: 10000, nullable: true),
                    HinhAnh = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Loai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NguoiTaoId = table.Column<int>(type: "int", nullable: false),
                    SoLuotXem = table.Column<int>(type: "int", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    NoiBat = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NgayDang = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TinTuc", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiaChi",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NguoiDungId = table.Column<int>(type: "int", nullable: false),
                    DuongPho = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PhuongXa = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    QuanHuyen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ThanhPho = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaBuuChinh = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    QuocGia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TenNguoiNhan = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SoDienThoaiNhan = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    MacDinh = table.Column<bool>(type: "bit", nullable: false),
                    LoaiDiaChi = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiaChi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiaChi_NguoiDung_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PhuongThucThanhToan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NguoiDungId = table.Column<int>(type: "int", nullable: false),
                    Loai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NhaCungCap = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    SoThe = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TenChuThe = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    NgayHetHan = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    MacDinh = table.Column<bool>(type: "bit", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhuongThucThanhToan", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PhuongThucThanhToan_NguoiDung_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SanPham",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ten = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    MoTaChiTiet = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Gia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GiaGoc = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SKU = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DanhMucId = table.Column<int>(type: "int", nullable: false),
                    ThuongHieuId = table.Column<int>(type: "int", nullable: true),
                    SoLuongTon = table.Column<int>(type: "int", nullable: false),
                    KichThuoc = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    MauSac = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ChatLieu = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    XuatXu = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    HinhAnhChinh = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DanhSachHinhAnh = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Video = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Slug = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SoLuotXem = table.Column<int>(type: "int", nullable: false),
                    SoLuongBan = table.Column<int>(type: "int", nullable: false),
                    DiemDanhGiaTrungBinh = table.Column<double>(type: "float", nullable: false),
                    SoLuongDanhGia = table.Column<int>(type: "int", nullable: false),
                    DangHoatDong = table.Column<bool>(type: "bit", nullable: false),
                    DangKhuyenMai = table.Column<bool>(type: "bit", nullable: false),
                    SanPhamNoiBat = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SanPham", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SanPham_DanhMuc_DanhMucId",
                        column: x => x.DanhMucId,
                        principalTable: "DanhMuc",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SanPham_ThuongHieu_ThuongHieuId",
                        column: x => x.ThuongHieuId,
                        principalTable: "ThuongHieu",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "DonHang",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDonHang = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NguoiDungId = table.Column<int>(type: "int", nullable: false),
                    DiaChiGiaoHangId = table.Column<int>(type: "int", nullable: false),
                    PhuongThucThanhToanId = table.Column<int>(type: "int", nullable: true),
                    TongTienSanPham = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PhiVanChuyen = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GiamGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Thue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TongTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MaGiamGia = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TrangThaiThanhToan = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PhuongThucGiaoHang = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MaVanDon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    GhiChu = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    NgayDat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayGiao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonHang", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DonHang_DiaChi_DiaChiGiaoHangId",
                        column: x => x.DiaChiGiaoHangId,
                        principalTable: "DiaChi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DonHang_NguoiDung_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DonHang_PhuongThucThanhToan_PhuongThucThanhToanId",
                        column: x => x.PhuongThucThanhToanId,
                        principalTable: "PhuongThucThanhToan",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DanhGiaSanPham",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SanPhamId = table.Column<int>(type: "int", nullable: false),
                    NguoiDungId = table.Column<int>(type: "int", nullable: false),
                    SoSao = table.Column<int>(type: "int", nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    DanhSachHinhAnh = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DaXacNhanMua = table.Column<bool>(type: "bit", nullable: false),
                    SoLuongThich = table.Column<int>(type: "int", nullable: false),
                    HienThi = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhGiaSanPham", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DanhGiaSanPham_NguoiDung_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DanhGiaSanPham_SanPham_SanPhamId",
                        column: x => x.SanPhamId,
                        principalTable: "SanPham",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GioHangItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NguoiDungId = table.Column<int>(type: "int", nullable: false),
                    SanPhamId = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    KichThuoc = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    MauSac = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NgayThem = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GioHangItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GioHangItem_NguoiDung_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GioHangItem_SanPham_SanPhamId",
                        column: x => x.SanPhamId,
                        principalTable: "SanPham",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "YeuThichItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NguoiDungId = table.Column<int>(type: "int", nullable: false),
                    SanPhamId = table.Column<int>(type: "int", nullable: false),
                    NgayThem = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YeuThichItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_YeuThichItem_NguoiDung_NguoiDungId",
                        column: x => x.NguoiDungId,
                        principalTable: "NguoiDung",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_YeuThichItem_SanPham_SanPhamId",
                        column: x => x.SanPhamId,
                        principalTable: "SanPham",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonHangChiTiet",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DonHangId = table.Column<int>(type: "int", nullable: false),
                    SanPhamId = table.Column<int>(type: "int", nullable: false),
                    SoLuong = table.Column<int>(type: "int", nullable: false),
                    Gia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GiamGia = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ThanhTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    KichThuoc = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    MauSac = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonHangChiTiet", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DonHangChiTiet_DonHang_DonHangId",
                        column: x => x.DonHangId,
                        principalTable: "DonHang",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DonHangChiTiet_SanPham_SanPhamId",
                        column: x => x.SanPhamId,
                        principalTable: "SanPham",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DanhGiaSanPham_NguoiDungId",
                table: "DanhGiaSanPham",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_DanhGiaSanPham_SanPhamId",
                table: "DanhGiaSanPham",
                column: "SanPhamId");

            migrationBuilder.CreateIndex(
                name: "IX_DanhMuc_DanhMucChaId",
                table: "DanhMuc",
                column: "DanhMucChaId");

            migrationBuilder.CreateIndex(
                name: "IX_DiaChi_NguoiDungId",
                table: "DiaChi",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_DiaChiGiaoHangId",
                table: "DonHang",
                column: "DiaChiGiaoHangId");

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_MaDonHang",
                table: "DonHang",
                column: "MaDonHang",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_NguoiDungId",
                table: "DonHang",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_DonHang_PhuongThucThanhToanId",
                table: "DonHang",
                column: "PhuongThucThanhToanId");

            migrationBuilder.CreateIndex(
                name: "IX_DonHangChiTiet_DonHangId",
                table: "DonHangChiTiet",
                column: "DonHangId");

            migrationBuilder.CreateIndex(
                name: "IX_DonHangChiTiet_SanPhamId",
                table: "DonHangChiTiet",
                column: "SanPhamId");

            migrationBuilder.CreateIndex(
                name: "IX_GioHangItem_NguoiDungId",
                table: "GioHangItem",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_GioHangItem_SanPhamId",
                table: "GioHangItem",
                column: "SanPhamId");

            migrationBuilder.CreateIndex(
                name: "IX_MaGiamGia_Ma",
                table: "MaGiamGia",
                column: "Ma",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_Email",
                table: "NguoiDung",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PhuongThucThanhToan_NguoiDungId",
                table: "PhuongThucThanhToan",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_DanhMucId",
                table: "SanPham",
                column: "DanhMucId");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_Slug",
                table: "SanPham",
                column: "Slug",
                unique: true,
                filter: "[Slug] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_ThuongHieuId",
                table: "SanPham",
                column: "ThuongHieuId");

            migrationBuilder.CreateIndex(
                name: "IX_YeuThichItem_NguoiDungId",
                table: "YeuThichItem",
                column: "NguoiDungId");

            migrationBuilder.CreateIndex(
                name: "IX_YeuThichItem_SanPhamId",
                table: "YeuThichItem",
                column: "SanPhamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DanhGiaSanPham");

            migrationBuilder.DropTable(
                name: "DonHangChiTiet");

            migrationBuilder.DropTable(
                name: "GioHangItem");

            migrationBuilder.DropTable(
                name: "MaGiamGia");

            migrationBuilder.DropTable(
                name: "TinTuc");

            migrationBuilder.DropTable(
                name: "YeuThichItem");

            migrationBuilder.DropTable(
                name: "DonHang");

            migrationBuilder.DropTable(
                name: "SanPham");

            migrationBuilder.DropTable(
                name: "DiaChi");

            migrationBuilder.DropTable(
                name: "PhuongThucThanhToan");

            migrationBuilder.DropTable(
                name: "DanhMuc");

            migrationBuilder.DropTable(
                name: "ThuongHieu");

            migrationBuilder.DropTable(
                name: "NguoiDung");
        }
    }
}
