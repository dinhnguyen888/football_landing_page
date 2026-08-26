import React from "react";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import Body from "../../components/body";
import CardSection from "../../components/cardsection";

const DthenNoiQuy: React.FC = () => {
  const disconnectTable = [
    { minute: "< 10 phút", rule: "Giữ nguyên tỉ số - Đá lại toàn bộ trận đấu (Full 90')" },
    { minute: "> 10' đến Hết Hiệp 1 (Half-time)", rule: "Giữ nguyên tỉ số - Đá lại từ phút bị out đến hết trận" },
    { minute: "> 45' đến < 60 phút", rule: "Giữ nguyên tỉ số - Đá lại tính kết quả đến hết Hiệp 1" },
    { minute: "> 60' đến < 85 phút", rule: "Giữ nguyên tỉ số - Đá lại tính kết quả đến phút 30:00''" },
    { minute: "> 85' đến Hết trận (Full-time)", rule: "Giữ nguyên tỉ số - Đá lại tính kết quả đến phút 15:00''" },
  ];

  return (
    <>
      <Banner
        title="NỘI QUY GIẢI ĐẤU ĐTHÉN FCO ™"
        subtitle="Tổng hợp đầy đủ luật thi đấu, quy định hẹn lịch, xử lý sự cố và chuẩn mực ứng xử dành cho các HLV tham gia ĐThén FCO™."
        badge="OFFICIAL RULES"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1 - KHUNG GIỜ THI ĐẤU, HẸN ĐẤU & LUẬT 24H / 15P */}
          <CardSection badgeNumber={1} title="KHUNG GIỜ THI ĐẤU & HẸN ĐẤU">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p className="text-slate-800">
                Sau khi BTC công bố bảng đấu, các VĐV được phép chủ động liên hệ đối thủ để sắp xếp thời gian thi đấu.
              </p>

              {/* Nguyên tắc hẹn đấu */}
              <div className="space-y-2">
                <p>• VĐV có thể hẹn trên nhóm bảng đấu hoặc nhắn tin riêng. BTC <strong>khuyến nghị nhắn tin riêng</strong> để dễ lưu lại bằng chứng khi cần đối chiếu.</p>
                <p>• Người chủ động hẹn <strong>bắt buộc phải đưa ra ít nhất một khung giờ cụ thể</strong> có thể thi đấu. <em>(Ví dụ: "Hôm nay tôi rảnh từ 08:00–10:00 và 16:00–20:00")</em>.</p>
                <p>• Người nhận lời hẹn cũng <strong>bắt buộc phản hồi bằng khung giờ cụ thể</strong>, kể cả khi thời gian của hai bên không trùng nhau. <em>(Ví dụ: "Hôm nay tôi chỉ rảnh từ 11:00–14:00 và sau 20:00")</em>.</p>
              </div>

              {/* Xử lý khi không thể thống nhất thời gian */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">Xử lý khi không thể thống nhất thời gian (Hết hạn thi đấu):</h4>
                <p>• <strong>VĐV A có đưa khung giờ cụ thể, VĐV B không thực hiện đúng quy định:</strong> A được xem xét <strong>xử thắng 3-0</strong>.</p>
                <p>• <strong>Cả hai VĐV đều không đưa ra khung giờ cụ thể:</strong> BTC sẽ <strong>random kết quả</strong>.</p>
                <p>• <strong>Cả hai đều đưa ra thời gian cụ thể nhưng liên tục trái giờ:</strong> BTC sẽ xem xét lịch sử trao đổi và tình hình thực tế để đưa ra quyết định.</p>
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded border border-slate-200">
                  ⚠️ Tin nhắn không có thời gian cụ thể như <em>"Khi nào bạn rảnh?", "Tối đá nhé", "Lát đá không?"</em> sẽ <strong>không được xem là lời hẹn hợp lệ</strong>.
                </p>
              </div>

              {/* LUẬT 24 GIỜ */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">QUY ĐỊNH LUẬT 24 GIỜ (Trách nhiệm phản hồi)</h4>
                <p className="text-slate-600">Mốc <strong>24 giờ</strong> được sử dụng để xác định trách nhiệm phản hồi giữa hai VĐV:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  <li>
                    <strong>Trường hợp đối thủ không phản hồi:</strong> Nếu VĐV A gửi lời hẹn có khung giờ cụ thể và sau 24 giờ kể từ lúc gửi VĐV B vẫn không phản hồi → <strong>VĐV A được xử thắng 3-0</strong>.
                  </li>
                  <li>
                    <strong>Trường hợp đối thủ có phản hồi:</strong> Nếu VĐV A đưa ra thời gian cụ thể nhưng VĐV B chỉ trả lời chung chung <em>"Hôm nay bận", "Để hôm khác nhé"</em> mà <strong>không đưa ra giờ có thể đá</strong>, thì đủ 24 giờ không thống nhất → <strong>VĐV B có thể bị xử thua 0-3</strong>.
                  </li>
                </ul>
              </div>

              {/* LUẬT 15 PHÚT */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">QUY ĐỊNH LUẬT 15 PHÚT (Đi muộn giờ thi đấu)</h4>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  <li>Hai bên đã chốt giờ thi đấu cụ thể (Ví dụ: 20:00). Đến 20:15 đối thủ không vào phòng / không phản hồi → <strong>Xử thua 0-3</strong>.</li>
                  <li>VĐV đến đúng giờ cần <strong>chụp ảnh màn hình tin nhắn / phòng chờ có hiển thị rõ thời gian</strong> gửi BTC để làm bằng chứng.</li>
                </ul>
              </div>
            </div>
          </CardSection>

          {/* Section 2 - QUY ĐỊNH XỬ LÝ SỰ CỐ MẠNG */}
          <CardSection badgeNumber={2} title="XỬ LÝ SỰ CỐ NGẮT KẾT NỐI (DISS MẠNG / VĂNG GAME)">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p>
                Nhằm đảm bảo tính công bằng và thời gian thi đấu của các HLV, quy định bù giờ khi xảy ra sự cố ngắt kết nối được chuẩn hóa theo mốc thời gian:
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4">Thời điểm bị ngắt kết nối</th>
                      <th className="py-2.5 px-4">Hình thức xử lý bù giờ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {disconnectTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-semibold text-slate-900">{row.minute}</td>
                        <td className="py-2.5 px-4 text-slate-700">{row.rule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                <p className="font-bold">📌 Lưu ý quan trọng:</p>
                <p>• Khi vào trận đá bù, hai HLV chuyền bóng qua lại đến mốc thời gian bắt đầu tính kết quả.</p>
                <p>• HLV bị dis mạng có trách nhiệm liên hệ lại đối thủ trong vòng 10 phút để tiếp tục thi đấu.</p>
              </div>
            </div>
          </CardSection>

          {/* Section 3 - QUY TẮC ỨNG XỬ & FAIR-PLAY */}
          <CardSection badgeNumber={3} title="QUY TẮC ỨNG XỬ & TINH THẦN FAIR-PLAY">
            <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
              <p>
                1. <strong>Tôn trọng đối thủ:</strong> Tuyệt đối nghiêm cấm các hành vi chửi bới, lăng mạ, phân biệt vùng miền hoặc khiêu khích đối thủ trên kênh chat/nhóm giải.
              </p>
              <p>
                2. <strong>Câu giờ phi thể thao:</strong> Nghiêm cấm chuyền bóng qua lại ở phần sân nhà (back-passing) từ phút 75 trở đi khi đang dẫn bàn mà không có sự áp sát của đối phương.
              </p>
              <p>
                3. <strong>Báo cáo kết quả:</strong> Sau khi hoàn thành trận đấu, HLV thắng (hoặc cả 2 bên) có trách nhiệm chụp ảnh bảng tỷ số cuối trận gửi vào nhóm để BTC cập nhật BXH.
              </p>
            </div>
          </CardSection>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default DthenNoiQuy;
