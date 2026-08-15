import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Thethuc: React.FC = () => {
  return (
    <>
      <Banner
        title="THỂ THỨC THI ĐẤU"
        subtitle="Chi tiết thể thức thi đấu vòng bảng, vòng loại trực tiếp và hệ thống điểm Fair-play"
        badge="GM GROUP CUP FORMAT"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: Tournament Stages */}
          <CardSection
            badgeNumber={1}
            title="THỂ THỨC THI ĐẤU (SAO VÀNG CUP - MÙA 2)"
          >
            <div className="space-y-3 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
              <ul className="list-disc list-inside space-y-1.5 font-medium">
                <li>Bao gồm <strong>20 đội bóng</strong> tham gia.</li>
                <li>Chia ngẫu nhiên thành <strong>4 BẢNG</strong> (Mỗi bảng gồm 5 đội).</li>
                <li>Thi đấu <strong>90 phút vòng tròn 2 lượt</strong> tính điểm (Lượt đi & Lượt về).</li>
                <li><strong>Nhất, Nhì mỗi bảng</strong> + <strong>4 đội hạng 3 có thành tích xuất sắc nhất</strong> sẽ giành vé đi tiếp vào vòng đấu loại trực tiếp (Vòng 16 đội).</li>
                <li>Từ vòng 16 đội, Tứ kết, Bán kết và Chung kết sẽ thi đấu theo thể thức <strong>BO3 (Best of 3 - Thắng 2/3 trận)</strong>.</li>
              </ul>
            </div>
          </CardSection>

          {/* Section 2: Points */}
          <CardSection
            badgeNumber={2}
            title="TÍNH ĐIỂM BẢNG XẾP HẠNG"
          >
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
              <div className="grid grid-cols-3 gap-3 text-center font-oswald max-w-md">
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-xs text-slate-500 block">THẮNG</span>
                  <span className="text-xl font-bold text-emerald-800">3 ĐIỂM</span>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="text-xs text-slate-500 block">HÒA</span>
                  <span className="text-xl font-bold text-amber-800">1 ĐIỂM</span>
                </div>
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="text-xs text-slate-500 block">THUA</span>
                  <span className="text-xl font-bold text-rose-800">0 ĐIỂM</span>
                </div>
              </div>

              <div>
                <h3 className="font-oswald font-bold text-sm uppercase text-slate-800 mb-2">
                  Tiêu chí xét thứ tự khi bằng điểm:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-slate-700">
                  <li><strong>Hiệu số bàn thắng thua (Goal Difference)</strong></li>
                  <li><strong>Kết quả đối đầu trực tiếp (Head-to-head)</strong></li>
                  <li><strong>Tổng số bàn thắng ghi được (Goals Scored)</strong></li>
                  <li><strong>Điểm số Fair-play</strong></li>
                </ol>
              </div>
            </div>
          </CardSection>

          {/* Section 3: Fairplay */}
          <CardSection
            badgeNumber={3}
            title="HỆ THỐNG ĐIỂM FAIR-PLAY"
          >
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
              <p>
                Khởi đầu giải, mỗi Huấn Luyện Viên sẽ được trang bị sẵn <strong>3 điểm Fair-play</strong>. Khi vi phạm, số điểm sẽ bị trừ theo các ngưỡng sau:
              </p>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-800 font-oswald uppercase">
                    <tr>
                      <th className="p-3">Ngưỡng điểm chạm</th>
                      <th className="p-3">Hình thức xử phạt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-bold text-slate-800">Chạm 0 điểm</td>
                      <td className="p-3 text-slate-700">Trừ 1 hiệu số bàn thắng thua trên BXH</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800">Chạm -1 điểm</td>
                      <td className="p-3 text-slate-700">Trừ 2 hiệu số bàn thắng thua trên BXH</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-800">Chạm -2 điểm trở về sau</td>
                      <td className="p-3 text-rose-700 font-semibold">Trừ trực tiếp 1 điểm trên BXH cho mỗi lần vi phạm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-oswald font-bold text-sm uppercase text-slate-800 mb-2">
                  Các lỗi vi phạm bị trừ điểm Fair-play:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>Không hoặc quên chụp ảnh xác minh khi thi đấu: <strong>-1đ Fair-play / lần</strong></li>
                  <li>Đội hình, sơ đồ chiến thuật vi phạm (vượt lương, &gt;5 hậu vệ): <strong>-1đ Fair-play / lần</strong></li>
                  <li>Phát ngôn bừa bãi, gây war, xúc phạm đối thủ: <strong>-3đ Fair-play</strong> (hoặc xem xét KICK khỏi giải)</li>
                </ul>
              </div>
            </div>
          </CardSection>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Thethuc;
