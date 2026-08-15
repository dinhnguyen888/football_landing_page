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
        {/* Official Notice Bar - FC Online Esports Glow Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center shadow-lg shadow-emerald-950/30 backdrop-blur-md">
          <p className="font-oswald text-base sm:text-lg font-bold text-[#00e575] uppercase tracking-wide drop-shadow">
            📢 ĐÂY LÀ WEBSITE CHÍNH THỨC CỦA GIẢI ĐẤU CỘNG ĐỒNG FC ONLINE SAO VÀNG CUP ™
          </p>
          <p className="text-xs text-slate-300 mt-1">
            Giải đấu do <strong className="text-white">Admin Phan Long</strong> sáng lập và tổ chức từ tháng 4 năm 2024.
          </p>
        </div>

        {/* Overview Box - Authentic FC Online Stadium Dark Theme (Garena FC Online Style) */}
        <div className="mb-12 rounded-3xl relative overflow-hidden border border-emerald-500/40 shadow-2xl bg-gradient-to-b from-[#0a192f] via-[#051124] to-[#020712] text-white p-6 sm:p-10 space-y-8">
          {/* FC Online Stadium Floodlights & Pitch Radial Lighting */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 229, 117, 0.35), transparent 70%),
                radial-gradient(circle at 10% 90%, rgba(14, 165, 233, 0.25), transparent 50%),
                radial-gradient(circle at 90% 90%, rgba(245, 158, 11, 0.25), transparent 50%),
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px'
            }}
          />

          {/* Top Multi-Color Neon LED Beam */}
          <div className="absolute top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#00e575] via-[#0ea5e9] to-[#f59e0b] shadow-[0_0_15px_#00e575]" />

          {/* Header */}
          <div className="border-b border-slate-700/60 pb-6 space-y-2.5 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs font-fco font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00e575] animate-ping"></span>
              <span>WELCOME TO SAO VÀNG CUP™</span>
            </div>
            
            <h2 className="font-fco text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight drop-shadow-md">
              GIỚI THIỆU VỀ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e575] via-teal-300 to-[#fbbf24]">SAO VÀNG CUP™</span>
            </h2>
            
            <p className="text-emerald-400 font-fco font-bold text-xs sm:text-base tracking-widest uppercase">
              NƠI ĐAM MÊ HỘI TỤ – NƠI NHỮNG NHÀ VÔ ĐỊCH ĐƯỢC GỌI TÊN!
            </p>
          </div>

          {/* Main Story Paragraphs */}
          <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed relative z-10 font-normal">
            <p>
              <strong className="text-white font-semibold">GIẢI BÓNG ĐÁ THỂ THAO ĐIỆN TỬ FC ONLINE SAO VÀNG CUP™</strong> là sân chơi thi đấu trực tuyến đỉnh cao dành cho cộng đồng đam mê <strong className="text-[#00e575]">FC Online</strong>. Đây là nơi các Huấn luyện viên (HLV) cùng nhau so tài chiến thuật, tôi luyện bản lĩnh và chinh phục những trận cầu rực lửa trên sân cỏ ảo.
            </p>
            <p>
              Không chỉ dừng lại ở một giải đấu thể thao điện tử, <strong className="text-amber-400">Sao Vàng Cup™</strong> là nhịp cầu gắn kết cộng đồng game thủ văn minh, đoàn kết và nhiệt huyết. Mỗi trận đấu là một cuộc đấu trí chiến thuật đỉnh cao, nơi từng đường chuyền, pha xử lý và sự quyết đoán đều có thể định đoạt ngôi vương.
            </p>
          </div>

          {/* 3 Core Pillars - FC Online Glowing Glassmorphic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 relative z-10">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-500/40 shadow-lg space-y-3 hover:border-emerald-400 hover:shadow-emerald-500/20 hover:shadow-xl transition-all group backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-xl shadow-lg shadow-emerald-600/40 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <h3 className="font-fco font-black text-white text-base uppercase tracking-wide group-hover:text-emerald-400 transition-colors">
                MINH BẠCH & CÔNG BẰNG
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Hệ thống luật thi đấu chuẩn hóa, trọng tài giám sát trận đấu chặt chẽ và kết quả được công khai tức thì.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-sky-500/40 shadow-lg space-y-3 hover:border-sky-400 hover:shadow-sky-500/20 hover:shadow-xl transition-all group backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center text-xl shadow-lg shadow-sky-600/40 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-chess"></i>
              </div>
              <h3 className="font-fco font-black text-white text-base uppercase tracking-wide group-hover:text-sky-400 transition-colors">
                CHIẾN THUẬT ĐỈNH CAO
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sân chơi thể hiện tư duy xây dựng đội hình, vận hành sơ đồ và khả năng điều chỉnh trận đấu sắc bén.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/40 shadow-lg space-y-3 hover:border-amber-400 hover:shadow-amber-500/20 hover:shadow-xl transition-all group backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl shadow-lg shadow-amber-600/40 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-handshake-angle"></i>
              </div>
              <h3 className="font-fco font-black text-white text-base uppercase tracking-wide group-hover:text-amber-400 transition-colors">
                GẮN KẾT CỘNG ĐỒNG
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Xây dựng môi trường giao lưu văn minh, tôn trọng đối thủ và lan tỏa tinh thần Fair-play rực lửa.
              </p>
            </div>
          </div>

          {/* Arena of Champions - Soft Stadium Night Pitch Callout */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#061812] via-[#04100c] to-[#020806] text-white p-6 sm:p-8 border border-emerald-500/40 text-center shadow-lg">
            {/* Pitch Lighting */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse 70% 60% at 50% 0%, rgba(0, 229, 117, 0.35), transparent 70%),
                  radial-gradient(circle at 10% 100%, rgba(14, 165, 233, 0.2), transparent 50%),
                  radial-gradient(circle at 90% 100%, rgba(245, 158, 11, 0.2), transparent 50%)
                `
              }}
            />

            {/* Pitch Lines */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 50% 50%, transparent 60px, rgba(255, 255, 255, 0.6) 61px, rgba(255, 255, 255, 0.6) 63px, transparent 64px),
                  linear-gradient(90deg, transparent 49.8%, rgba(255, 255, 255, 0.5) 50%, transparent 50.2%)
                `
              }}
            />

            {/* Floating Decors */}
            <div className="absolute top-1/2 left-6 -translate-y-1/2 hidden md:block opacity-30 text-emerald-400 text-2xl pointer-events-none">
              <i className="fa-solid fa-futbol"></i>
            </div>
            <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden md:block opacity-30 text-amber-400 text-2xl pointer-events-none">
              <i className="fa-solid fa-trophy"></i>
            </div>

            <div className="relative z-10 space-y-2.5 max-w-xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 text-[11px] font-fco font-bold uppercase tracking-wider backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e575] animate-ping"></span>
                <span>CHINH PHỤC NGÔI VƯƠNG</span>
              </div>

              <h3 className="font-fco font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wide text-white drop-shadow">
                XÂY DỰNG ĐỘI HÌNH – CHINH PHỤC ĐỐI THỦ – VIẾT TÊN MÌNH LÊN BẢNG VÀNG!
              </h3>

              <p className="text-xs sm:text-sm text-emerald-300 font-fco font-semibold tracking-wide flex items-center justify-center space-x-1.5 pt-1">
                <span>🔥</span>
                <span>Bạn đã sẵn sàng bước vào sân đấu và trở thành nhà vô địch tiếp theo?</span>
                <span>🔥</span>
              </p>
            </div>
          </div>
        </div>

        {/* Handbook Navigation Grid */}
        <div className="mb-10">
          <div className="border-b-2 border-emerald-500/50 pb-2 mb-6 flex items-center justify-between">
            <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
              MỤC LỤC TRA CỨU GIẢI ĐẤU
            </h2>
            <span className="text-xs text-emerald-400 font-medium">Chọn chuyên mục để xem chi tiết</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {handbookSections.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl portal-card flex flex-col justify-between hover:border-emerald-400 transition-all group"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 border border-emerald-500/40 text-[#00e575] flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <h3 className="font-oswald text-lg font-bold uppercase text-white group-hover:text-[#00e575] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                    {item.desc}
                  </p>
                </div>

                <Link
                  to={item.link}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-oswald text-xs font-bold uppercase tracking-wider text-center shadow-md shadow-emerald-950/50 group-hover:shadow-emerald-500/30 transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>{item.btnText}</span>
                  <i className="fa-solid fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Community Link Box - FC Online Dark Glass */}
        <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#07172b] to-slate-900/90 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl backdrop-blur-md">
          <div>
            <span className="font-oswald text-lg font-bold uppercase text-white block">
              GIAO LƯU & LIÊN HỆ BAN TỔ CHỨC
            </span>
            <p className="text-xs text-slate-300 mt-1">
              Tham gia Group Facebook để nhận thông báo mới nhất hoặc vào Box Messenger để hẹn giờ thi đấu.
            </p>
          </div>
          <div className="flex space-x-3 flex-shrink-0">
            <a
              href="https://www.facebook.com/groups/939885034118607"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-900/40 hover:scale-105"
            >
              Group Facebook
            </a>
            <a
              href="https://m.me/j/AbZDVIVQ5tc8dOpg/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Box Chat
            </a>
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Trangchu;
