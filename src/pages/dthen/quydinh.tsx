import React from "react";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import Body from "../../components/body";
import CardSection from "../../components/cardsection";

const DthenQuyDinh: React.FC = () => {
  return (
    <>
      <Banner
        title="QUY ĐỊNH ĐỘI HÌNH & CHIẾN THUẬT ĐTHÉN FCO ™"
        subtitle="Tiêu chuẩn quỹ lương 305/305, danh sách sơ đồ chiến thuật hợp lệ và quy tắc thi đấu công bằng"
        badge="SQUAD & TACTICS"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: Squad Standards */}
          <CardSection badgeNumber={1} title="TIÊU CHUẨN XÂY DỰNG ĐỘI HÌNH">
            <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
              {/* Wage Limit Banner inside Section 1 */}
              <div className="p-3.5 sm:p-5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center space-x-3 sm:space-x-4 shadow-sm">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-700 text-white flex items-center justify-center text-xl sm:text-2xl font-black font-fco shadow-sm flex-shrink-0">
                  305
                </div>
                <div>
                  <span className="text-[11px] sm:text-xs font-fco font-bold uppercase text-blue-800 dark:text-blue-300 block">GIỚI HẠN LƯƠNG ĐỘI HÌNH</span>
                  <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-white">Tối đa 305/305 (11 chính + 7 dự bị)</span>
                </div>
              </div>

              <p className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                Các VĐV tham gia giải đấu được phép sử dụng các <strong>sơ đồ đội hình mặc định trong FC Online</strong> theo danh sách dưới đây:
              </p>

              {/* Grid 2 Columns: 4 Defenders vs 3 Defenders Formations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {/* 4 Defenders Card */}
                <div className="p-3.5 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-fco font-bold text-xs sm:text-base text-blue-900 dark:text-blue-300 uppercase flex items-center space-x-2">
                      <i className="fa-solid fa-shield text-blue-600 dark:text-blue-400"></i>
                      <span>SƠ ĐỒ 4 HẬU VỆ (15 SƠ ĐỒ)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-fco font-bold text-[10px] sm:text-xs">
                      4 DF
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                    {[
                      "4-1-3-2", "4-1-4-1", "4-2-3-1",
                      "4-2-2-1-1", "4-2-4", "4-3-1-2",
                      "4-3-3", "4-1-2-3", "4-2-1-3",
                      "4-2-2-2", "4-1-2-1-2", "4-4-2",
                      "4-4-1-1", "4-5-1", "4-3-2-1"
                    ].map((formation, idx) => (
                      <div key={idx} className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs">
                        {formation}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Defenders Card */}
                <div className="p-3.5 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-fco font-bold text-xs sm:text-base text-indigo-900 dark:text-indigo-300 uppercase flex items-center space-x-2">
                      <i className="fa-solid fa-shield-halved text-indigo-600 dark:text-indigo-400"></i>
                      <span>SƠ ĐỒ 3 HẬU VỆ (5 SƠ ĐỒ)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-fco font-bold text-[10px] sm:text-xs">
                      3 DF
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                    {[
                      "3-1-4-2", "3-4-3", "3-5-2",
                      "3-2-3-2", "3-4-1-2"
                    ].map((formation, idx) => (
                      <div key={idx} className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 transition-colors shadow-2xs">
                        {formation}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardSection>

          {/* Section 2: Prohibited Actions */}
          <CardSection badgeNumber={2} title="CÁC HÀNH VI BỊ NGHIÊM CẤM">
            <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
              <p>• <strong>Sử dụng phần mềm can thiệp thứ ba (Cheat/Hack/Lag switch):</strong> Tước quyền thi đấu vĩnh viễn và xử thua toàn bộ các trận.</p>
              <p>• <strong>Dàn xếp tỷ số / Nhường điểm:</strong> Cả hai HLV liên quan sẽ bị loại khỏi giải đấu ngay lập tức.</p>
              <p>• <strong>Chỉnh sửa vị trí cầu thủ bất thường (Dị hợm/Bug game):</strong> Bắt buộc dùng vị trí mặc định của sơ đồ hợp lệ.</p>
            </div>
          </CardSection>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default DthenQuyDinh;
