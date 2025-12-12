using Microsoft.EntityFrameworkCore;
using ShopBanDoTheThao.Server.Models;

namespace ShopBanDoTheThao.Server.Data
{
    public class ShopBanDoTheThaoDbContext : DbContext
    {
        public ShopBanDoTheThaoDbContext(DbContextOptions<ShopBanDoTheThaoDbContext> options)
            : base(options)
        {
        }

        public DbSet<NguoiDung> NguoiDung { get; set; }
        public DbSet<DiaChi> DiaChi { get; set; }
        public DbSet<PhuongThucThanhToan> PhuongThucThanhToan { get; set; }
        public DbSet<DanhMuc> DanhMuc { get; set; }
        public DbSet<ThuongHieu> ThuongHieu { get; set; }
        public DbSet<SanPham> SanPham { get; set; }
        public DbSet<SanPhamBienThe> SanPhamBienThe { get; set; }
        public DbSet<DonHang> DonHang { get; set; }
        public DbSet<DonHangChiTiet> DonHangChiTiet { get; set; }
        public DbSet<GioHangItem> GioHangItem { get; set; }
        public DbSet<YeuThichItem> YeuThichItem { get; set; }
        public DbSet<DanhGiaSanPham> DanhGiaSanPham { get; set; }
        public DbSet<MaGiamGia> MaGiamGia { get; set; }
        public DbSet<TinTuc> TinTuc { get; set; }
        public DbSet<Banner> Banner { get; set; }
        public DbSet<TinNhan> TinNhan { get; set; }
        public DbSet<ThongBao> ThongBao { get; set; }
        public DbSet<FlashSale> FlashSale { get; set; }
        public DbSet<FlashSaleSanPham> FlashSaleSanPham { get; set; }
        public DbSet<TaiKhoanNganHang> TaiKhoanNganHang { get; set; }
        public DbSet<XacNhanChuyenKhoan> XacNhanChuyenKhoan { get; set; }
        public DbSet<Popup> Popup { get; set; }
        public DbSet<ResetPasswordToken> ResetPasswordToken { get; set; }
        public DbSet<HangVip> HangVip { get; set; }
        public DbSet<LichSuDiem> LichSuDiem { get; set; }
        public DbSet<VoucherDoiDiem> VoucherDoiDiem { get; set; }
        public DbSet<Minigame> Minigame { get; set; }
        public DbSet<KetQuaMinigame> KetQuaMinigame { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình quan hệ
            modelBuilder.Entity<NguoiDung>()
                .HasMany(u => u.DanhSachDiaChi)
                .WithOne(a => a.NguoiDung)
                .HasForeignKey(a => a.NguoiDungId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NguoiDung>()
                .HasMany(u => u.DanhSachPhuongThucThanhToan)
                .WithOne(p => p.NguoiDung)
                .HasForeignKey(p => p.NguoiDungId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<NguoiDung>()
                .HasMany(u => u.DanhSachDonHang)
                .WithOne(o => o.NguoiDung)
                .HasForeignKey(o => o.NguoiDungId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DanhMuc>()
                .HasMany(c => c.DanhMucCon)
                .WithOne(c => c.DanhMucCha)
                .HasForeignKey(c => c.DanhMucChaId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SanPham>()
                .HasOne(p => p.DanhMuc)
                .WithMany(c => c.DanhSachSanPham)
                .HasForeignKey(p => p.DanhMucId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SanPham>()
                .HasOne(p => p.ThuongHieu)
                .WithMany(b => b.DanhSachSanPham)
                .HasForeignKey(p => p.ThuongHieuId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<SanPhamBienThe>()
                .HasOne(v => v.SanPham)
                .WithMany(p => p.DanhSachBienThe)
                .HasForeignKey(v => v.SanPhamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DonHang>()
                .HasMany(o => o.DanhSachChiTiet)
                .WithOne(d => d.DonHang)
                .HasForeignKey(d => d.DonHangId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DonHangChiTiet>()
                .HasOne(d => d.SanPham)
                .WithMany(p => p.DanhSachDonHangChiTiet)
                .HasForeignKey(d => d.SanPhamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<YeuThichItem>()
                .HasOne(y => y.NguoiDung)
                .WithMany(u => u.DanhSachYeuThich)
                .HasForeignKey(y => y.NguoiDungId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<YeuThichItem>()
                .HasOne(y => y.SanPham)
                .WithMany(p => p.DanhSachYeuThich)
                .HasForeignKey(y => y.SanPhamId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DanhGiaSanPham>()
                .HasOne(d => d.NguoiDung)
                .WithMany(u => u.DanhSachDanhGia)
                .HasForeignKey(d => d.NguoiDungId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DanhGiaSanPham>()
                .HasOne(d => d.SanPham)
                .WithMany(p => p.DanhSachDanhGia)
                .HasForeignKey(d => d.SanPhamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TinNhan>()
                .HasOne(t => t.NguoiDung)
                .WithMany()
                .HasForeignKey(t => t.NguoiDungId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TinNhan>()
                .HasOne(t => t.NguoiPhanHoi)
                .WithMany()
                .HasForeignKey(t => t.NguoiPhanHoiId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TinNhan>()
                .HasOne(t => t.SanPham)
                .WithMany()
                .HasForeignKey(t => t.SanPhamId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ThongBao>()
                .HasOne(t => t.NguoiDung)
                .WithMany()
                .HasForeignKey(t => t.NguoiDungId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ThongBao>()
                .HasOne(t => t.DonHang)
                .WithMany()
                .HasForeignKey(t => t.DonHangId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ThongBao>()
                .HasOne(t => t.SanPham)
                .WithMany()
                .HasForeignKey(t => t.SanPhamId)
                .OnDelete(DeleteBehavior.SetNull);

            // Indexes
            modelBuilder.Entity<NguoiDung>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<SanPham>()
                .HasIndex(p => p.Slug)
                .IsUnique();

            modelBuilder.Entity<DonHang>()
                .HasIndex(o => o.MaDonHang)
                .IsUnique();

            modelBuilder.Entity<MaGiamGia>()
                .HasIndex(m => m.Ma)
                .IsUnique();

            modelBuilder.Entity<FlashSaleSanPham>()
                .HasOne(fs => fs.FlashSale)
                .WithMany(f => f.DanhSachSanPham)
                .HasForeignKey(fs => fs.FlashSaleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FlashSaleSanPham>()
                .HasOne(fs => fs.SanPham)
                .WithMany()
                .HasForeignKey(fs => fs.SanPhamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<XacNhanChuyenKhoan>()
                .HasOne(x => x.DonHang)
                .WithMany()
                .HasForeignKey(x => x.DonHangId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<XacNhanChuyenKhoan>()
                .HasOne(x => x.NguoiDung)
                .WithMany()
                .HasForeignKey(x => x.NguoiDungId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<XacNhanChuyenKhoan>()
                .HasOne(x => x.TaiKhoanNganHang)
                .WithMany()
                .HasForeignKey(x => x.TaiKhoanNganHangId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình precision cho SoTien
            modelBuilder.Entity<XacNhanChuyenKhoan>()
                .Property(x => x.SoTien)
                .HasPrecision(18, 2);

            // Cấu hình quan hệ cho hệ thống điểm và VIP
            modelBuilder.Entity<NguoiDung>()
                .HasOne(u => u.HangVip)
                .WithMany(h => h.DanhSachNguoiDung)
                .HasForeignKey(u => u.HangVipId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<LichSuDiem>()
                .HasOne(l => l.NguoiDung)
                .WithMany()
                .HasForeignKey(l => l.NguoiDungId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LichSuDiem>()
                .HasOne(l => l.DonHang)
                .WithMany()
                .HasForeignKey(l => l.DonHangId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<LichSuDiem>()
                .HasOne(l => l.VoucherDoiDiem)
                .WithMany(v => v.DanhSachLichSuDiem)
                .HasForeignKey(l => l.VoucherDoiDiemId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<LichSuDiem>()
                .HasOne(l => l.Minigame)
                .WithMany()
                .HasForeignKey(l => l.MinigameId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<VoucherDoiDiem>()
                .HasOne(v => v.MaGiamGia)
                .WithMany()
                .HasForeignKey(v => v.MaGiamGiaId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<KetQuaMinigame>()
                .HasOne(k => k.NguoiDung)
                .WithMany()
                .HasForeignKey(k => k.NguoiDungId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<KetQuaMinigame>()
                .HasOne(k => k.Minigame)
                .WithMany(m => m.DanhSachKetQua)
                .HasForeignKey(k => k.MinigameId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<KetQuaMinigame>()
                .HasOne(k => k.VoucherDoiDiem)
                .WithMany()
                .HasForeignKey(k => k.VoucherDoiDiemId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}

