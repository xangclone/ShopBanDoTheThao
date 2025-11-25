import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { tinTucService } from '../services/tinTucService';
import { getImageUrl } from '../utils/imageUtils';
import { formatVietnamDate } from '../utils/dateUtils';
import { HiOutlineNewspaper, HiOutlineBookOpen, HiOutlineDocumentText, HiOutlineInbox, HiOutlineStar } from 'react-icons/hi';

function TinTuc() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tinTuc, setTinTuc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLoai, setSelectedLoai] = useState(searchParams.get('loai') || 'all');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  useEffect(() => {
    loadTinTuc();
  }, [selectedLoai, page]);

  const loadTinTuc = async () => {
    setLoading(true);
    try {
      const loai = selectedLoai === 'all' ? null : selectedLoai;
      const data = await tinTucService.getDanhSach(loai, page, 12);
      setTinTuc(data.data || data || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Lỗi khi tải tin tức:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoaiChange = (loai) => {
    setSelectedLoai(loai);
    setPage(1);
    const newParams = new URLSearchParams();
    if (loai !== 'all') {
      newParams.set('loai', loai);
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getLoaiLabel = (loai) => {
    switch (loai) {
      case 'TinTuc':
        return (
          <span className="flex items-center gap-2">
            <HiOutlineNewspaper className="w-5 h-5" />
            Tin tức
          </span>
        );
      case 'CamNang':
        return (
          <span className="flex items-center gap-2">
            <HiOutlineBookOpen className="w-5 h-5" />
            Cẩm nang
          </span>
        );
      case 'HuongDan':
        return (
          <span className="flex items-center gap-2">
            <HiOutlineDocumentText className="w-5 h-5" />
            Hướng dẫn
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-2">
            <HiOutlineNewspaper className="w-5 h-5" />
            Tin tức
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="flex items-center justify-center gap-3 text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <HiOutlineNewspaper className="w-10 h-10 text-pink-600" />
            <span>Tin tức & Cẩm nang</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-medium">
            Cập nhật những thông tin mới nhất về thể thao và sức khỏe
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slide-in-left bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border-2 border-pink-100/50 p-4">
          <button
            onClick={() => handleLoaiChange('all')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
              selectedLoai === 'all'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105'
                : 'bg-white/80 backdrop-blur-sm border-2 border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => handleLoaiChange('TinTuc')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
              selectedLoai === 'TinTuc'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105'
                : 'bg-white/80 backdrop-blur-sm border-2 border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <HiOutlineNewspaper className="w-5 h-5" />
              Tin tức
            </span>
          </button>
          <button
            onClick={() => handleLoaiChange('CamNang')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
              selectedLoai === 'CamNang'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105'
                : 'bg-white/80 backdrop-blur-sm border-2 border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <HiOutlineBookOpen className="w-5 h-5" />
              Cẩm nang
            </span>
          </button>
          <button
            onClick={() => handleLoaiChange('HuongDan')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
              selectedLoai === 'HuongDan'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105'
                : 'bg-white/80 backdrop-blur-sm border-2 border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <HiOutlineDocumentText className="w-5 h-5" />
              Hướng dẫn
            </span>
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6 px-4 py-3 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border-2 border-pink-100/50 text-center">
          <p className="text-gray-700 font-semibold">
            Tìm thấy <span className="text-pink-600 font-bold text-lg">{totalCount}</span> bài viết
          </p>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-600 mx-auto"></div>
            <p className="mt-6 text-gray-600 font-medium text-lg">Đang tải...</p>
          </div>
        ) : tinTuc.length === 0 ? (
          <div className="text-center py-16 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl border-2 border-pink-100/50">
            <div className="flex justify-center mb-6">
              <HiOutlineInbox className="w-24 h-24 text-pink-500" />
            </div>
            <p className="text-gray-600 text-xl font-semibold">Chưa có tin tức nào</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {tinTuc.map((tt, index) => (
                <Link
                  key={tt.id}
                  to={`/tin-tuc/${tt.id}`}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 animate-scale-in border-2 border-pink-100/50 hover:border-pink-300/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
                    <img
                      src={getImageUrl(tt.hinhAnh)}
                      alt={tt.tieuDe}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/30 to-transparent"></div>
                    {tt.loai && (
                      <span className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl backdrop-blur-sm border-2 border-white/30">
                        {getLoaiLabel(tt.loai)}
                      </span>
                    )}
                    {tt.noiBat && (
                      <span className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl backdrop-blur-sm border-2 border-white/30">
                        <HiOutlineStar className="w-4 h-4" />
                        Nổi bật
                      </span>
                    )}
                  </div>
                  <div className="p-6 bg-gradient-to-br from-white to-pink-50/30">
                    <h3 className="font-bold text-xl mb-3 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {tt.tieuDe}
                    </h3>
                    {tt.tomTat && (
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                        {tt.tomTat}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-pink-100">
                      <span className="flex items-center gap-2 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatVietnamDate(tt.ngayDang)}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {tt.soLuotXem || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-10">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-5 py-3 border-2 border-pink-200 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 font-semibold text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none"
                >
                  ← Trước
                </button>
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-5 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md hover:shadow-lg ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-pink-500 shadow-xl scale-110'
                            : 'bg-white/80 backdrop-blur-sm border-2 border-pink-100 text-gray-700 hover:border-pink-300 hover:bg-pink-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return <span key={pageNum} className="px-2 text-gray-500 font-bold">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-5 py-3 border-2 border-pink-200 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 font-semibold text-gray-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none"
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TinTuc;
