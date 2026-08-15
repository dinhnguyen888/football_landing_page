import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const NoiQuy: React.FC = () => {
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
        title="NỘI QUY GIẢI ĐẤU"
        subtitle="Toàn bộ điều lệ, quy định hẹn đấu, xử lý sự cố out game và văn hóa ứng xử"
        badge="OFFICIAL RULES"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1 */}
          <CardSection title="1. KHUNG GIỜ THI ĐẤU & HẸN ĐẤU">
            <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
              <p>a) BTC sẽ ra lịch thi đấu cụ thể trên Group Facebook và Box Messenger.</p>
              <p>b) Không được tự ý dàn xếp đá trước các vòng đấu mà không có sự thông qua từ BTC.</p>
              <p>c) Giờ thi đấu tự do, các Huấn luyện viên tự hẹn nhau trên nhóm Messenger để đá đúng hạn vòng đấu.</p>
            </div>
          </CardSection>

          {/* Section 2 */}
          <CardSection title="2. THI ĐẤU BÙ & XỬ THUA">
            <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
              <p>a) Các trận thi đấu quá hạn, trễ lịch: Sẽ được thi đấu bù vào 01 ngày theo lịch trình của BTC.</p>
              <p>b) Điều này chỉ áp dụng với các HLV đã thi đấu ít nhất 01 trận trong 2 ngày gần nhất.</p>
              <p>c) Nếu trong 2 ngày gần nhất không đá trận nào thì bị <strong>xử thua 0-3</strong> và không áp dụng thi đấu bù.</p>
              <p>d) Những trường hợp HLV đã nhiều lần gọi đối thủ mà không được hồi âm: Hãy chụp màn hình tin nhắn gửi BTC để xem xét xử thắng kỹ thuật.</p>
              <p>e) Nếu HLV không trả lời tin nhắn đối thủ, không thi đấu trận nào trong 2 ngày liên tiếp thì sẽ bị tính là bỏ giải.</p>
            </div>
          </CardSection>

          {/* Section 3 */}
          <CardSection title="3. LỖI MẤT KẾT NỐI (DISS MẠNG / OUT NGANG)">
            <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
              <p>a) Mỗi VĐV tham gia giải đấu phải chịu trách nhiệm về kết nối mạng ổn định và một lối chơi công bằng.</p>
              <p>b) Nếu VĐV đang xếp sau / bị dẫn bàn tự ý thoát khỏi game (bỏ trận đang diễn ra) sẽ bị <strong>trừ 6 điểm Fair-play và xử thua 0-3</strong> trận đó.</p>
              <p>c) Tái phạm sẽ bị KICK khỏi giải đấu ngay lập tức.</p>
              <p>d) Một trận mà một VĐV bị out từ <strong>03 lần trở lên</strong> thì BTC sẽ xử thua 0-3 ngay lập tức.</p>
              <p>e) <strong>Quy định đá lại theo các khung thời gian bị out:</strong></p>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-800 font-oswald uppercase">
                    <tr>
                      <th className="p-3">Thời gian bị out</th>
                      <th className="p-3">Quy tắc đá lại</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {disconnectTable.map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-bold text-emerald-800">{row.minute}</td>
                        <td className="p-3 text-slate-700">{row.rule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 italic">
                * Lưu ý: Lúc đá lại, nếu trận trước đã có bàn thắng thì không nhất thiết phải phản lưới nhà để trả bàn thắng, tỉ số sẽ được cộng dồn sau đó.
              </p>
            </div>
          </CardSection>

          {/* Section 4 */}
          <CardSection title="4. VĂN HÓA ỨNG XỬ & HÀNH VI">
            <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
              <p>a) Không được có hành vi thiếu văn hóa, không fair-play với đối thủ và gây ảnh hưởng tới giải đấu.</p>
              <p>b) Không dùng lời lẽ lăng mạ, xúc phạm, chửi bới lẫn nhau trong nhóm chung và riêng.</p>
              <p>c) <strong>Lần 1 vi phạm:</strong> Trừ 3 điểm Fair-play cảnh cáo.</p>
              <p>d) <strong>Lần 2 vi phạm:</strong> Trừ 6 điểm Fair-play.</p>
              <p>e) <strong>Lần 3 tái phạm:</strong> Cho vào danh sách đen, KICK khỏi giải vĩnh viễn.</p>
              <p>f) Phát hiện mạo danh, từng có hành vi gian lận: Loại khỏi giải ngay lập tức, tước toàn bộ danh hiệu & giải thưởng.</p>
            </div>
          </CardSection>

          {/* Section 5 */}
          <CardSection title="5. BỎ GIẢI / RÚT LUI KHỎI GIẢI">
            <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
              <p>a) Rút lui hay bỏ giải khi giải đấu đang diễn ra đều <strong>không được hoàn lại lệ phí</strong> đã đóng.</p>
              <p>b) Khi một HLV bỏ giải, mọi kết quả trước đó và các trận còn lại của HLV này đều được xử thua 0-3 cho các đối thủ.</p>
            </div>
          </CardSection>

          {/* Section 6 */}
          <div className="p-6 sm:p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <h2 className="font-oswald text-lg font-bold uppercase text-emerald-900">
              6. LỜI CẢM ƠN TỪ BAN TỔ CHỨC
            </h2>
            <p className="text-slate-700 text-sm max-w-2xl mx-auto leading-relaxed">
              BTC xin chân thành cảm ơn các HLV đã tham gia và nghiêm túc tuân thủ nội quy. Tinh thần trách nhiệm và sự tự giác của anh em chính là động lực lớn nhất để giải đấu ngày một chuyên nghiệp và gắn kết hơn!
            </p>
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default NoiQuy;
