import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";

const Admin: React.FC = () => {
  const leadership = [
    {
      role: "TRƯỞNG BAN TỔ CHỨC",
      name: "PHAN LONG",
      facebook: "https://www.facebook.com/plong2604",
      phone: "0886.200.436",
      desc: "Phụ trách tổ chức, duyệt danh sách HLV, tiếp nhận lệ phí và đưa ra phán quyết cuối cùng.",
    },
    {
      role: "PHÓ BAN TỔ CHỨC",
      name: "DŨNG HUYỀN",
      facebook: "https://www.facebook.com/levandung.sla",
      phone: "Liên hệ qua Messenger",
      desc: "Giám sát kỹ thuật 5 hậu vệ, quỹ lương 255 và hỗ trợ cập nhật bảng điểm Google Sheet.",
    },
  ];

  return (
    <>
      <Banner
        title="BAN TỔ CHỨC GIẢI ĐẤU"
        subtitle="Thông tin liên hệ Trưởng & Phó Ban Tổ Chức giải đấu Sao Vàng Cup ™"
        badge="ADMIN & ORGANIZERS"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadership.map((leader, idx) => (
              <div key={idx} className="p-6 rounded-xl portal-card space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-xs font-oswald font-bold uppercase text-emerald-800 tracking-wider block">
                    {leader.role}
                  </span>
                  <h2 className="font-oswald text-2xl font-bold uppercase text-slate-900 mt-0.5">
                    {leader.name}
                  </h2>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {leader.desc}
                </p>

                <div className="pt-2">
                  <a
                    href={leader.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-oswald text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    <i className="fa-brands fa-facebook"></i>
                    <span>Facebook: {leader.name}</span>
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

export default Admin;
