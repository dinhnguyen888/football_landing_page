import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import { Link } from "react-router-dom";

const Trangchu: React.FC = () => {
  const handbookSections = [
    {
      title: "NỘI QUY THI ĐẤU",
      desc: "Hướng dẫn thời gian hẹn đá, quy tắc ứng xử văn minh và cách xử lý khi gặp sự cố ngắt kết nối (diss mạng / văng game).",
      link: "/noiquy",
      icon: "fa-shield-halved",
      btnText: "ĐỌC NỘI QUY",
    },
    {
      title: "THỂ THỨC THI ĐẤU",
      desc: "Tìm hiểu cách chia bảng, nguyên tắc tính điểm vòng tròn và quy định nhánh đấu loại trực tiếp để tranh vé đi tiếp.",
      link: "/thethuc",
      icon: "fa-sitemap",
      btnText: "XEM THỂ THỨC",
    },
    {
      title: "QUY ĐỊNH ĐỘI HÌNH",
      desc: "Hướng dẫn xây dựng đội hình chuẩn mực, thiết lập sơ đồ chiến thuật hợp lệ và các nguyên tắc thi đấu công bằng.",
      link: "/quydinh",
      icon: "fa-users-gear",
      btnText: "XEM QUY ĐỊNH",
    },
    {
      title: "LỊCH THI ĐẤU & BXH",
      desc: "Theo dõi kết quả các trận đấu vừa diễn ra, lịch thi đấu vòng tiếp theo và thứ hạng điểm số của từng HLV theo thời gian thực.",
      link: "/ltd",
      icon: "fa-table-list",
      btnText: "XEM BẢNG ĐIỂM",
    },
    {
      title: "BẢNG VÀNG VÔ ĐỊCH",
      desc: "Khám phá phòng truyền thống Hall of Fame – nơi ghi danh và tôn vinh các nhà vô địch xuất sắc nhất qua từng mùa giải.",
      link: "/xephang",
      icon: "fa-crown",
      btnText: "HALL OF FAME",
    },
    {
      title: "CƠ CẤU GIẢI THƯỞNG",
      desc: "Chi tiết các mốc tiền thưởng, cúp lưu niệm và quyền lợi dành cho các HLV đạt thành tích cao nhất giải đấu.",
      link: "/giaithuong",
      icon: "fa-trophy",
      btnText: "XEM GIẢI THƯỞNG",
    },
  ];

  return (
    <>
      <Banner
        title="FC ONLINE SAO VÀNG CUP ™"
        subtitle="Cổng thông tin & Bảng xếp hạng giải đấu FC Online Sao Vàng Cup ™"
        badge="CẨM NANG GIẢI ĐẤU CHÍNH THỨC"
      />

      <Body>
        {/* Official Notice Bar - Bright FC Online Event Style */}
        <div className="mb-8 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-300/80 text-center shadow-xs">
          <p className="font-oswald text-base sm:text-lg font-bold text-emerald-900 uppercase tracking-wide">
            📢 ĐÂY LÀ WEBSITE CHÍNH THỨC CỦA GIẢI ĐẤU CỘNG ĐỒNG FC ONLINE SAO VÀNG CUP ™
          </p>
          <p className="text-xs text-emerald-700 mt-1 font-medium">
            Giải đấu do <strong className="text-emerald-900">Admin Phan Long</strong> sáng lập và tổ chức từ tháng 4 năm 2024.
          </p>
        </div>

        {/* Overview Box - FC Online Bright Event Theme (aff.fconline.garena.vn inspired) */}
        <div className="mb-12 rounded-3xl relative overflow-hidden border border-emerald-200/90 shadow-lg bg-gradient-to-b from-white via-[#f8fcfa] to-[#f0f9f5] text-slate-800 p-6 sm:p-10 space-y-8">
          {/* Subtle Ambient Dome Glow */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0, 229, 117, 0.2), transparent 70%),
                radial-gradient(circle at 10% 90%, rgba(14, 165, 233, 0.15), transparent 50%),
                radial-gradient(circle at 90% 90%, rgba(245, 158, 11, 0.15), transparent 50%)
              `
            }}
          />

          {/* Top Multi-Color Neon LED Beam */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#00e575] via-[#0ea5e9] to-[#f59e0b] animate-gradient-flow" />

          {/* Header */}
          <div className="border-b border-emerald-100 pb-6 space-y-2.5 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-fco font-bold uppercase tracking-wider shadow-2xs transition-transform hover:scale-105">
              <i className="fa-solid fa-crown text-amber-500"></i>
              <span>WELCOME TO SAO VÀNG CUP™</span>
            </div>
            
            <h2 className="font-fco text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-slate-900 tracking-tight">
              GIỚI THIỆU VỀ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-600 animate-gradient-flow">SAO VÀNG CUP™</span>
            </h2>
            
            <p className="text-emerald-800 font-fco font-bold text-xs sm:text-base tracking-widest uppercase">
              NƠI ĐAM MÊ HỘI TỤ – NƠI NHỮNG NHÀ VÔ ĐỊCH ĐƯỢC GỌI TÊN!
            </p>
          </div>

          {/* Main Story Paragraphs */}
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed relative z-10">
            <p>
              <strong className="text-slate-900 font-bold">GIẢI BÓNG ĐÁ THỂ THAO ĐIỆN TỬ FC ONLINE SAO VÀNG CUP™</strong> là giải đấu giao lưu trực tuyến định kỳ được khởi xướng bởi <strong className="text-emerald-800 font-bold">Admin Phan Long</strong>. Đây là nơi quy tụ những Huấn luyện viên (HLV) tài năng, cùng so tài kỹ năng, thử nghiệm đội hình và khẳng định bản lĩnh chiến thuật trên đấu trường <strong className="text-emerald-800 font-bold">FC Online</strong>.
            </p>
            <p>
              Hơn cả một sân chơi thể thao điện tử, <strong className="text-emerald-800 font-bold">Sao Vàng Cup™</strong> là không gian kết nối những người có chung tình yêu với trái bóng tròn, xây dựng một cộng đồng game thủ văn minh, đoàn kết và nhiệt huyết. Mỗi trận đấu là một câu chuyện chiến thuật, nơi từng pha xử lý đều có thể viết nên lịch sử.
            </p>
          </div>

          {/* 3 Core Quick Access: Nội quy, Lịch thi đấu, Thể thức thi đấu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 relative z-10">
            {/* Card 1: Nội quy */}
            <Link
              to="/noiquy"
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border-2 border-emerald-200/90 dark:border-emerald-800/60 shadow-sm space-y-3 hover:border-emerald-500 hover:shadow-xl card-hover-fx transition-all group block relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <span className="text-[10px] font-oswald font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 uppercase tracking-wider group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  ĐIỀU LỆ
                </span>
              </div>
              <div>
                <h3 className="font-fco font-black text-slate-900 dark:text-white text-base uppercase tracking-wide group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>NỘI QUY GIẢI ĐẤU</span>
                  <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform text-emerald-600 dark:text-emerald-400"></i>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
                  Hệ thống điều lệ thi đấu rõ ràng, giờ hẹn thi đấu và quy trình xử lý sự cố mạng, bảo đảm tính công bằng tuyệt đối.
                </p>
              </div>
            </Link>

            {/* Card 2: Lịch thi đấu */}
            <Link
              to="/ltd"
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border-2 border-sky-200/90 dark:border-sky-800/60 shadow-sm space-y-3 hover:border-sky-500 hover:shadow-xl card-hover-fx transition-all group block relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center text-xl shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-calendar-days"></i>
                </div>
                <span className="text-[10px] font-oswald font-black px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700 uppercase tracking-wider group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  LIVE FIXTURES
                </span>
              </div>
              <div>
                <h3 className="font-fco font-black text-slate-900 dark:text-white text-base uppercase tracking-wide group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center justify-between">
                  <span>LỊCH THI ĐẤU & BXH</span>
                  <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform text-sky-600 dark:text-sky-400"></i>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
                  Theo dõi kết quả các trận cầu nảy lửa, lịch đấu từng lượt trận và cập nhật bảng điểm các bảng theo thời gian thực.
                </p>
              </div>
            </Link>

            {/* Card 3: Thể thức thi đấu */}
            <Link
              to="/thethuc"
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border-2 border-amber-200/90 dark:border-amber-800/60 shadow-sm space-y-3 hover:border-amber-500 hover:shadow-xl card-hover-fx transition-all group block relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-sitemap"></i>
                </div>
                <span className="text-[10px] font-oswald font-black px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700 uppercase tracking-wider group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  FORMAT CHUẨN
                </span>
              </div>
              <div>
                <h3 className="font-fco font-black text-slate-900 dark:text-white text-base uppercase tracking-wide group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>THỂ THỨC THI ĐẤU</span>
                  <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform text-amber-600 dark:text-amber-400"></i>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
                  Quy định chia bảng thi đấu vòng tròn 2 lượt tính điểm và cơ chế phân nhánh trực tiếp Knockout BO3 phân định thứ hạng.
                </p>
              </div>
            </Link>
          </div>

          {/* Arena of Champions - Bright Turf Callout */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#031c15] via-[#052b20] to-[#031a14] border border-emerald-500/30 text-white p-6 sm:p-8 text-center shadow-md card-hover-fx">
            <div className="relative z-10 space-y-2.5 max-w-xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-400/50 text-emerald-300 text-[11px] font-fco font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e575] animate-ping"></span>
                <span>ĐẤU TRƯỜNG VINH QUANG</span>
              </div>

              <h3 className="font-fco font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wide text-white drop-shadow">
                BƯỚC VÀO SÂN CỎ – THỂ HIỆN BẢN LĨNH – CHẠM TAY VÀO CHIẾC CÚP VÀNG!
              </h3>

              <p className="text-xs sm:text-sm text-emerald-300/90 font-fco font-semibold tracking-wide flex items-center justify-center space-x-1.5 pt-1">
                <span>🔥</span>
                <span>Bạn đã sẵn sàng để trở thành Nhà vô địch tiếp theo của Sao Vàng Cup?</span>
                <span>🔥</span>
              </p>
            </div>
          </div>
        </div>

        {/* Handbook Navigation Grid */}
        <div className="mb-10">
          <div className="border-b-2 border-emerald-700 pb-2 mb-6 flex items-center justify-between">
            <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-slate-900 tracking-wide">
              MỤC LỤC TRA CỨU GIẢI ĐẤU
            </h2>
            <span className="text-xs text-slate-500 font-medium">Chọn chuyên mục để xem chi tiết</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {handbookSections.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl portal-card flex flex-col justify-between hover:border-emerald-500 hover:shadow-lg card-hover-fx transition-all group"
              >
                <div>
                  <div className="flex items-center space-x-3.5 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center text-lg shadow-sm shadow-emerald-700/30 group-hover:scale-110 transition-transform">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-slate-900 group-hover:text-emerald-700 transition-colors tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {item.desc}
                  </p>
                </div>

                <Link
                  to={item.link}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-oswald text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-emerald-800/20 group-hover:shadow-emerald-700/40 btn-shimmer"
                >
                  <span>{item.btnText}</span>
                  <i className="fa-solid fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Community Link Box - Bright Event Style */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div>
            <span className="font-oswald text-lg font-bold uppercase text-slate-900 block">
              GIAO LƯU & LIÊN HỆ BAN TỔ CHỨC
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Tham gia Group Facebook để nhận thông báo mới nhất hoặc vào Box Messenger để hẹn giờ thi đấu.
            </p>
          </div>
          <div className="flex space-x-3 flex-shrink-0">
            <a
              href="https://www.facebook.com/groups/939885034118607"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-blue-600/30 hover:scale-105"
            >
              Group Facebook
            </a>
            <a
              href="https://m.me/j/AbZDVIVQ5tc8dOpg/"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-cyan-600/30 hover:scale-105"
            >
              Box Messenger
            </a>
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Trangchu;
