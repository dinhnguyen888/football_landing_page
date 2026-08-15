import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";

const Xephang: React.FC = () => {
  const champions = [
    {
      season: "MÙA 2",
      name: "VIS'S SƠN",
      title: "ĐƯƠNG KIM VÔ ĐỊCH MÙA 2",
      image: require("../img/mua2.jpg"),
    },
    {
      season: "MÙA 1",
      name: "NGUYỄN DUY ANH",
      title: "NHÀ VÔ ĐỊCH MÙA 1",
      image: require("../img/mua1.jpg"),
    },
  ];

  return (
    <>
      <Banner
        title="BẢNG XẾP HẠNG NHÀ VÔ ĐỊCH"
        subtitle="Phòng truyền thống vinh danh các nhà vô địch xuất sắc nhất qua các mùa giải"
        badge="HALL OF FAME"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="p-6 sm:p-8 rounded-xl portal-card space-y-6">
            <h2 className="font-oswald text-xl font-bold uppercase text-slate-900 border-b border-slate-200 pb-2 text-center">
              DANH SÁCH NHÀ VÔ ĐỊCH CÁC MÙA GIẢI
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {champions.map((champ, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded bg-amber-100 text-amber-900 font-oswald text-xs font-bold uppercase tracking-wider">
                        {champ.season}
                      </span>
                      <span className="font-oswald text-xs font-bold text-slate-500 uppercase">
                        CHAMPION
                      </span>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-slate-200 bg-white mb-4 shadow-sm">
                      <img
                        src={champ.image}
                        alt={champ.name}
                        className="w-full max-h-[360px] object-cover object-center"
                      />
                    </div>

                    <h3 className="font-oswald font-bold text-xl text-slate-900 uppercase">
                      {champ.name}
                    </h3>
                    <p className="text-xs text-emerald-800 font-medium">{champ.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Xephang;
