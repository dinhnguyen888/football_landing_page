import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Giaithuong: React.FC = () => {
  return (
    <>
      <Banner
        title="CƠ CẤU GIẢI THƯỞNG"
        subtitle="Mức giải thưởng tiền mặt và danh hiệu trao tặng cho các đội bóng xuất sắc"
        badge="TOURNAMENT PRIZES"
      />

      <Body>
        <div className="max-w-3xl mx-auto space-y-6">
          <CardSection title="BẢNG PHÂN PHỐI GIẢI THƯỞNG">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                    <i className="fa-solid fa-trophy"></i>
                  </div>
                  <div>
                    <span className="font-oswald text-sm font-bold uppercase text-amber-900 block">VÔ ĐỊCH (HẠNG 1)</span>
                    <span className="text-xs text-slate-600">Cúp + Ghi danh Hall of Fame</span>
                  </div>
                </div>
                <span className="font-oswald text-2xl font-bold text-amber-800">250.000đ</span>
              </div>

              <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                    <i className="fa-solid fa-medal"></i>
                  </div>
                  <div>
                    <span className="font-oswald text-sm font-bold uppercase text-slate-800 block">Á QUÂN (HẠNG 2)</span>
                    <span className="text-xs text-slate-600">Huy chương Bạc</span>
                  </div>
                </div>
                <span className="font-oswald text-2xl font-bold text-slate-700">170.000đ</span>
              </div>

              <div className="p-5 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-200 text-orange-900 flex items-center justify-center font-bold">
                    <i className="fa-solid fa-award"></i>
                  </div>
                  <div>
                    <span className="font-oswald text-sm font-bold uppercase text-orange-900 block">HẠNG 3 (QUÝ QUÂN)</span>
                    <span className="text-xs text-slate-600">Huy chương Đồng</span>
                  </div>
                </div>
                <span className="font-oswald text-2xl font-bold text-orange-800">100.000đ</span>
              </div>

              <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div>
                    <span className="font-oswald text-sm font-bold uppercase text-slate-800 block">HẠNG TƯ</span>
                    <span className="text-xs text-slate-600">Khuyến khích Top 4</span>
                  </div>
                </div>
                <span className="font-oswald text-2xl font-bold text-slate-700">60.000đ</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic pt-2">
              * Toàn bộ tiền thưởng được chuyển khoản trực tiếp cho HLV ngay sau khi trận Chung kết và tranh hạng 3 kết thúc.
            </p>
          </CardSection>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Giaithuong;
