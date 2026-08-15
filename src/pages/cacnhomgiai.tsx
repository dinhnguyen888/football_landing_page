import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";

const Cacnhomgiai: React.FC = () => {
  const groups = [
    {
      title: "GROUP GIẢI ĐẤU TRÊN FACEBOOK",
      name: "SAO VÀNG CUP (FC ONLINE) | FACEBOOK",
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
              <div key={idx} className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-all group">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5 mb-1.5">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm">
                      <i className={idx === 0 ? "fa-brands fa-facebook-f" : "fa-brands fa-facebook-messenger"}></i>
                    </span>
                    <h2 className="font-fco text-base sm:text-lg font-black uppercase text-slate-900">
                      {g.title}
                    </h2>
                  </div>
                  <span className="text-xs text-emerald-800 font-bold font-fco block mt-0.5">{g.name}</span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {g.desc}
                </p>

                <div className="pt-2">
                  <a
                    href={g.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl ${g.btnColor} text-white font-fco text-xs font-bold uppercase tracking-wider shadow-sm transition-all group-hover:scale-102`}
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
