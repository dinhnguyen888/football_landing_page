import React from "react";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import Body from "../../components/body";

const DthenGiaiThuong: React.FC = () => {
  const prizes = [
    {
      place: "NHÀ VÔ ĐỊCH (QUÁN QUÂN)",
      icon: "fa-trophy",
      color: "from-amber-400 to-amber-600",
      textColor: "text-amber-600",
      bgLight: "bg-amber-50 border-amber-300",
      prize: "CÚP VÀNG DANH GIÁ + TIỀN THƯỞNG BTC",
      desc: "Khắc tên vĩnh viễn trên Bảng Vàng Ngôi Đền Huyền Thoại Hall of Fame ĐThén FCO.",
    },
    {
      place: "Á QUÂN (HẠNG NHÌ)",
      icon: "fa-medal",
      color: "from-slate-400 to-slate-600",
      textColor: "text-slate-600",
      bgLight: "bg-slate-50 border-slate-300",
      prize: "HUY CHƯƠNG BẠC + TIỀN THƯỞNG BTC",
      desc: "Vinh danh thành tích Á quân xuất sắc mùa giải.",
    },
    {
      place: "QUÝ QUÂN (HẠNG BA)",
      icon: "fa-award",
      color: "from-amber-700 to-amber-900",
      textColor: "text-amber-800",
      bgLight: "bg-orange-50 border-orange-300",
      prize: "HUY CHƯƠNG ĐỒNG + TIỀN THƯỞNG BTC",
      desc: "Vinh danh Top 3 đội bóng mạnh nhất giải đấu.",
    },
    {
      place: "VUA PHÁ LƯỚI & GIẢI PHONG CÁCH",
      icon: "fa-futbol",
      color: "from-blue-500 to-indigo-700",
      textColor: "text-blue-700",
      bgLight: "bg-blue-50 border-blue-300",
      prize: "DANH HIỆU CÁ NHÂN & PHẦN THƯỞNG ĐẶC BIỆT",
      desc: "Dành cho chân sút xuất sắc nhất và HLV thi đấu Fair-play ấn tượng nhất.",
    },
  ];

  return (
    <>
      <Banner
        title="CƠ CẤU GIẢI THƯỞNG ĐTHÉN FCO ™"
        subtitle="Hệ thống danh hiệu, cúp lưu niệm và phần thưởng vinh danh dành cho các HLV xuất sắc nhất"
        badge="PRIZE POOL"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="font-fco text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
              VINH QUANG DÀNH CHO NGƯỜI XUẤT SẮC
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Mọi nỗ lực và tư duy chiến thuật trên sân cỏ ảo đều xứng đáng nhận được sự tôn vinh cao quý nhất từ cộng đồng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {prizes.map((p, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-6 rounded-2xl border ${p.bgLight} shadow-sm space-y-3 sm:space-y-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center text-xl shadow-md`}
                  >
                    <i className={`fa-solid ${p.icon}`}></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-fco font-bold uppercase tracking-widest text-slate-400 block">
                      GIẢI THƯỞNG
                    </span>
                    <h3 className={`font-fco font-black text-base sm:text-lg uppercase ${p.textColor}`}>
                      {p.place}
                    </h3>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 space-y-1">
                  <p className="font-oswald text-base font-bold text-slate-900 uppercase">
                    {p.prize}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default DthenGiaiThuong;
