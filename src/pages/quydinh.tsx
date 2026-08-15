import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Quydinh: React.FC = () => {
  return (
    <>
      <Banner
        title="QUY ĐỊNH ĐỘI HÌNH & CHIẾN THUẬT"
        subtitle="Tiêu chuẩn quỹ lương 300/300, danh sách sơ đồ chiến thuật mặc định và quy trình xử lý vi phạm"
        badge="SQUAD & TACTICS"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: Squad Standards */}
          <CardSection badgeNumber={1} title="TIÊU CHUẨN XÂY DỰNG ĐỘI HÌNH">
            <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
              {/* Wage Limit Banner inside Section 1 */}
              <div className="p-4 sm:p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-4 shadow-sm">
                <div className="w-14 h-14 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-black font-fco shadow-sm flex-shrink-0">
                  300
                </div>
                <div>
                  <span className="text-xs font-fco font-bold uppercase text-emerald-800 block">GIỚI HẠN LƯƠNG ĐỘI HÌNH</span>
                  <span className="text-base sm:text-lg font-black text-slate-900">Tối đa 300/300 (11 chính + 7 dự bị)</span>
                </div>
              </div>

              <p className="text-slate-800">
                Các VĐV tham gia giải đấu được phép sử dụng các <strong>sơ đồ đội hình mặc định trong FC Online</strong> theo danh sách dưới đây:
              </p>

              {/* Grid 2 Columns: 4 Defenders vs 3 Defenders Formations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 4 Defenders Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-fco font-bold text-sm sm:text-base text-blue-900 uppercase flex items-center space-x-2">
                      <i className="fa-solid fa-shield text-blue-600"></i>
                      <span>SƠ ĐỒ 4 HẬU VỆ (15 SƠ ĐỒ)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-fco font-bold text-xs">
                      4 DF
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 text-center">
                    {[
                      "4-1-3-2", "4-1-4-1", "4-2-3-1",
                      "4-2-2-1-1", "4-2-4", "4-3-1-2",
                      "4-3-3", "4-1-2-3", "4-2-1-3",
                      "4-2-2-2", "4-1-2-1-2", "4-4-2",
                      "4-4-1-1", "4-5-1", "4-3-2-1"
                    ].map((formation, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs">
                        {formation}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Defenders Card */}
                <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-fco font-bold text-sm sm:text-base text-emerald-900 uppercase flex items-center space-x-2">
                      <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                      <span>SƠ ĐỒ 3 HẬU VỆ (7 SƠ ĐỒ)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-fco font-bold text-xs">
                      3 DF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-center">
                    {[
                      "3-1-4-2", "3-4-1-2",
                      "3-4-3", "3-1-2-1-3",
                      "3-2-2-1-2", "3-2-3-2",
                      "3-4-2-1"
                    ].map((formation, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 hover:border-emerald-400 hover:text-emerald-600 transition-colors shadow-2xs">
                        {formation}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Allowed Features */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-fco font-bold text-sm sm:text-base text-slate-900 uppercase flex items-center space-x-2">
                  <i className="fa-solid fa-circle-check text-emerald-600"></i>
                  <span>CÁC TÍNH NĂNG ĐƯỢC PHÉP SỬ DỤNG</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center space-x-2">
                    <i className="fa-solid fa-users text-amber-600 text-sm"></i>
                    <span className="font-bold text-slate-800">Team Color</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center space-x-2">
                    <i className="fa-solid fa-user-tie text-blue-600 text-sm"></i>
                    <span className="font-bold text-slate-800">HLV Kỹ Năng</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center space-x-2">
                    <i className="fa-solid fa-id-card text-emerald-600 text-sm"></i>
                    <span className="font-bold text-slate-800">Thẻ Cầu Thủ Cho Mượn (LOAN)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center space-x-2">
                    <i className="fa-solid fa-house-flag text-rose-600 text-sm"></i>
                    <span className="font-bold text-slate-800">Club House</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
                * VĐV có trách nhiệm kiểm tra và đảm bảo đội hình thi đấu đúng quy định trước khi bắt đầu trận đấu. Trường hợp sử dụng sơ đồ hoặc thiết lập không hợp lệ, BTC sẽ xem xét và xử lý theo quy định của giải.
              </p>
            </div>
          </CardSection>

          {/* Section 2: Clean, Natural Violations Handling Regulation */}
          <CardSection badgeNumber={2} title="QUY TRÌNH XỬ LÝ VI PHẠM SƠ ĐỒ & QUỸ LƯƠNG">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p className="text-slate-800">
                Khi phát hiện đối phương vi phạm quỹ lương (<strong>&gt; 300</strong>) hoặc sử dụng sơ đồ ngoài danh mục quy định, HLV cần <strong>chụp ảnh hoặc quay video làm bằng chứng</strong> và thực hiện theo quy trình sau:
              </p>

              {/* Case 1 */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300">
                    1
                  </span>
                  <h4 className="font-bold text-slate-900">Phát hiện tại phòng chờ trước trận 1 (Lượt đi)</h4>
                </div>
                <p className="pl-8 text-slate-600">
                  → Nhắc nhở đối thủ chỉnh sửa lại đội hình/sơ đồ về đúng quy định trước khi bấm sẵn sàng vào trận.
                </p>
              </div>

              {/* Case 2 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300">
                    2
                  </span>
                  <h4 className="font-bold text-slate-900">Phát hiện khi trận 1 đã bắt đầu (Bóng đã lăn từ 00:01s)</h4>
                </div>
                <p className="pl-8 text-slate-600">
                  → Hai bên thỏa thuận đá lại nếu đồng ý. Nếu không thống nhất được, <strong>bên vi phạm sẽ bị xử thua 0-3 ở trận 1</strong>.
                </p>
              </div>

              {/* Case 3 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300">
                    3
                  </span>
                  <h4 className="font-bold text-slate-900">Phát hiện tại phòng chờ trước trận 2 (Lượt về)</h4>
                </div>
                <p className="pl-8 text-slate-600">
                  → Giữ nguyên kết quả trận 1 đã kết thúc. Bên vi phạm bắt buộc phải sửa lại đội hình hợp lệ trước khi bắt đầu trận 2.
                </p>
              </div>

              {/* Case 4 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-300">
                    4
                  </span>
                  <h4 className="font-bold text-slate-900">Phát hiện khi trận 2 đã bắt đầu (Bóng đã lăn từ 00:01s)</h4>
                </div>
                <p className="pl-8 text-slate-600">
                  → Hai bên thỏa thuận đá lại trận 2 nếu đồng ý. Nếu không thống nhất, <strong>bên vi phạm sẽ bị xử thua 0-3 ở trận 2</strong>.
                </p>
              </div>

              {/* Important Fair Play Note */}
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <p className="font-semibold text-slate-900">
                  📌 Nguyên tắc kiểm tra chéo & minh bạch:
                </p>
                <p>
                  Các HLV có quyền và trách nhiệm chủ động kiểm tra đội hình đối phương trước trận đấu. Mọi kết quả của các trận đấu đã kết thúc và xác nhận hợp lệ trước đó sẽ được bảo lưu.
                </p>
              </div>
            </div>
          </CardSection>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Quydinh;
