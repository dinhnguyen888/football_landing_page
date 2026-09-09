import React from "react";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import Body from "../../components/body";
import CardSection from "../../components/cardsection";

const DthenTheThuc: React.FC = () => {
  return (
    <>
      <Banner
        title="THỂ THỨC THI ĐẤU ĐTHÉN FCO ™"
        subtitle="Chi tiết thể thức thi đấu vòng bảng, vòng loại trực tiếp và nguyên tắc xếp hạng giải ĐThén FCO"
        badge="DTHEN FCO FORMAT"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: Tournament Stages */}
          <CardSection badgeNumber={1} title="THỂ THỨC THI ĐẤU – ĐTHÉN FCO™">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
              <p className="text-slate-800">
                Giải đấu được tổ chức theo <strong>02 giai đoạn</strong> chính thức:
              </p>

              {/* Giai đoạn 1 */}
              <div className="space-y-1.5 pt-1">
                <h4 className="font-bold text-slate-900">Giai đoạn 1 – Vòng bảng (Group Stage - Chuẩn World Cup)</h4>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>32 Huấn luyện viên được chia đều vào <strong>8 bảng đấu (Bảng A, B, C, D, E, F, G, H)</strong>, mỗi bảng 4 HLV.</li>
                  <li>Thi đấu theo thể thức <strong>vòng tròn 1 lượt</strong> tính điểm (thắng 3 điểm, hòa 1 điểm, thua 0 điểm).</li>
                  <li><strong>Top 2 HLV dẫn đầu mỗi bảng (tổng cộng 16 HLV)</strong> sẽ giành vé chính thức tiến vào giai đoạn Knockout (Vòng 1/8).</li>
                </ul>
              </div>

              {/* Giai đoạn 2 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">Giai đoạn 2 – Vòng loại trực tiếp (Knockout Stage)</h4>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>16 HLV xuất sắc nhất thi đấu theo phân nhánh chuẩn World Cup: <strong>Vòng 1/8 (Round of 16) ➔ Tứ Kết ➔ Bán Kết ➔ Chung Kết & Tranh Hạng Ba</strong>.</li>
                  <li>Các trận đấu Knockout áp dụng thể thức <strong>BO3 (Best of 3)</strong>: HLV thắng 2/3 trận sẽ giành quyền đi tiếp.</li>
                  <li>Trận Chung kết phân định ngôi vương đỉnh cao của giải đấu.</li>
                </ul>
              </div>
            </div>
          </CardSection>

          {/* Section 2: Points */}
          <CardSection badgeNumber={2} title="QUY TẮC TÍNH ĐIỂM & XẾP HẠNG VÒNG BẢNG">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="block font-black text-emerald-700 text-xl font-oswald">3 ĐIỂM</span>
                  <span className="text-xs text-slate-600 font-semibold uppercase">Chiến Thắng</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="block font-black text-amber-700 text-xl font-oswald">1 ĐIỂM</span>
                  <span className="text-xs text-slate-600 font-semibold uppercase">Trận Hòa</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="block font-black text-rose-700 text-xl font-oswald">0 ĐIỂM</span>
                  <span className="text-xs text-slate-600 font-semibold uppercase">Thất Bại</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">Thứ tự ưu tiên khi các đội bằng điểm nhau:</h4>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-700">
                  <li><strong>Hiệu số bàn thắng bại (Goal Difference)</strong>.</li>
                  <li><strong>Tổng số bàn thắng ghi được (Goals For)</strong>.</li>
                  <li><strong>Thành tích đối đầu trực tiếp (Head-to-Head)</strong>.</li>
                  <li><strong>Trận đấu Play-off hoặc bốc thăm may mắn</strong> (nếu mọi chỉ số đều trùng khớp).</li>
                </ol>
              </div>
            </div>
          </CardSection>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default DthenTheThuc;
