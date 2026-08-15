import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";

const Cacnhomgiai: React.FC = () => {
  const groups = [
    {
      title: "GROUP GIẢI ĐẤU TRÊN FACEBOOK",
      name: "GREAT MATES (FC ONLINE) | FACEBOOK",
      desc: "Nơi đăng tải thông báo giải đấu, lịch thi đấu, bảng kết quả và trao đổi giữa các thành viên.",
      link: "https://www.facebook.com/groups/939885034118607",
      btnText: "Vào Group Facebook",
      btnColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "BOX GIẢI ĐẤU TRÊN MESSENGER",
      name: "BOX KẾT NỐI HẸN ĐẤU & KẾT QUẢ",
      desc: "Kênh chat để các HLV chủ động liên hệ hẹn giờ thi đấu và nộp ảnh chụp kết quả cho BTC.",
      link: "https://m.me/j/AbZDVIVQ5tc8dOpg/",
      btnText: "Vào Box Chat Messenger",
      btnColor: "bg-cyan-600 hover:bg-cyan-700",
    },
  ];

  return (
    <>
      <Banner
        title="CÁC NHÓM GIẢI ĐẤU"
        subtitle="Hệ thống group Facebook và Box Messenger chính thức của Sao Vàng Cup ™"
        badge="COMMUNITY CHANNELS"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((g, idx) => (
              <div key={idx} className="p-6 rounded-xl portal-card space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h2 className="font-oswald text-lg font-bold uppercase text-slate-900">
                    {g.title}
                  </h2>
                  <span className="text-xs text-emerald-800 font-bold block mt-0.5">{g.name}</span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {g.desc}
                </p>

                <div className="pt-2">
                  <a
                    href={g.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg ${g.btnColor} text-white font-oswald text-xs font-bold uppercase tracking-wider transition-colors`}
                  >
                    <span>{g.btnText}</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
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

export default Cacnhomgiai;
