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
      tag: "ĐIỀU LỆ",
      tagColor: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "THỂ THỨC THI ĐẤU",
      desc: "Thể thức Vòng Swiss FVPL (32 VĐV chia 2 nhánh), chạm 3 ván thắng giành vé đi tiếp và Vòng Knockout 16 tuyển thủ.",
      link: "/thethuc",
      icon: "fa-sitemap",
      btnText: "XEM THỂ THỨC",
      tag: "FORMAT FVPL",
      tagColor: "bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800",
    },
    {
      title: "QUY ĐỊNH ĐỘI HÌNH",
      desc: "Đội hình tự do; giới hạn mùa UC, ITM tối đa +6; WS, WG, FAC, CH, 26TS, 26TY tối đa +7; cấm Prime & Infinity Prime.",
      link: "/quydinh",
      icon: "fa-users-gear",
      btnText: "XEM QUY ĐỊNH",
      tag: "GIỚI HẠN THẺ",
      tagColor: "bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    },
    {
      title: "BẢNG VÀNG VÔ ĐỊCH",
      desc: "Khám phá phòng truyền thống Hall of Fame – nơi ghi danh và tôn vinh các nhà vô địch xuất sắc nhất qua từng mùa giải.",
      link: "/xephang",
      icon: "fa-crown",
      btnText: "HALL OF FAME",
      tag: "VINH DANH",
      tagColor: "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    },
    {
      title: "CƠ CẤU GIẢI THƯỞNG",
      desc: "Tổng thưởng 860.000đ chia 4 hạng mục danh giá, bao gồm giải Vua Phá Lưới 60.000đ tính từ Vòng Knockout.",
      link: "/giaithuong",
      icon: "fa-trophy",
      btnText: "XEM GIẢI THƯỞNG",
      tag: "TIỀN THƯỞNG",
      tagColor: "bg-orange-50 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    },
  ];

  return (
    <>
      <Banner
        title="FC ONLINE SAO VÀNG CUP ™"
        subtitle="Cổng thông tin & Cẩm nang giải đấu bóng đá điện tử FC Online uy tín cho cộng đồng"
        badge="CẨM NANG GIẢI ĐẤU CHÍNH THỨC"
      />

      <Body>
        {/* Official Notice Bar - Sleek Sports Broadcast Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left transition-all hover:border-emerald-400">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center text-base shadow-sm shrink-0">
              <i className="fa-solid fa-bullhorn"></i>
            </div>
            <div>
              <p className="font-oswald text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                WEBSITE CHÍNH THỨC CỦA GIẢI ĐẤU CỘNG ĐỒNG SAO VÀNG CUP ™
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                Sáng lập & tổ chức bởi <strong className="text-emerald-700 dark:text-emerald-400">Admin Phan Long</strong> từ tháng 4 năm 2024.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-oswald uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-live-pulse" />
              <span>ĐANG HOẠT ĐỘNG</span>
            </span>
          </div>
        </div>

        {/* Overview Box - Natural Stadium Atmosphere */}
        <div className="mb-12 rounded-3xl relative overflow-hidden border border-emerald-200/90 dark:border-emerald-800/60 shadow-lg bg-gradient-to-b from-white via-[#fbfdfc] to-[#f4faf7] dark:from-[#0a2218] dark:via-[#071a12] dark:to-[#05140e] text-slate-800 dark:text-slate-100 p-6 sm:p-10 space-y-8">
          {/* Subtle Natural Turf Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 70% 40% at 50% 0%, rgba(16, 185, 129, 0.18), transparent 70%),
                radial-gradient(circle at 10% 90%, rgba(5, 150, 105, 0.12), transparent 50%),
                radial-gradient(circle at 90% 90%, rgba(217, 119, 6, 0.12), transparent 50%)
              `,
            }}
          />

          {/* Top Natural Grass & Gold Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 opacity-90" />

          {/* Header */}
          <div className="border-b border-emerald-100 dark:border-emerald-900/60 pb-6 space-y-2.5 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 text-xs font-fco font-bold uppercase tracking-wider shadow-2xs">
              <i className="fa-solid fa-crown text-amber-500"></i>
              <span>WELCOME TO SAO VÀNG CUP™</span>
            </div>

            <h2 className="font-fco text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-slate-900 dark:text-white tracking-tight">
              GIỚI THIỆU VỀ{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-400">
                SAO VÀNG CUP™
              </span>
            </h2>

            <p className="text-emerald-800 dark:text-emerald-400 font-fco font-bold text-xs sm:text-base tracking-widest uppercase">
              NƠI ĐAM MÊ HỘI TỤ – NƠI NHỮNG NHÀ VÔ ĐỊCH ĐƯỢC GỌI TÊN!
            </p>
          </div>

          {/* Story Paragraphs */}
          <div className="space-y-4 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed relative z-10">
            <p>
              <strong className="text-slate-900 dark:text-white font-bold">
                GIẢI BÓNG ĐÁ THỂ THAO ĐIỆN TỬ FC ONLINE SAO VÀNG CUP™
              </strong>{" "}
              là giải đấu giao lưu trực tuyến định kỳ được khởi xướng bởi{" "}
              <strong className="text-emerald-800 dark:text-emerald-400 font-bold">Admin Phan Long</strong>. Đây là nơi quy tụ những Huấn luyện viên (HLV) tài năng, cùng so tài kỹ năng, thử nghiệm đội hình và khẳng định bản lĩnh chiến thuật trên đấu trường{" "}
              <strong className="text-emerald-800 dark:text-emerald-400 font-bold">FC Online</strong>.
            </p>
            <p>
              Hơn cả một sân chơi thể thao điện tử,{" "}
              <strong className="text-emerald-800 dark:text-emerald-400 font-bold">Sao Vàng Cup™</strong>{" "}
              là không gian kết nối những người có chung tình yêu với trái bóng tròn, xây dựng một cộng đồng game thủ văn minh, đoàn kết và nhiệt huyết. Mỗi trận đấu là một câu chuyện chiến thuật, nơi từng pha xử lý đều có thể viết nên lịch sử.
            </p>
          </div>

          {/* 3 Core Quick Access: Nội quy, Lịch thi đấu, Thể thức thi đấu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 relative z-10">
            {/* Card 1: Nội quy */}
            <Link
              to="/noiquy"
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800/70 shadow-sm space-y-3 hover:border-emerald-500 hover:shadow-xl card-hover-fx transition-all group block relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <span className="text-[10px] font-oswald font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 uppercase tracking-wider group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  ĐIỀU LỆ
                </span>
              </div>
              <div>
                <h3 className="font-fco font-black text-slate-900 dark:text-white text-base uppercase tracking-wide group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>NỘI QUY GIẢI ĐẤU</span>
                  <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform text-emerald-600 dark:text-emerald-400"></i>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
                  Hệ thống điều lệ thi đấu rõ ràng, giờ hẹn thi đấu và quy trình xử lý sự cố mạng, bảo đảm tính công bằng tuyệt đối.
                </p>
              </div>
            </Link>

            {/* Card 2: Thể thức thi đấu */}
            <Link
              to="/thethuc"
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-teal-200 dark:border-teal-800/70 shadow-sm space-y-3 hover:border-teal-500 hover:shadow-xl card-hover-fx transition-all group block relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                  <i className="fa-solid fa-sitemap"></i>
                </div>
                <span className="text-[10px] font-oswald font-black px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700 uppercase tracking-wider group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  SWISS FVPL
                </span>
              </div>
              <div>
                <h3 className="font-fco font-black text-slate-900 dark:text-white text-base uppercase tracking-wide group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors flex items-center justify-between">
                  <span>THỂ THỨC THI ĐẤU</span>
                  <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform text-teal-600 dark:text-teal-400"></i>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
                  Vòng Swiss 32 VĐV chia 2 nhánh độc lập (chạm 3 thắng đi tiếp) & Vòng Knockout 16 tuyển thủ tranh cúp.
                </p>
              </div>
            </Link>

            {/* Card 3: Bảng Vàng Vô Địch */}
            <Link
              to="/xephang"
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-amber-200 dark:border-amber-800/70 shadow-sm space-y-3 hover:border-amber-500 hover:shadow-xl card-hover-fx transition-all group block relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                  <i className="fa-solid fa-crown"></i>
                </div>
                <span className="text-[10px] font-oswald font-black px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700 uppercase tracking-wider group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  HALL OF FAME
                </span>
              </div>
              <div>
                <h3 className="font-fco font-black text-slate-900 dark:text-white text-base uppercase tracking-wide group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>BẢNG VÀNG VÔ ĐỊCH</span>
                  <i className="fa-solid fa-arrow-right text-xs transform group-hover:translate-x-1.5 transition-transform text-amber-600 dark:text-amber-400"></i>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5">
                  Khám phá phòng truyền thống Hall of Fame – nơi ghi danh và tôn vinh các nhà vô địch xuất sắc nhất qua từng mùa giải.
                </p>
              </div>
            </Link>
          </div>

          {/* Arena of Champions - Natural Stadium Night Callout */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#031c15] via-[#052b20] to-[#031a14] border border-emerald-500/30 text-white p-6 sm:p-8 text-center shadow-md card-hover-fx">
            <div className="relative z-10 space-y-3 max-w-xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-300 text-[11px] font-fco font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-live-pulse" />
                <span>ĐẤU TRƯỜNG VINH QUANG</span>
              </div>

              <h3 className="font-fco font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wide text-white drop-shadow">
                BƯỚC VÀO SÂN CỎ – THỂ HIỆN BẢN LĨNH – CHẠM TAY VÀO CHIẾC CÚP VÀNG!
              </h3>

              <p className="text-xs sm:text-sm text-emerald-200/90 font-fco font-medium tracking-wide flex items-center justify-center space-x-1.5 pt-1">
                <span>⚽</span>
                <span>Bạn đã sẵn sàng để trở thành Nhà vô địch tiếp theo của Sao Vàng Cup?</span>
                <span>⚽</span>
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://m.me/j/yproyGQNtIeg-Qic/?send_source=gc%3Acopy_invite_link_c"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-oswald text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-1.5 btn-shimmer"
                >
                  <i className="fa-brands fa-facebook-messenger"></i>
                  <span>HẸN ĐÁ TẠI BOX MESSENGER</span>
                </a>
                <Link
                  to="/xephang"
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-oswald text-xs font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all inline-flex items-center space-x-1.5"
                >
                  <i className="fa-solid fa-trophy text-amber-400"></i>
                  <span>PHÒNG TRUYỀN THỐNG</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Handbook Navigation Grid */}
        <div className="mb-10">
          <div className="border-b border-emerald-600/30 pb-3 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-6 rounded-full bg-emerald-600" />
              <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-slate-900 dark:text-white tracking-wide">
                MỤC LỤC TRA CỨU GIẢI ĐẤU
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              Chọn chuyên mục để xem chi tiết
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {handbookSections.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl portal-card flex flex-col justify-between hover:border-emerald-500 hover:shadow-lg card-hover-fx transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center text-lg shadow-sm shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <span
                      className={`text-[10px] font-oswald font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${item.tagColor}`}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors tracking-wide mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                    {item.desc}
                  </p>
                </div>

                <Link
                  to={item.link}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-oswald text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center space-x-1.5 shadow-sm shadow-emerald-800/20 group-hover:shadow-emerald-700/30 btn-shimmer"
                >
                  <span>{item.btnText}</span>
                  <i className="fa-solid fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Community Link Box - Sports Club Lounge Style */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
          <div>
            <span className="font-oswald text-lg font-bold uppercase text-slate-900 dark:text-white block">
              GIAO LƯU & LIÊN HỆ BAN TỔ CHỨC
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tham gia Group Facebook để nhận thông báo mới nhất hoặc vào Box Messenger để hẹn giờ thi đấu.
            </p>
          </div>
          <div className="flex space-x-3 flex-shrink-0">
            <a
              href="https://www.facebook.com/groups/939885034118607"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-blue-600/30 hover:scale-105 active:scale-95 flex items-center space-x-1.5"
            >
              <i className="fa-brands fa-facebook"></i>
              <span>Group Facebook</span>
            </a>
            <a
              href="https://m.me/j/yproyGQNtIeg-Qic/?send_source=gc%3Acopy_invite_link_c"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-emerald-600/30 hover:scale-105 active:scale-95 inline-flex items-center space-x-1.5"
            >
              <i className="fa-brands fa-facebook-messenger"></i>
              <span>Box Messenger</span>
            </a>
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Trangchu;
