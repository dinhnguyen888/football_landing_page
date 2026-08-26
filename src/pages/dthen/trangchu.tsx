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
        <div className="mb-8 p-4 rounded-2xl bg-blue-50/90 border border-blue-300/80 text-center shadow-xs">
          <p className="font-oswald text-base sm:text-lg font-bold text-blue-950 uppercase tracking-wide">
            📢 ĐÂY LÀ WEBSITE CHÍNH THỨC CỦA GIẢI ĐẤU CỘNG ĐỒNG FC ONLINE ĐTHÉN FCO ™
          </p>
          <p className="text-xs text-blue-800 mt-1 font-medium">
            Giải đấu do <strong className="text-blue-950">Admin ĐThén</strong> sáng lập và tổ chức.
          </p>
        </div>

        {/* Overview Box */}
        <div className="mb-12 rounded-3xl relative overflow-hidden border border-blue-200/90 shadow-lg bg-gradient-to-b from-white via-[#f8fbff] to-[#f0f6ff] text-slate-800 p-6 sm:p-10 space-y-8">
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
          <div className="border-b border-blue-100 pb-6 space-y-2.5 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-100/80 border border-blue-300 text-blue-900 text-xs font-fco font-bold uppercase tracking-wider shadow-2xs transition-transform hover:scale-105">
              <i className="fa-solid fa-trophy text-amber-500"></i>
              <span>WELCOME TO ĐTHÉN FCO™</span>
            </div>

            <h2 className="font-fco text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-slate-900 tracking-tight">
              GIỚI THIỆU VỀ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-600 animate-gradient-flow">ĐTHÉN FCO™</span>
            </h2>

            <p className="text-blue-900 font-fco font-bold text-xs sm:text-base tracking-widest uppercase">
              NƠI ĐAM MÊ HỘI TỤ – NƠI NHỮNG NHÀ VÔ ĐỊCH ĐƯỢC GỌI TÊN!
            </p>
          </div>

          {/* Main Story Paragraphs */}
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed relative z-10">
            <p>
              <strong className="text-slate-900 font-bold">GIẢI BÓNG ĐÁ THỂ THAO ĐIỆN TỬ FC ONLINE ĐTHÉN FCO™</strong> là sân chơi thi đấu trực tuyến uy tín dành cho cộng đồng đam mê <strong className="text-blue-800 font-bold">FC Online</strong>. Đây là nơi các Huấn luyện viên (HLV) cùng nhau so tài chiến thuật, tôi luyện bản lĩnh và chinh phục những trận cầu rực lửa trên sân cỏ ảo.
            </p>
            <p>
              Không chỉ dừng lại ở một giải đấu thể thao điện tử, <strong className="text-indigo-800 font-bold">ĐThén FCO™</strong> là nhịp cầu gắn kết cộng đồng game thủ văn minh, đoàn kết và nhiệt huyết. Mỗi trận đấu là một cuộc đấu trí chiến thuật đỉnh cao, nơi từng đường chuyền, pha xử lý và sự quyết đoán đều có thể định đoạt ngôi vương.
            </p>
          </div>

          {/* 3 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 relative z-10">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-blue-200/90 shadow-sm space-y-3 hover:border-blue-400 hover:shadow-lg card-hover-fx transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <h3 className="font-fco font-black text-slate-900 text-base uppercase tracking-wide group-hover:text-blue-700 transition-colors">
                MINH BẠCH & CÔNG BẰNG
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Hệ thống luật thi đấu chuẩn hóa, trọng tài giám sát trận đấu chặt chẽ và kết quả được công khai tức thì.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-indigo-200/90 shadow-sm space-y-3 hover:border-indigo-400 hover:shadow-lg card-hover-fx transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-chess"></i>
              </div>
              <h3 className="font-fco font-black text-slate-900 text-base uppercase tracking-wide group-hover:text-indigo-700 transition-colors">
                CHIẾN THUẬT ĐỈNH CAO
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sân chơi thể hiện tư duy xây dựng đội hình, vận hành sơ đồ và khả năng điều chỉnh trận đấu sắc bén.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-amber-200/90 shadow-sm space-y-3 hover:border-amber-400 hover:shadow-lg card-hover-fx transition-all group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-handshake-angle"></i>
              </div>
              <h3 className="font-fco font-black text-slate-900 text-base uppercase tracking-wide group-hover:text-amber-700 transition-colors">
                GẮN KẾT CỘNG ĐỒNG
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Xây dựng môi trường giao lưu văn minh, tôn trọng đối thủ và lan tỏa tinh thần Fair-play rực lửa.
              </p>
            </div>
          </div>

          {/* Arena Callout */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 text-white p-6 sm:p-8 text-center shadow-md card-hover-fx">
            <div className="relative z-10 space-y-2.5 max-w-xl mx-auto">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-900/80 border border-blue-400/50 text-blue-300 text-[11px] font-fco font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-ping"></span>
                <span>CHINH PHỤC NGÔI VƯƠNG MÙA 1</span>
              </div>

              <h3 className="font-fco font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wide text-white drop-shadow">
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
        <div className="mb-10">
          <div className="border-b-2 border-blue-700 pb-2 mb-6 flex items-center justify-between">
            <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-slate-900 tracking-wide">
              MỤC LỤC TRA CỨU GIẢI ĐẤU
            </h2>
            <span className="text-xs text-slate-500 font-medium">Chọn chuyên mục để xem chi tiết</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {handbookSections.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl portal-card flex flex-col justify-between hover:border-blue-500 hover:shadow-lg card-hover-fx transition-all group"
              >
                <div>
                  <div className="flex items-center space-x-3.5 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex items-center justify-center text-lg shadow-sm shadow-blue-700/30 group-hover:scale-110 transition-transform">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-slate-900 group-hover:text-blue-700 transition-colors tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
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
