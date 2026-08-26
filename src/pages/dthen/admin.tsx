import React from "react";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import Body from "../../components/body";

const DthenAdmin: React.FC = () => {
  const leadership = [
    {
      role: "TRƯỞNG BAN TỔ CHỨC",
      name: "ADMIN ĐTHÉN",
      phone: "Liên hệ qua Nhóm Zalo / Facebook",
      desc: "Phụ trách tổ chức, duyệt danh sách HLV, tiếp nhận kết quả thi đấu và đưa ra các phán quyết cuối cùng.",
    },
    {
      role: "BAN ĐIỀU HÀNH & GIÁM SÁT KỸ THUẬT",
      name: "TỔ TRỌNG TÀI ĐTHÉN FCO",
      phone: "Hỗ trợ 24/7",
      desc: "Giám sát kỹ thuật sơ đồ thi đấu, kiểm tra quỹ lương squad và hỗ trợ cập nhật kết quả bảng điểm giải đấu.",
    },
  ];

  return (
    <>
      <Banner
        title="BAN TỔ CHỨC ĐTHÉN FCO ™"
        subtitle="Thông tin liên hệ Ban Tổ Chức & Tổ Trọng Tài điều hành giải đấu ĐThén FCO ™"
        badge="ADMIN & ORGANIZERS"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leadership.map((leader, idx) => (
              <div key={idx} className="p-6 rounded-2xl portal-card space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-xs font-oswald font-bold uppercase text-blue-800 tracking-wider block">
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
                  <span className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-oswald text-xs font-bold uppercase tracking-wider">
                    <i className="fa-solid fa-headset"></i>
                    <span>{leader.phone}</span>
                  </span>
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

export default DthenAdmin;
