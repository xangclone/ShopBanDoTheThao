import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tinTucService } from '../services/tinTucService';
import { getImageUrl } from '../utils/imageUtils';
import { formatVietnamDateTime, formatVietnamDate } from '../utils/dateUtils';

function ChiTietTinTuc() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tinTuc, setTinTuc] = useState(null);
  const [tinTucLienQuan, setTinTucLienQuan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTinTuc();
    loadTinTucLienQuan();
  }, [id]);

  const loadTinTuc = async () => {
    try {
      const data = await tinTucService.getById(id);
      setTinTuc(data);
    } catch (error) {
      console.error('Lỗi khi tải tin tức:', error);
      navigate('/tin-tuc');
    } finally {
      setLoading(false);
    }
  };

  const loadTinTucLienQuan = async () => {
    try {
      const data = await tinTucService.getDanhSach(tinTuc?.loai || null, 1, 4);
      const filtered = (data.data || data || []).filter(tt => tt.id !== parseInt(id));
      setTinTucLienQuan(filtered.slice(0, 3));
    } catch (error) {
      console.error('Lỗi khi tải tin tức liên quan:', error);
    }
  };

  useEffect(() => {
    if (tinTuc) {
      loadTinTucLienQuan();
    }
  }, [tinTuc]);

  const getLoaiLabel = (loai) => {
    switch (loai) {
      case 'TinTuc':
        return '📰 Tin tức';
      case 'CamNang':
        return '📚 Cẩm nang';
      case 'HuongDan':
        return '📖 Hướng dẫn';
      default:
        return '📰 Tin tức';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!tinTuc) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 text-lg mb-4">Không tìm thấy tin tức</p>
        <Link to="/tin-tuc" className="text-blue-600 hover:underline">
          Quay về danh sách tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2 text-gray-600">
          <li>
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
          </li>
          <li>/</li>
          <li>
            <Link to="/tin-tuc" className="hover:text-blue-600">Tin tức</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{tinTuc.tieuDe}</li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          {tinTuc.loai && (
            <span className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {getLoaiLabel(tinTuc.loai)}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            {tinTuc.tieuDe}
          </h1>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatVietnamDateTime(tinTuc.ngayDang, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {tinTuc.soLuotXem || 0} lượt xem
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {tinTuc.hinhAnh && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-xl animate-scale-in">
            <img
              src={getImageUrl(tinTuc.hinhAnh)}
              alt={tinTuc.tieuDe}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
              }}
            />
          </div>
        )}

        {/* Summary */}
        {tinTuc.tomTat && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-600 animate-slide-in-left">
            <p className="text-lg text-gray-700 leading-relaxed italic">
              {tinTuc.tomTat}
            </p>
          </div>
        )}

        {/* Content */}
        {tinTuc.noiDung && (
          <div className="prose prose-lg max-w-none mb-12 animate-fade-in">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: tinTuc.noiDung }}
            />
          </div>
        )}

        {/* Share Buttons */}
        <div className="mb-12 p-6 bg-gray-50 rounded-xl animate-slide-in-right">
          <h3 className="font-semibold mb-4">Chia sẻ bài viết:</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const url = window.location.href;
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button
              onClick={() => {
                const url = window.location.href;
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(tinTuc.tieuDe)}`, '_blank');
              }}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép link!');
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Sao chép link
            </button>
          </div>
        </div>

        {/* Related News */}
        {tinTucLienQuan.length > 0 && (
          <div className="mt-12 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">📰 Tin tức liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tinTucLienQuan.map((tt) => (
                <Link
                  key={tt.id}
                  to={`/tin-tuc/${tt.id}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(tt.hinhAnh)}
                      alt={tt.tieuDe}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {tt.tieuDe}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatVietnamDate(tt.ngayDang)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            to="/tin-tuc"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay về danh sách tin tức
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ChiTietTinTuc;


