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
        {/* Official Notice Bar - Cirus style */}
        <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
          <p className="font-oswald text-base sm:text-lg font-bold text-emerald-900 uppercase tracking-wide">
            📢 ĐÂY LÀ WEBSITE CHÍNH THỨC CỦA GIẢI ĐẤU CỘNG ĐỒNG FC ONLINE SAO VÀNG CUP ™
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            Giải đấu do <strong>Admin Phan Long</strong> sáng lập và tổ chức từ tháng 4 năm 2024.
          </p>
        </div>

        {/* Overview Box - Detailed Story & Mission (Crisp Pure White & Sharp Contrast) */}
        <div className="mb-12 p-6 sm:p-9 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
          {/* Top Multi-Color Neon LED Beam */}
          <div className="absolute top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-[#00e575] via-[#0ea5e9] to-[#f59e0b]" />

          {/* Header */}
          <div className="border-b border-slate-100 pb-5 space-y-2 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-fco font-bold uppercase tracking-wider">
              <i className="fa-solid fa-crown text-amber-500"></i>
              <span>VỀ GIẢI ĐẤU CỘNG ĐỒNG</span>
            </div>
            
            <h2 className="font-fco text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-slate-900 tracking-tight">
              GIỚI THIỆU VỀ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600">SAO VÀNG CUP™</span>
            </h2>
            
            <p className="text-emerald-700 font-fco font-bold text-xs sm:text-sm tracking-wide uppercase">
              NƠI ĐAM MÊ HỘI TỤ – NƠI NHỮNG NHÀ VÔ ĐỊCH ĐƯỢC GỌI TÊN!
            </p>
          </div>

          {/* Main Story Paragraphs */}
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed relative z-10">
            <p>
              <strong>GIẢI BÓNG ĐÁ THỂ THAO ĐIỆN TỬ FC ONLINE SAO VÀNG CUP™</strong> là sân chơi thi đấu trực tuyến uy tín dành cho cộng đồng đam mê <strong>FC Online</strong>. Đây là nơi các Huấn luyện viên (HLV) cùng nhau so tài chiến thuật, tôi luyện bản lĩnh và chinh phục những trận cầu rực lửa trên sân cỏ ảo.
            </p>
            <p>
              Không chỉ dừng lại ở một giải đấu thể thao điện tử, <strong>Sao Vàng Cup™</strong> là nhịp cầu gắn kết cộng đồng người chơi văn minh, đoàn kết và nhiệt huyết. Mỗi trận đấu là một cuộc đấu trí chiến thuật đỉnh cao, nơi từng đường chuyền, pha xử lý và sự quyết đoán đều có thể định đoạt ngôi vương.
            </p>
          </div>

          {/* 3 Core Pillars - Vibrant Gradient Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 relative z-10">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200 shadow-sm space-y-2 hover:shadow-md hover:border-emerald-400 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-lg shadow-sm shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <h3 className="font-fco font-black text-emerald-950 text-sm uppercase">MINH BẠCH & CÔNG BẰNG</h3>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Hệ thống luật thi đấu chuẩn hóa, giám sát trận đấu chặt chẽ và kết quả được công khai tức thì.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-100/40 border border-blue-200 shadow-sm space-y-2 hover:shadow-md hover:border-blue-400 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-sky-700 text-white flex items-center justify-center text-lg shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <i className="fa-solid fa-chess"></i>
              </div>
              <h3 className="font-fco font-black text-blue-950 text-sm uppercase">CHIẾN THUẬT ĐỈNH CAO</h3>
              <p className="text-xs text-blue-900/80 leading-relaxed">
                Sân chơi thể hiện tư duy xây dựng đội hình, vận hành sơ đồ và khả năng điều chỉnh trận đấu sắc bén.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/40 border border-amber-200 shadow-sm space-y-2 hover:shadow-md hover:border-amber-400 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-lg shadow-sm shadow-amber-500/30 group-hover:scale-105 transition-transform">
                <i className="fa-solid fa-handshake-angle"></i>
              </div>
              <h3 className="font-fco font-black text-amber-950 text-sm uppercase">GẮN KẾT CỘNG ĐỒNG</h3>
              <p className="text-xs text-amber-900/80 leading-relaxed">
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
                className="p-6 rounded-xl portal-card flex flex-col justify-between hover:border-emerald-500 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-emerald-700 flex items-center justify-center text-lg">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <h3 className="font-oswald font-bold text-base sm:text-lg text-slate-900 uppercase">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                    {item.desc}
                  </p>
                </div>

                <Link
                  to={item.link}
                  className="w-full py-2 px-4 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-oswald text-xs font-bold uppercase tracking-wider text-center border border-emerald-200 transition-colors"
                >
                  {item.btnText} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Community Link Box */}
        <div className="p-6 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-oswald text-base font-bold uppercase text-slate-900 block">
              GIAO LƯU & LIÊN HỆ BAN TỔ CHỨC
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              Tham gia Group Facebook để nhận thông báo mới nhất hoặc vào Box Messenger để hẹn giờ thi đấu.
            </p>
          </div>
          <div className="flex space-x-3 flex-shrink-0">
            <a
              href="https://www.facebook.com/groups/939885034118607"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Group FB
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
