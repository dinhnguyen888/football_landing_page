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
        badge="SAO VÀNG CUP FORMAT"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: Tournament Stages */}
          <CardSection
            badgeNumber={1}
            title="THỂ THỨC THI ĐẤU – SAO VÀNG CUP™"
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
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Thethuc;
