// Utility functions để xử lý thời gian theo múi giờ Việt Nam (UTC+7)

/**
 * Chuyển đổi UTC DateTime sang giờ Việt Nam (UTC+7)
 * @param {string|Date} utcDate - Ngày giờ UTC (ISO string hoặc Date object)
 * @returns {Date} - Date object theo giờ Việt Nam
 */
export const toVietnamTime = (utcDate) => {
  if (!utcDate) return null;
  
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
  // Thêm 7 giờ (UTC+7)
  const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return vietnamTime;
};

/**
 * Format ngày giờ theo định dạng Việt Nam
 * @param {string|Date} date - Ngày giờ
 * @param {object} options - Options cho Intl.DateTimeFormat
 * @returns {string} - Chuỗi ngày giờ đã format
 */
export const formatVietnamDateTime = (date, options = {}) => {
  if (!date) return '';
  
  const vietnamDate = toVietnamTime(date);
  if (!vietnamDate) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
    ...options,
  };
  
  return new Intl.DateTimeFormat('vi-VN', defaultOptions).format(vietnamDate);
};

/**
 * Format ngày theo định dạng Việt Nam (chỉ ngày, không có giờ)
 * @param {string|Date} date - Ngày
 * @returns {string} - Chuỗi ngày đã format (dd/MM/yyyy)
 */
export const formatVietnamDate = (date) => {
  return formatVietnamDateTime(date, {
    hour: undefined,
    minute: undefined,
  });
};

/**
 * Format ngày giờ đầy đủ theo định dạng Việt Nam
 * @param {string|Date} date - Ngày giờ
 * @returns {string} - Chuỗi ngày giờ đã format (dd/MM/yyyy HH:mm)
 */
export const formatVietnamDateTimeFull = (date) => {
  return formatVietnamDateTime(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format ngày giờ với giây
 * @param {string|Date} date - Ngày giờ
 * @returns {string} - Chuỗi ngày giờ đã format (dd/MM/yyyy HH:mm:ss)
 */
export const formatVietnamDateTimeWithSeconds = (date) => {
  return formatVietnamDateTime(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Format ngày giờ dạng "X phút trước", "X giờ trước", "X ngày trước"
 * @param {string|Date} date - Ngày giờ
 * @returns {string} - Chuỗi mô tả thời gian tương đối
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const vietnamDate = toVietnamTime(date);
  const now = new Date();
  const diffMs = now - vietnamDate;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return 'Vừa xong';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else {
    return formatVietnamDate(date);
  }
};

/**
 * Lấy thời gian hiện tại theo giờ Việt Nam
 * @returns {Date} - Date object theo giờ Việt Nam
 */
export const getVietnamTimeNow = () => {
  const now = new Date();
  return new Date(now.getTime() + 7 * 60 * 60 * 1000);
};


