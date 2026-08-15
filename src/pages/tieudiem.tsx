import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";

const Tieudiem: React.FC = () => {
  const moments = [
    {
      title: "KHOẢNH KHẮC VÔ ĐỊCH MÙA 2",
      desc: "Hình ảnh trận chung kết Mùa 2 đầy cảm xúc và lễ nâng cúp của tân vương Vis's Sơn.",
      img: require("../img/mua2.jpg"),
    },
    {
      title: "KHOẢNH KHẮC VÔ ĐỊCH MÙA 1",
      desc: "Trận chung kết lịch sử mở màn giải đấu Great Mates Cup mùa đầu tiên với nhà vô địch Nguyễn Duy Anh.",
      img: require("../img/mua1.jpg"),
    },
    {
      title: "TỔNG KẾT HÌNH ẢNH CÁC MÙA GIẢI",
      desc: "Lưu trữ kỷ niệm và các poster vinh danh chính thức từ Ban Tổ Chức.",
      img: require("../img/topcacmua.jpg"),
    },
  ];

  return (
    <>
      <Banner
        title="TIÊU ĐIỂM GIẢI ĐẤU"
        subtitle="Lưu giữ những khoảnh khắc, hình ảnh và kỷ niệm đáng nhớ của các mùa giải"
        badge="TOURNAMENT MOMENTS"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {moments.map((m, idx) => (
            <div key={idx} className="p-6 sm:p-8 rounded-xl portal-card space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h2 className="font-oswald text-xl font-bold uppercase text-slate-900">
                  {m.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1">{m.desc}</p>
              </div>

              <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={m.img}
                  alt={m.title}
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

export default Tieudiem;
