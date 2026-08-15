import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";

const Danhsachhlv: React.FC = () => {
  const groups = [
    {
      groupName: "BẢNG A",
      coaches: [
        { name: "HLV Phan Long (BTC)", team: "Chelsea FC", role: "Hạt giống" },
        { name: "HLV Duy Anh", team: "Real Madrid", role: "Cựu Vô Địch" },
        { name: "HLV Tuấn Kiệt", team: "Manchester City", role: "Ứng viên" },
        { name: "HLV Hoàng Nam", team: "AC Milan", role: "Tân binh" },
        { name: "HLV Minh Đức", team: "Arsenal FC", role: "Tân binh" },
      ],
    },
    {
      groupName: "BẢNG B",
      coaches: [
        { name: "HLV Vis's Sơn", team: "Bayern Munich", role: "ĐKVĐ Mùa 2" },
        { name: "HLV Dũng Huyền", team: "Juventus", role: "Phó BTC" },
        { name: "HLV Quốc Bảo", team: "Liverpool FC", role: "Ứng viên" },
        { name: "HLV Văn Hậu", team: "Inter Milan", role: "Tân binh" },
        { name: "HLV Quang Hải", team: "Paris Saint-Germain", role: "Tân binh" },
      ],
    },
    {
      groupName: "BẢNG C",
      coaches: [
        { name: "HLV Thành Long", team: "Barcelona", role: "Hạt giống" },
        { name: "HLV Đình Trọng", team: "Tottenham Hotspur", role: "Tân binh" },
        { name: "HLV Hữu Thắng", team: "Borussia Dortmund", role: "Tân binh" },
        { name: "HLV Đức Huy", team: "Atletico Madrid", role: "Tân binh" },
        { name: "HLV Việt Anh", team: "AS Roma", role: "Tân binh" },
      ],
    },
    {
      groupName: "BẢNG D",
      coaches: [
        { name: "HLV Văn Toàn", team: "Manchester United", role: "Hạt giống" },
        { name: "HLV Công Phượng", team: "Napoli", role: "Tân binh" },
        { name: "HLV Tuấn Anh", team: "Bayer Leverkusen", role: "Tân binh" },
        { name: "HLV Xuân Trường", team: "Sevilla FC", role: "Tân binh" },
        { name: "HLV Ngọc Hải", team: "SLNA All-Star", role: "Tân binh" },
      ],
    },
  ];

  return (
    <>
      <Banner
        title="DANH SÁCH HUẤN LUYỆN VIÊN"
        subtitle="Danh sách các HLV và đội bóng chính thức tham dự giải đấu Sao Vàng Cup ™"
        badge="MANAGERS & CLUBS"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((grp, idx) => (
              <div key={idx} className="p-6 rounded-xl portal-card space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h2 className="font-oswald text-lg font-bold uppercase text-slate-900">
                    {grp.groupName}
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">{grp.coaches.length} HLV</span>
                </div>

                <div className="space-y-2">
                  {grp.coaches.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-slate-900 block">{cIdx + 1}. {c.name}</strong>
                        <span className="text-slate-500">CLB: <span className="text-emerald-800 font-medium">{c.team}</span></span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-600 font-medium">
                        {c.role}
                      </span>
                    </div>
                  ))}
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

export default Danhsachhlv;
