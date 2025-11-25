using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopBanDoTheThao.Server.Helpers
{
    public static class DateTimeHelper
    {
        // Múi giờ Việt Nam: UTC+7
        private static readonly TimeSpan VietnamOffset = TimeSpan.FromHours(7);

        /// <summary>
        /// Lấy TimeZoneInfo cho múi giờ Việt Nam (UTC+7)
        /// </summary>
        private static TimeZoneInfo GetVietnamTimeZone()
        {
            try
            {
                // Thử tìm timezone trên Windows
                return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            }
            catch
            {
                try
                {
                    // Thử tìm timezone trên Linux
                    return TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
                }
                catch
                {
                    // Fallback: tạo timezone tùy chỉnh UTC+7
                    return TimeZoneInfo.CreateCustomTimeZone(
                        "Vietnam Standard Time",
                        VietnamOffset,
                        "Vietnam Standard Time",
                        "Vietnam Standard Time");
                }
            }
        }

        /// <summary>
        /// Lấy thời gian hiện tại theo múi giờ Việt Nam (UTC+7)
        /// </summary>
        public static DateTime GetVietnamTime()
        {
            return DateTime.UtcNow.Add(VietnamOffset);
        }

        /// <summary>
        /// Chuyển đổi UTC DateTime sang giờ Việt Nam
        /// </summary>
        public static DateTime ToVietnamTime(DateTime utcTime)
        {
            if (utcTime.Kind == DateTimeKind.Unspecified)
            {
                // Nếu không có timezone, giả định là UTC
                utcTime = DateTime.SpecifyKind(utcTime, DateTimeKind.Utc);
            }
            return utcTime.ToUniversalTime().Add(VietnamOffset);
        }

        /// <summary>
        /// Chuyển đổi giờ Việt Nam sang UTC
        /// </summary>
        public static DateTime ToUtcTime(DateTime vietnamTime)
        {
            if (vietnamTime.Kind == DateTimeKind.Unspecified)
            {
                // Nếu không có timezone, giả định là giờ Việt Nam, trừ đi offset
                return vietnamTime.Subtract(VietnamOffset);
            }
            // Nếu đã có timezone, chuyển sang UTC rồi trừ offset
            return vietnamTime.ToUniversalTime().Subtract(VietnamOffset);
        }

        /// <summary>
        /// Lấy ngày hiện tại (chỉ phần ngày, không có giờ) theo múi giờ Việt Nam
        /// </summary>
        public static DateTime GetVietnamDate()
        {
            return GetVietnamTime().Date;
        }
    }
}

