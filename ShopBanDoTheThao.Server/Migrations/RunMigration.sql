-- Script để chạy migration AddDiemVipMinigameSystem thủ công
-- Chạy script này trong SQL Server Management Studio hoặc Azure Data Studio

-- 1. Thêm cột DiemKhaDung và HangVipId vào bảng NguoiDung
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[NguoiDung]') AND name = 'DiemKhaDung')
BEGIN
    ALTER TABLE [dbo].[NguoiDung] ADD [DiemKhaDung] int NOT NULL DEFAULT 0;
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[NguoiDung]') AND name = 'HangVipId')
BEGIN
    ALTER TABLE [dbo].[NguoiDung] ADD [HangVipId] int NULL;
END

-- 2. Tạo bảng HangVip
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[HangVip]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[HangVip] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [Ten] nvarchar(50) NOT NULL,
        [MoTa] nvarchar(200) NULL,
        [MauSac] nvarchar(50) NULL,
        [Icon] nvarchar(500) NULL,
        [DiemToiThieu] int NOT NULL,
        [DiemToiDa] int NOT NULL,
        [TiLeTichDiem] decimal(18,2) NOT NULL,
        [TiLeGiamGia] decimal(18,2) NOT NULL,
        [ThuTu] int NOT NULL,
        [DangHoatDong] bit NOT NULL,
        [NgayTao] datetime2 NOT NULL,
        CONSTRAINT [PK_HangVip] PRIMARY KEY ([Id])
    );
END

-- 3. Tạo bảng Minigame
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Minigame]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Minigame] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [Ten] nvarchar(100) NOT NULL,
        [MoTa] nvarchar(500) NULL,
        [LoaiGame] nvarchar(50) NOT NULL,
        [HinhAnh] nvarchar(500) NULL,
        [SoDiemCanThi] int NOT NULL,
        [SoLanChoiToiDa] int NOT NULL,
        [DangHoatDong] bit NOT NULL,
        [NgayBatDau] datetime2 NOT NULL,
        [NgayKetThuc] datetime2 NULL,
        [NgayTao] datetime2 NOT NULL,
        CONSTRAINT [PK_Minigame] PRIMARY KEY ([Id])
    );
END

-- 4. Tạo bảng VoucherDoiDiem
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[VoucherDoiDiem]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[VoucherDoiDiem] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [Ten] nvarchar(100) NOT NULL,
        [MoTa] nvarchar(500) NULL,
        [HinhAnh] nvarchar(500) NULL,
        [SoDiemCanDoi] int NOT NULL,
        [LoaiVoucher] nvarchar(50) NOT NULL,
        [MaGiamGiaId] int NULL,
        [LoaiGiamGia] nvarchar(50) NULL,
        [GiaTriGiamGia] decimal(18,2) NULL,
        [GiaTriDonHangToiThieu] decimal(18,2) NULL,
        [GiaTriGiamGiaToiDa] decimal(18,2) NULL,
        [SoLuong] int NOT NULL,
        [SoLuongDaDoi] int NOT NULL,
        [NgayBatDau] datetime2 NOT NULL,
        [NgayKetThuc] datetime2 NULL,
        [DangHoatDong] bit NOT NULL,
        [ThuTuHienThi] int NOT NULL,
        [NgayTao] datetime2 NOT NULL,
        CONSTRAINT [PK_VoucherDoiDiem] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_VoucherDoiDiem_MaGiamGia_MaGiamGiaId] FOREIGN KEY ([MaGiamGiaId]) REFERENCES [dbo].[MaGiamGia] ([Id])
    );
END

-- 5. Tạo bảng LichSuDiem
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[LichSuDiem]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[LichSuDiem] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [NguoiDungId] int NOT NULL,
        [Loai] nvarchar(50) NOT NULL,
        [MoTa] nvarchar(200) NOT NULL,
        [SoDiem] int NOT NULL,
        [DiemTruoc] int NOT NULL,
        [DiemSau] int NOT NULL,
        [DonHangId] int NULL,
        [VoucherDoiDiemId] int NULL,
        [MinigameId] int NULL,
        [GhiChu] nvarchar(500) NULL,
        [NgayTao] datetime2 NOT NULL,
        CONSTRAINT [PK_LichSuDiem] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_LichSuDiem_NguoiDung_NguoiDungId] FOREIGN KEY ([NguoiDungId]) REFERENCES [dbo].[NguoiDung] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_LichSuDiem_DonHang_DonHangId] FOREIGN KEY ([DonHangId]) REFERENCES [dbo].[DonHang] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_LichSuDiem_VoucherDoiDiem_VoucherDoiDiemId] FOREIGN KEY ([VoucherDoiDiemId]) REFERENCES [dbo].[VoucherDoiDiem] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_LichSuDiem_Minigame_MinigameId] FOREIGN KEY ([MinigameId]) REFERENCES [dbo].[Minigame] ([Id]) ON DELETE NO ACTION
    );
END

-- 6. Tạo bảng KetQuaMinigame
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[KetQuaMinigame]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[KetQuaMinigame] (
        [Id] int IDENTITY(1,1) NOT NULL,
        [NguoiDungId] int NOT NULL,
        [MinigameId] int NOT NULL,
        [LoaiPhanThuong] nvarchar(50) NULL,
        [SoDiemNhanDuoc] int NULL,
        [VoucherDoiDiemId] int NULL,
        [MoTa] nvarchar(500) NULL,
        [TrangThai] nvarchar(50) NOT NULL,
        [NgayChoi] datetime2 NOT NULL,
        CONSTRAINT [PK_KetQuaMinigame] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_KetQuaMinigame_NguoiDung_NguoiDungId] FOREIGN KEY ([NguoiDungId]) REFERENCES [dbo].[NguoiDung] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_KetQuaMinigame_Minigame_MinigameId] FOREIGN KEY ([MinigameId]) REFERENCES [dbo].[Minigame] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_KetQuaMinigame_VoucherDoiDiem_VoucherDoiDiemId] FOREIGN KEY ([VoucherDoiDiemId]) REFERENCES [dbo].[VoucherDoiDiem] ([Id]) ON DELETE NO ACTION
    );
END

-- 7. Tạo foreign key từ NguoiDung đến HangVip
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_NguoiDung_HangVip_HangVipId')
BEGIN
    ALTER TABLE [dbo].[NguoiDung]
    ADD CONSTRAINT [FK_NguoiDung_HangVip_HangVipId] 
    FOREIGN KEY ([HangVipId]) REFERENCES [dbo].[HangVip] ([Id]) ON DELETE NO ACTION;
END

PRINT 'Migration completed successfully!';








