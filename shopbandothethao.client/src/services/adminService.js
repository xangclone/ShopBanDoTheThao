import api from './api';

export const adminService = {
  getThongKeTongQuan: async () => {
    const response = await api.get('/admin/thongke/tongquan');
    return response.data;
  },

  getThongKeDoanhThu: async (loai, nam, quy) => {
    const params = {};
    if (loai) params.loai = loai;
    if (nam) params.nam = nam;
    if (quy) params.quy = quy;
    const response = await api.get('/admin/thongke/doanhthu', { params });
    return response.data;
  },

  getThongKeSanPham: async (limit = 10) => {
    const response = await api.get('/admin/thongke/sanpham', { params: { limit } });
    return response.data;
  },

  getDanhSachDonHang: async (trangThai, page = 1, pageSize = 20) => {
    const params = { page, pageSize };
    if (trangThai) params.trangThai = trangThai;
    const response = await api.get('/admin/donhang', { params });
    return response.data;
  },

  capNhatTrangThaiDonHang: async (id, trangThai) => {
    const response = await api.put(`/admin/donhang/${id}/trangthai`, { trangThai });
    return response.data;
  },

  getDonHangById: async (id) => {
    const response = await api.get(`/admin/donhang/${id}`);
    return response.data;
  },

  getDonHangByMaDonHang: async (maDonHang) => {
    const response = await api.get(`/admin/donhang/madon/${maDonHang}`);
    return response.data;
  },

  getDanhSachNguoiDung: async (timKiem, page = 1, pageSize = 20) => {
    const params = { page, pageSize };
    if (timKiem) params.timKiem = timKiem;
    const response = await api.get('/admin/nguoidung', { params });
    return response.data;
  },

  capNhatTrangThaiNguoiDung: async (id, dangHoatDong) => {
    const response = await api.put(`/admin/nguoidung/${id}/trangthai`, { dangHoatDong });
    return response.data;
  },

  // Quản lý Sản phẩm
  getDanhSachSanPham: async (timKiem, danhMucId, thuongHieuId, page = 1, pageSize = 20) => {
    const params = { page, pageSize };
    if (timKiem) params.timKiem = timKiem;
    if (danhMucId) params.danhMucId = danhMucId;
    if (thuongHieuId) params.thuongHieuId = thuongHieuId;
    const response = await api.get('/admin/sanpham', { params });
    return response.data;
  },

  getSanPhamById: async (id) => {
    const response = await api.get(`/admin/sanpham/${id}`);
    return response.data;
  },

  taoSanPham: async (data) => {
    const response = await api.post('/admin/sanpham', data);
    return response.data;
  },

  capNhatSanPham: async (id, data) => {
    const response = await api.put(`/admin/sanpham/${id}`, data);
    return response.data;
  },

  xoaSanPham: async (id) => {
    const response = await api.delete(`/admin/sanpham/${id}`);
    return response.data;
  },

  // Quản lý Danh mục
  getDanhSachDanhMuc: async () => {
    const response = await api.get('/admin/danhmuc');
    return response.data;
  },

  taoDanhMuc: async (data) => {
    const response = await api.post('/admin/danhmuc', data);
    return response.data;
  },

  capNhatDanhMuc: async (id, data) => {
    const response = await api.put(`/admin/danhmuc/${id}`, data);
    return response.data;
  },

  xoaDanhMuc: async (id) => {
    const response = await api.delete(`/admin/danhmuc/${id}`);
    return response.data;
  },

  // Quản lý Thương hiệu
  getDanhSachThuongHieu: async () => {
    const response = await api.get('/admin/thuonghieu');
    return response.data;
  },

  taoThuongHieu: async (data) => {
    const response = await api.post('/admin/thuonghieu', data);
    return response.data;
  },

  capNhatThuongHieu: async (id, data) => {
    const response = await api.put(`/admin/thuonghieu/${id}`, data);
    return response.data;
  },

  xoaThuongHieu: async (id) => {
    const response = await api.delete(`/admin/thuonghieu/${id}`);
    return response.data;
  },

  // Quản lý Mã giảm giá
  getDanhSachMaGiamGia: async () => {
    const response = await api.get('/admin/magiamgia');
    return response.data;
  },

  taoMaGiamGia: async (data) => {
    const response = await api.post('/admin/magiamgia', data);
    return response.data;
  },

  capNhatMaGiamGia: async (id, data) => {
    const response = await api.put(`/admin/magiamgia/${id}`, data);
    return response.data;
  },

  xoaMaGiamGia: async (id) => {
    const response = await api.delete(`/admin/magiamgia/${id}`);
    return response.data;
  },

  // Upload ảnh
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Quản lý kho
  getDanhSachKho: async (sanPhamId, kichThuoc, mauSac, timKiem, page = 1, pageSize = 50) => {
    const params = { page, pageSize };
    if (sanPhamId) params.sanPhamId = sanPhamId;
    if (kichThuoc) params.kichThuoc = kichThuoc;
    if (mauSac) params.mauSac = mauSac;
    if (timKiem) params.timKiem = timKiem;
    const response = await api.get('/admin/kho', { params });
    return response.data;
  },

  getThongKeKho: async () => {
    const response = await api.get('/admin/kho/thongke');
    return response.data;
  },

  capNhatSoLuongKho: async (id, soLuongTon) => {
    const response = await api.put(`/admin/kho/${id}/soluong`, { soLuongTon });
    return response.data;
  },

  taoBienThe: async (data) => {
    const response = await api.post('/admin/kho', data);
    return response.data;
  },

  capNhatBienThe: async (id, data) => {
    const response = await api.put(`/admin/kho/${id}`, data);
    return response.data;
  },

  xoaBienThe: async (id) => {
    const response = await api.delete(`/admin/kho/${id}`);
    return response.data;
  },

  // Quản lý Banner
  getDanhSachBanner: async (page = 1, pageSize = 20) => {
    const response = await api.get('/admin/banner', { params: { page, pageSize } });
    return response.data;
  },

  getBannerById: async (id) => {
    const response = await api.get(`/admin/banner/${id}`);
    return response.data;
  },

  taoBanner: async (data) => {
    const response = await api.post('/admin/banner', data);
    return response.data;
  },

  capNhatBanner: async (id, data) => {
    const response = await api.put(`/admin/banner/${id}`, data);
    return response.data;
  },

  xoaBanner: async (id) => {
    const response = await api.delete(`/admin/banner/${id}`);
    return response.data;
  },

  // Quản lý Tin Tức
  getDanhSachTinTuc: async (loai, timKiem, page = 1, pageSize = 20) => {
    const params = { page, pageSize };
    if (loai) params.loai = loai;
    if (timKiem) params.timKiem = timKiem;
    const response = await api.get('/admin/tintuc', { params });
    return response.data;
  },

  getTinTucById: async (id) => {
    const response = await api.get(`/admin/tintuc/${id}`);
    return response.data;
  },

  taoTinTuc: async (data) => {
    const response = await api.post('/admin/tintuc', data);
    return response.data;
  },

  capNhatTinTuc: async (id, data) => {
    const response = await api.put(`/admin/tintuc/${id}`, data);
    return response.data;
  },

  xoaTinTuc: async (id) => {
    const response = await api.delete(`/admin/tintuc/${id}`);
    return response.data;
  },

  // Quản lý Đánh giá
  getDanhSachDanhGia: async (timKiem, sanPhamId, hienThi, page = 1, pageSize = 20) => {
    const params = { page, pageSize };
    if (timKiem) params.timKiem = timKiem;
    if (sanPhamId) params.sanPhamId = sanPhamId;
    if (hienThi !== undefined && hienThi !== null) params.hienThi = hienThi;
    const response = await api.get('/admin/danhgia', { params });
    return response.data;
  },

  capNhatHienThiDanhGia: async (id, hienThi) => {
    const response = await api.put(`/admin/danhgia/${id}/hienthi`, { hienThi });
    return response.data;
  },

  xoaDanhGia: async (id) => {
    const response = await api.delete(`/admin/danhgia/${id}`);
    return response.data;
  },

  // Quản lý Thông báo
  taoThongBaoDealHot: async (data) => {
    const response = await api.post('/admin/thongbao/deal-hot', data);
    return response.data;
  },
};

