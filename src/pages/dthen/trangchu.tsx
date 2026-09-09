import React from "react";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import Body from "../../components/body";
import { Link } from "react-router-dom";

const DthenTrangchu: React.FC = () => {
  const handbookSections = [
    {
      title: "NỘI QUY THI ĐẤU",
      desc: "Hướng dẫn thời gian hẹn đá, quy tắc ứng xử văn minh và cách xử lý khi gặp sự cố ngắt kết nối (diss mạng / văng game).",
      link: "/dthen/noiquy",
      icon: "fa-shield-halved",
      btnText: "ĐỌC NỘI QUY",
    },
    {
      title: "THỂ THỨC THI ĐẤU",
      desc: "Tìm hiểu cách chia bảng, nguyên tắc tính điểm vòng tròn và quy định nhánh đấu loại trực tiếp để tranh vé đi tiếp.",
      link: "/dthen/thethuc",
      icon: "fa-sitemap",
      btnText: "XEM THỂ THỨC",
    },
    {
      title: "QUY ĐỊNH ĐỘI HÌNH",
      desc: "Hướng dẫn xây dựng đội hình chuẩn mực, thiết lập sơ đồ chiến thuật hợp lệ và các nguyên tắc thi đấu công bằng.",
      link: "/dthen/quydinh",
      icon: "fa-users-gear",
      btnText: "XEM QUY ĐỊNH",
    },
    {
      title: "LỊCH THI ĐẤU & BXH",
      desc: "Theo dõi kết quả các trận đấu vừa diễn ra, lịch thi đấu vòng tiếp theo và thứ hạng điểm số của từng HLV theo thời gian thực.",
      link: "/dthen/ltd",
      icon: "fa-table-list",
      btnText: "XEM BẢNG ĐIỂM",
    },
    {
      title: "BẢNG VÀNG VÔ ĐỊCH",
      desc: "Khám phá phòng truyền thống Hall of Fame – nơi ghi danh và tôn vinh các nhà vô địch xuất sắc nhất của ĐThén FCO.",
      link: "/dthen/xephang",
      icon: "fa-crown",
      btnText: "HALL OF FAME",
    },
    {
      title: "CƠ CẤU GIẢI THƯỞNG",
      desc: "Chi tiết các mốc tiền thưởng, cúp lưu niệm và quyền lợi dành cho các HLV đạt thành tích cao nhất giải đấu.",
      link: "/dthen/giaithuong",
      icon: "fa-trophy",
      btnText: "XEM GIẢI THƯỞNG",
    },
  ];

  return (
    <>
      <Banner
        title="FC ONLINE ĐTHÉN FCO ™"
        subtitle="Cổng thông tin & Bảng xếp hạng giải đấu FC Online ĐThén FCO ™"
        badge="CẨM NANG GIẢI ĐẤU CHÍNH THỨC"
      />

      <Body>
        {/* Official Notice Bar */}
        <div className="mb-6 sm:mb-8 p-3.5 sm:p-4 rounded-2xl bg-blue-50/90 border border-blue-300/80 text-center shadow-xs">
          <p className="font-oswald text-sm sm:text-lg font-bold text-blue-950 uppercase tracking-wide">
            📢 ĐÂY LÀ WEBSITE CHÍNH THỨC CỦA GIẢI ĐẤU CỘNG ĐỒNG FC ONLINE ĐTHÉN FCO ™
          </p>
          <p className="text-[11px] sm:text-xs text-blue-800 mt-1 font-medium">
            Giải đấu do <strong className="text-blue-950">Admin ĐThén</strong> sáng lập và tổ chức.
          </p>
        </div>

        {/* Overview Box */}
        <div className="mb-8 sm:mb-12 rounded-2xl sm:rounded-3xl relative overflow-hidden border border-blue-200/90 shadow-lg bg-gradient-to-b from-white via-[#f8fbff] to-[#f0f6ff] text-slate-800 p-4 sm:p-8 md:p-10 space-y-5 sm:space-y-8">
          {/* Subtle Ambient Dome Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 70% 40% at 50% 0%, rgba(14, 165, 233, 0.2), transparent 70%),
                radial-gradient(circle at 10% 90%, rgba(99, 102, 241, 0.15), transparent 50%),
                radial-gradient(circle at 90% 90%, rgba(245, 158, 11, 0.15), transparent 50%)
              `,
            }}
          />

          {/* Top Multi-Color Neon LED Beam */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#0ea5e9] via-[#6366f1] to-[#f59e0b] animate-gradient-flow" />

          {/* Header */}
          <div className="border-b border-blue-100 pb-4 sm:pb-6 space-y-2 sm:space-y-2.5 relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-blue-100/80 border border-blue-300 text-blue-900 text-[10px] sm:text-xs font-fco font-bold uppercase tracking-wider shadow-2xs transition-transform hover:scale-105">
              <i className="fa-solid fa-trophy text-amber-500"></i>
              <span>WELCOME TO ĐTHÉN FCO™</span>
            </div>

            <h2 className="font-fco text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase text-slate-900 tracking-tight leading-tight">
              GIỚI THIỆU VỀ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-600 animate-gradient-flow">ĐTHÉN FCO™</span>
            </h2>

            <p className="text-blue-900 font-fco font-bold text-[11px] sm:text-base tracking-widest uppercase">
              NƠI ĐAM MÊ HỘI TỤ – NƠI NHỮNG NHÀ VÔ ĐỊCH ĐƯỢC GỌI TÊN!
            </p>
          </div>

          {/* Main Story Paragraphs */}
          <div className="space-y-3.5 sm:space-y-4 text-slate-700 text-xs sm:text-base leading-relaxed relative z-10">
            <p>
              <strong className="text-slate-900 font-bold">GIẢI BÓNG ĐÁ THỂ THAO ĐIỆN TỬ FC ONLINE ĐTHÉN FCO™</strong> là sân chơi thi đấu trực tuyến uy tín dành cho cộng đồng đam mê <strong className="text-blue-800 font-bold">FC Online</strong>. Đây là nơi các Huấn luyện viên (HLV) cùng nhau so tài chiến thuật, tôi luyện bản lĩnh và chinh phục những trận cầu rực lửa trên sân cỏ ảo.
            </p>
            <p>
              Không chỉ dừng lại ở một giải đấu thể thao điện tử, <strong className="text-indigo-800 font-bold">ĐThén FCO™</strong> là nhịp cầu gắn kết cộng đồng game thủ văn minh, đoàn kết và nhiệt huyết. Mỗi trận đấu là một cuộc đấu trí chiến thuật đỉnh cao, nơi từng đường chuyền, pha xử lý và sự quyết đoán đều có thể định đoạt ngôi vương.
            </p>
          </div>

          {/* 3 Core Quick Access: Nội quy, Lịch thi đấu, Thể thức thi đấu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5 pt-1 sm:pt-2 relative z-10">
            {/* Card 1: Nội quy */}
            <Link
              to="/dthen/noiquy"
              className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/80 border-2 border-blue-200/90 dark:border-blue-800/60 shadow-sm space-y-2.5 sm:space-y-3 hover:border-blue-500 hover:shadow-xl card-hover-fx transition-all group block relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-lg sm:text-xl shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <span className="text-[9px] sm:text-[10px] font-oswald font-black px-2.5 py-0.5 sm:py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  ĐIỀU LỆ
                </span>
              </div>
              <div>
                <h3 className="font-fco font-black text-slate-900 dark:text-white text-sm sm:text-base uppercase tracking-wide group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between">
                  <span>NỘI QUY GIẢI ĐẤU</span>
                  <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform text-blue-600 dark:text-blue-400"></i>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  Quy định giờ hẹn đá, chuẩn mực ứng xử Fair-play và quy trình xử lý sự cố gián đoạn mạng khi thi đấu.
                </p>
              </div>
            </Link>

            {/* Card 2: Lịch thi đấu */}
            <Link
              to="/dthen/ltd"
              className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/80 border-2 border-indigo-200/90 dark:border-indigo-800/60 shadow-sm space-y-2.5 sm:space-y-3 hover:border-indigo-500 hover:shadow-xl card-hover-fx transition-all group block relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-800 text-white flex items-center justify-center text-lg sm:text-xl shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-calendar-days"></i>
                </div>
                <span className="text-[9px] sm:text-[10px] font-oswald font-black px-2.5 py-0.5 sm:py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 uppercase tracking-wider group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  LIVE FIXTURES
                </span>
              </div>
              <div>
                <h3 className="font-fco font-black text-slate-900 dark:text-white text-sm sm:text-base uppercase tracking-wide group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                  <span>LỊCH THI ĐẤU & BXH</span>
                  <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform text-indigo-600 dark:text-indigo-400"></i>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  Theo dõi lịch trình các bảng đấu, cập nhật kết quả từng vòng và thứ hạng điểm số các HLV trực tiếp.
                </p>
              </div>
            </Link>

            {/* Card 3: Thể thức thi đấu */}
            <Link
              to="/dthen/thethuc"
              className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/80 border-2 border-amber-200/90 dark:border-amber-800/60 shadow-sm space-y-2.5 sm:space-y-3 hover:border-amber-500 hover:shadow-xl card-hover-fx transition-all group block relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-lg sm:text-xl shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-sitemap"></i>
                </div>
                <span className="text-[9px] sm:text-[10px] font-oswald font-black px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 uppercase tracking-wider group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  FORMAT CHUẨN
                </span>
              </div>
              <div>
                <h3 className="font-fco font-black text-slate-900 dark:text-white text-sm sm:text-base uppercase tracking-wide group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>THỂ THỨC THI ĐẤU</span>
                  <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform text-amber-600 dark:text-amber-400"></i>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  Cơ chế chia 8 bảng chuẩn World Cup đá vòng tròn tính điểm (Top 2 vào Vòng 1/8) và phân nhánh Knockout BO3.
                </p>
              </div>
            </Link>
          </div>

          {/* Arena Callout */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 text-white p-4 sm:p-8 text-center shadow-md card-hover-fx">
            <div className="relative z-10 space-y-2 sm:space-y-2.5 max-w-xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-900/80 border border-blue-400/50 text-blue-300 text-[10px] sm:text-[11px] font-fco font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-ping"></span>
                <span>CHINH PHỤC NGÔI VƯƠNG MÙA 1</span>
              </div>

              <h3 className="font-fco font-black text-base sm:text-xl md:text-2xl uppercase tracking-wide text-white drop-shadow">
                XÂY DỰNG ĐỘI HÌNH – CHINH PHỤC ĐỐI THỦ – VIẾT TÊN MÌNH LÊN BẢNG VÀNG!
              </h3>

              <p className="text-xs sm:text-sm text-blue-300 font-fco font-semibold tracking-wide flex items-center justify-center space-x-1.5 pt-1">
                <span>🔥</span>
                <span>Bạn đã sẵn sàng bước vào sân đấu và trở thành nhà vô địch ĐThén FCO đầu tiên?</span>
                <span>🔥</span>
              </p>
            </div>
          </div>
        </div>

        {/* Handbook Navigation Grid */}
        <div className="mb-8 sm:mb-10">
          <div className="border-b-2 border-blue-700 pb-2 mb-4 sm:mb-6 flex items-center justify-between">
            <h2 className="font-oswald text-lg sm:text-2xl font-bold uppercase text-slate-900 tracking-wide">
              MỤC LỤC TRA CỨU GIẢI ĐẤU
            </h2>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Chọn chuyên mục để xem chi tiết</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
            {handbookSections.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-6 rounded-2xl portal-card flex flex-col justify-between hover:border-blue-500 hover:shadow-lg card-hover-fx transition-all group space-y-3 sm:space-y-0"
              >
                <div>
                  <div className="flex items-center space-x-3 sm:space-x-3.5 mb-2 sm:mb-3">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center text-base sm:text-lg shadow-sm shadow-blue-700/30 group-hover:scale-110 transition-transform">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <h3 className="font-oswald text-base sm:text-xl font-bold uppercase text-slate-900 group-hover:text-blue-700 transition-colors tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-normal">
                    {item.desc}
                  </p>
                </div>

                <Link
                  to={item.link}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-oswald text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-800/20 group-hover:shadow-blue-700/40 btn-shimmer"
                >
                  <span>{item.btnText}</span>
                  <i className="fa-solid fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </Body>

      <Footer />
    </>
  );
};

export default DthenTrangchu;
