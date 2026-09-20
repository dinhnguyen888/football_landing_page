import React, { useState } from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Thethuc: React.FC = () => {
  const [activeFormat, setActiveFormat] = useState<"GROUP_KNOCKOUT" | "PURE_KNOCKOUT">("GROUP_KNOCKOUT");

  return (
    <>
      <Banner
        title="THỂ THỨC THI ĐẤU"
        subtitle="Chi tiết thể thức thi đấu vòng bảng, vòng loại trực tiếp và hệ thống điểm Fair-play"
        badge="SAO VÀNG CUP FORMAT"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Format Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 gap-2">
            <button
              type="button"
              onClick={() => setActiveFormat("GROUP_KNOCKOUT")}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormat === "GROUP_KNOCKOUT"
                  ? "bg-emerald-700 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-layer-group text-sm"></i>
              <span>1. Vòng Bảng & Knockout</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFormat("PURE_KNOCKOUT")}
              className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl font-oswald text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeFormat === "PURE_KNOCKOUT"
                  ? "bg-amber-500 text-slate-950 shadow-md font-black"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <i className="fa-solid fa-trophy text-sm text-amber-600"></i>
              <span>2. Cúp Loại Trực Tiếp (Knockout)</span>
            </button>
          </div>

          {/* ================= TAB 1: GROUP + KNOCKOUT ================= */}
          {activeFormat === "GROUP_KNOCKOUT" && (
            <>
              {/* Section 1: Tournament Stages */}
              <CardSection
                badgeNumber={1}
                title="THỂ THỨC THI ĐẤU – SAO VÀNG CUP™ (VÒNG BẢNG & KNOCKOUT)"
              >
                <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
                  <p className="text-slate-800">
                    Giải đấu được tổ chức theo <strong>02 giai đoạn</strong>:
                  </p>

                  {/* Giai đoạn 1 */}
                  <div className="space-y-1.5 pt-1">
                    <h4 className="font-bold text-slate-900">Giai đoạn 1 – Vòng bảng</h4>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>Số lượng HLV và số bảng đấu sẽ được BTC xác định dựa trên <strong>tổng số đăng ký chính thức</strong>.</li>
                      <li>Các HLV được chia bảng theo hình thức <strong>bốc thăm/ngẫu nhiên</strong>.</li>
                      <li>Thi đấu <strong>vòng tròn tính điểm</strong> trong từng bảng.</li>
                      <li>Các HLV có thành tích tốt nhất sẽ giành quyền đi tiếp vào <strong>vòng loại trực tiếp</strong>.</li>
                      <li>Số lượng HLV đi tiếp ở mỗi bảng sẽ được BTC công bố sau khi chốt số lượng người tham gia.</li>
                    </ul>
                  </div>

                  {/* Giai đoạn 2 */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900">Giai đoạn 2 – Vòng loại trực tiếp</h4>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>Các HLV vượt qua vòng bảng sẽ thi đấu theo thể thức <strong>loại trực tiếp</strong> cho đến trận Chung kết.</li>
                      <li>Tùy số lượng HLV vượt qua vòng bảng, BTC sẽ sắp xếp các vòng đấu phù hợp như <strong>Vòng 16 đội, Tứ kết, Bán kết và Chung kết</strong>.</li>
                      <li>Các trận đấu tại vòng loại trực tiếp áp dụng thể thức <strong>BO3 – Best of 3</strong>, HLV thắng <strong>2/3 trận</strong> sẽ giành quyền đi tiếp.</li>
                    </ul>
                  </div>

                  <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-100">
                    * Cơ cấu bảng đấu và số suất đi tiếp có thể được BTC điều chỉnh phù hợp với số lượng HLV đăng ký thực tế và sẽ được công bố trước khi giải đấu bắt đầu.
                  </p>
                </div>
              </CardSection>

              {/* Section 2: Points */}
              <CardSection
                badgeNumber={2}
                title="TÍNH ĐIỂM BẢNG XẾP HẠNG"
              >
            <div className="space-y-5 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
              {/* Point blocks */}
              <div className="grid grid-cols-3 gap-3 text-center font-fco max-w-md">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-500 block uppercase">THẮNG</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-800">3 ĐIỂM</span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-500 block uppercase">HÒA</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-800">1 ĐIỂM</span>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 shadow-2xs">
                  <span className="text-xs font-bold text-slate-500 block uppercase">THUA</span>
                  <span className="text-xl sm:text-2xl font-black text-rose-800">0 ĐIỂM</span>
                </div>
              </div>

              {/* Tie-breaker criteria */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  Tiêu chí xếp hạng khi bằng điểm:
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Nếu có từ hai HLV trở lên bằng điểm, thứ hạng sẽ được xác định lần lượt theo các tiêu chí:
                </p>

                <ol className="list-decimal list-inside space-y-1.5 text-slate-800 pl-1 font-medium text-xs sm:text-sm">
                  <li><strong>Điểm đối đầu trực tiếp</strong></li>
                  <li><strong>Hiệu số bàn thắng – bàn thua trong các trận đối đầu</strong></li>
                  <li><strong>Tổng số bàn thắng ghi được trong các trận đối đầu</strong></li>
                  <li><strong>Hiệu số bàn thắng – bàn thua toàn bảng</strong></li>
                  <li><strong>Tổng số bàn thắng ghi được toàn bảng</strong></li>
                  <li><strong>Điểm Fair-play</strong></li>
                  <li>Nếu vẫn bằng nhau, <strong>BTC tiến hành bốc thăm để xác định thứ hạng</strong></li>
                </ol>

                <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-100">
                  * Các tiêu chí được xét lần lượt theo thứ tự trên cho đến khi xác định được thứ hạng.
                </p>
              </div>
            </div>
          </CardSection>

          {/* Section 3: Fairplay */}
          <CardSection
            badgeNumber={3}
            title="HỆ THỐNG FAIR-PLAY"
          >
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
              <p className="text-slate-800">
                Giải đấu áp dụng <strong>hệ thống điểm Unfair Play (BM) trong game FC Online</strong> để xử lý các hành vi câu giờ và thi đấu thiếu Fair-play.
              </p>

              {/* Ngưỡng xử phạt Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1 shadow-2xs">
                  <div className="flex items-center space-x-2 text-amber-900 font-fco font-bold text-sm uppercase">
                    <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
                    <span>VÒNG BẢNG: 8 ĐIỂM BM</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Khi một HLV đạt <strong>8 điểm Unfair Play (BM)</strong> trong cùng một trận đấu → Bị <strong>xử thua 0-3</strong>. <em>(Nếu trận đấu kết thúc với tỷ số thua cách biệt lớn hơn 0-3, BTC giữ nguyên tỷ số thực tế)</em>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1 shadow-2xs">
                  <div className="flex items-center space-x-2 text-rose-900 font-fco font-bold text-sm uppercase">
                    <i className="fa-solid fa-ban text-rose-600"></i>
                    <span>VÒNG KNOCKOUT: 12 ĐIỂM BM</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Khi một HLV đạt <strong>12 điểm Unfair Play (BM)</strong> trong cùng một trận đấu → Bị <strong>xử thua trận đấu đó</strong> trong loạt trận BO3.
                  </p>
                </div>
              </div>

              {/* Các hành vi Unfair Play */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">Các hành vi Unfair Play:</h4>
                <p className="text-slate-600">Bao gồm các hành vi bị hệ thống FC Online ghi nhận như:</p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
                  <li>Cố tình chuyền bóng qua lại ở phần sân nhà để kéo dài thời gian.</li>
                  <li>Giữ hoặc rê bóng tiêu cực nhằm câu giờ.</li>
                  <li>Các hành vi khác bị hệ thống <strong>Fair Play / Unfair Play của FC Online</strong> ghi nhận.</li>
                </ul>
              </div>

              {/* Xác nhận vi phạm */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">Xác nhận vi phạm:</h4>
                <p>
                  Khi phát sinh trường hợp đạt ngưỡng Unfair Play, VĐV phải <strong>chụp ảnh hoặc quay video màn hình</strong> thể hiện rõ số điểm vi phạm và gửi cho BTC để xác nhận.
                </p>
              </div>

              <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-100">
                * Mọi trường hợp tranh chấp sẽ được BTC xem xét dựa trên hình ảnh, video và dữ liệu trận đấu trước khi đưa ra quyết định cuối cùng.
              </p>
            </div>
          </CardSection>
        </>
      )}

      {/* ================= TAB 2: PURE KNOCKOUT (CÚP LOẠI TRỰC TIẾP) ================= */}
      {activeFormat === "PURE_KNOCKOUT" && (
        <>
          {/* Section 1: Overview & Tree Structure */}
          <CardSection
            badgeNumber={1}
            title="THỂ THỨC CÚP LOẠI TRỰC TIẾP (PURE KNOCKOUT)"
          >
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-medium">
                <div className="flex items-center gap-2 font-bold font-oswald text-base text-amber-900 uppercase">
                  <i className="fa-solid fa-fire text-amber-600"></i>
                  <span>Đặc trưng thể thức Cúp - Một mất một còn</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mt-1">
                  Thể thức loại trực tiếp đơn (Single Elimination) không áp dụng thi đấu vòng bảng. Các HLV được xếp trực tiếp vào cây phân nhánh đấu loại, mỗi trận đấu đều là trận quyết tử để giành vé đi tiếp vào vòng trong cho đến ngôi vương!
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="font-bold text-slate-900">Quy mô giải đấu tự chọn:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
                    <span className="font-oswald text-lg font-bold text-emerald-700 block">8 HLV</span>
                    <span className="text-xs text-slate-500">Tứ Kết ➔ Bán Kết ➔ Chung Kết</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
                    <span className="font-oswald text-lg font-bold text-blue-700 block">16 HLV</span>
                    <span className="text-xs text-slate-500">Vòng 1/8 ➔ Tứ Kết ➔ Bán Kết ➔ CK</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
                    <span className="font-oswald text-lg font-bold text-purple-700 block">32 HLV</span>
                    <span className="text-xs text-slate-500">Vòng 1/16 ➔ Vòng 1/8 ➔ ... ➔ CK</span>
                  </div>
                </div>
              </div>
            </div>
          </CardSection>

          {/* Section 2: Two Pairing Methods */}
          <CardSection
            badgeNumber={2}
            title="02 PHƯƠNG THỨC XẾP CẶP THI ĐẤU"
          >
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
              <p className="text-slate-800">
                Ban Tổ Chức và các HLV có thể lựa chọn 1 trong <strong>02 cơ chế xếp cặp</strong> minh bạch:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Cách 1: Ngẫu nhiên */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-oswald font-bold text-sm uppercase">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                      🎲
                    </span>
                    <span>1. XẾP CẶP NGẪU NHIÊN (AUTO RANDOM)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Hệ thống tự động sử dụng thuật toán xáo trộn (Fisher-Yates Shuffle) để ghép cặp ngẫu nhiên toàn bộ danh sách HLV đã đăng ký vào các nhánh đấu Trận 1, Trận 2... ngay khi tạo giải.
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Nhanh gọn • Công bằng • Khởi tranh tức thì
                  </span>
                </div>

                {/* Cách 2: Bốc thăm 3D */}
                <div className="p-4 rounded-xl bg-slate-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-oswald font-bold text-sm uppercase">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                      🏆
                    </span>
                    <span>2. BỐC THĂM TRỰC TIẾP (LIVE 3D DRAW)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ban Tổ Chức sẽ tổ chức bốc thăm trên sân khấu <strong>Bốc thăm 3D trực tuyến</strong> chuyên nghiệp (dành riêng cho Admin & BTC điều hành). MC mở từng quả bóng chia lần lượt vào các cặp đấu Trận 1, Trận 2 công khai trước toàn thể cộng đồng.
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <i className="fa-solid fa-lock text-[10px] text-amber-600"></i>
                    <span>Sân khấu bốc thăm do Ban Tổ Chức vận hành</span>
                  </div>
                </div>
              </div>
            </div>
          </CardSection>

          {/* Section 3: Match Rules & Tie-breaker */}
          <CardSection
            badgeNumber={3}
            title="QUY CHẾ THI ĐẤU & PHÂN ĐỊNH THẮNG THUA"
          >
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed pl-2 sm:pl-11">
              <ul className="list-disc list-inside space-y-2 text-slate-800">
                <li>
                  <strong>Thể thức loạt trận:</strong> Toàn bộ các vòng Knockout áp dụng thể thức <strong>BO3 (Best of 3 - Chạm 2 ván thắng)</strong>. HLV giành 2 chiến thắng đầu tiên sẽ tiến thẳng vào vòng kế tiếp.
                </li>
                <li>
                  <strong>Không có tỷ số hòa:</strong> Trong từng ván đấu của FC Online, hai HLV bắt buộc phải bật tùy chọn <strong>Hiệp phụ (ET) và Đá luân lưu (PK)</strong> nếu kết quả 90 phút thi đấu chính thức bất phân thắng bại.
                </li>
                <li>
                  <strong>Trận Chung kết & Tranh Hạng Ba:</strong> Trận Chung kết xác định Quán quân & Á quân của giải đấu. Trận Tranh Hạng Ba diễn ra giữa 2 HLV dừng bước tại Bán kết để vinh danh Top 3.
                </li>
              </ul>

              {/* Ngưỡng BM Knockout */}
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1.5">
                <div className="flex items-center space-x-2 text-rose-900 font-fco font-bold text-sm uppercase">
                  <i className="fa-solid fa-ban text-rose-600"></i>
                  <span>NGƯỠNG XỬ PHẠT FAIR-PLAY (BM) VÒNG KNOCKOUT: 12 ĐIỂM</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Ở loạt trận Knockout, nếu một HLV tích lũy từ <strong>12 điểm Unfair Play (BM)</strong> trở lên trong bất kỳ game đấu nào do hành vi câu giờ tiêu cực bị game FC Online ghi nhận $\rightarrow$ Bị <strong>xử thua ngay ván đấu đó</strong>.
                </p>
              </div>
            </div>
          </CardSection>
        </>
      )}
    </div>
  </Body>

  <Footer />
</>
  );
};

export default Thethuc;
