import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";

const Topmua: React.FC = () => {
  const seasons = [
    {
      season: "MÙA 2",
      champion: "Vis's Sơn",
      img: require("../img/topcacmua.jpg"),
    },
    {
      season: "MÙA 1",
      champion: "Nguyễn Duy Anh",
      img: require("../img/mua1.jpg"),
    },
  ];

  return (
    <>
      <Banner
        title="TOP 3 CÁC MÙA GIẢI"
        subtitle="Tổng kết và lưu trữ hình ảnh vinh danh thứ hạng các mùa giải đã qua"
        badge="SEASON ARCHIVES"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {seasons.map((s, idx) => (
            <div key={idx} className="p-6 sm:p-8 rounded-xl portal-card space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="font-oswald text-xl font-bold uppercase text-slate-900">
                  TỔNG KẾT {s.season}
                </h2>
                <span className="text-xs text-slate-500 font-medium">Vô Địch: <strong>{s.champion}</strong></span>
              </div>

              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={s.img}
                  alt={`Top 3 ${s.season}`}
                  className="w-full max-h-[460px] object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Topmua;
