import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import { Link } from "react-router-dom";

const Trangchu: React.FC = () => {
  const handbookSections = [
    {
      title: "NỘI QUY THI ĐẤU",
      desc: "Quy định giờ hẹn đá, xử lý lỗi mất kết nối (out ngang / diss mạng), quy chuẩn văn hóa ứng xử và điểm Fair-play.",
      link: "/noiquy",
      icon: "fa-shield-halved",
      btnText: "ĐỌC NỘI QUY",
    },
    {
      title: "THỂ THỨC THI ĐẤU",
      desc: "Cơ cấu phân bảng đấu 20 đội, thể thức vòng tròn 2 lượt tính điểm và vòng loại trực tiếp Knockout BO3.",
      link: "/thethuc",
      icon: "fa-sitemap",
      btnText: "XEM THỂ THỨC",
    },
    {
      title: "QUY ĐỊNH ĐỘI HÌNH",
      desc: "Giới hạn quỹ lương tối đa 255/255, quy định sơ đồ tối đa 5 hậu vệ và quy trình xử lý vi phạm trong trận.",
      link: "/quydinh",
      icon: "fa-users-gear",
      btnText: "XEM QUY ĐỊNH",
    },
    {
      title: "LỊCH THI ĐẤU & BXH",
      desc: "Bảng điểm và lịch thi đấu cập nhật trực tiếp theo thời gian thực (Live Google Sheets) từ trọng tài.",
      link: "/ltd",
      icon: "fa-table-list",
      btnText: "XEM BẢNG ĐIỂM",
    },
    {
      title: "BẢNG VÀNG VÔ ĐỊCH",
      desc: "Hall of Fame vinh danh nhà vô địch các mùa giải: Mùa 1 (Nguyễn Duy Anh), Mùa 2 (Vis's Sơn).",
      link: "/xephang",
      icon: "fa-crown",
      btnText: "HALL OF FAME",
    },
    {
      title: "CƠ CẤU GIẢI THƯỞNG",
      desc: "Bảng phân bổ giải thưởng tiền mặt và cúp vinh danh cho Nhà Vô Địch, Á Quân, Hạng 3 và Hạng 4.",
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

        {/* Overview Box */}
        <div className="mb-10 p-6 sm:p-8 rounded-xl portal-card space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-oswald text-xl sm:text-2xl font-bold uppercase text-slate-900 tracking-wide">
              GIỚI THIỆU VỀ GIẢI ĐẤU SAO VÀNG CUP ™
            </h2>
          </div>
          <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
            <p>
              <strong>GIẢI BÓNG ĐÁ THỂ THAO ĐIỆN TỬ FC ONLINE SAO VÀNG CUP ™</strong> là sân chơi ảo được tổ chức trực tuyến dành cho các đội bóng và huấn luyện viên đam mê tựa game FC Online. Đây là nơi các game thủ thể hiện tài năng, tư duy chiến thuật và tinh thần thể thao công bằng.
            </p>
            <p>
              Mục tiêu chính của giải là tạo ra môi trường giao lưu văn hóa lành mạnh, gắn kết cộng đồng và giúp các thành viên cùng nhau chia sẻ niềm đam mê với trái bóng tròn trên không gian mạng.
            </p>
            <p>
              Giải đấu cam kết duy trì tính minh bạch, công bằng tuyệt đối với hệ thống trọng tài giám sát, luật thi đấu chặt chẽ và cập nhật kết quả liên tục.
            </p>
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
