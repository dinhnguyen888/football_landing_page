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
        subtitle="Tổng hợp đầy đủ luật thi đấu, quy định hẹn lịch, xử lý sự cố và chuẩn mực ứng xử dành cho các HLV tham gia Sao Vàng Cup™."
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
                    <strong>Trường hợp đối thủ không phản hồi:</strong> Nếu VĐV A gửi lời hẹn có khung giờ cụ thể và sau 24 giờ kể từ lúc gửi VĐV B vẫn không phản hồi → <strong>VĐV A được xử thắng 3-0</strong>. <em>(Nếu A chỉ nhắn chung chung "khi nào bạn rảnh?" thì không được chấp nhận xử thắng)</em>.
                  </li>
                  <li>
                    <strong>Trường hợp đối thủ có phản hồi:</strong> Nếu VĐV A đưa ra thời gian cụ thể nhưng VĐV B chỉ trả lời chung chung <em>"Hôm nay bận", "Để hôm khác nhé"</em> mà <strong>không đưa ra giờ có thể đá</strong>, thì đủ 24 giờ không thống nhất → <strong>VĐV B có thể bị xử thua 0-3</strong>.
                  </li>
                  <li>
                    Ngược lại, nếu VĐV A hỏi chung chung nhưng VĐV B phản hồi bằng <strong>khung giờ cụ thể</strong>, thì quyền chủ động chuyển sang B. Mốc 24 giờ mới sẽ tính từ thời điểm B gửi khung giờ cụ thể.
                  </li>
                </ul>
              </div>

              {/* LUẬT 15 PHÚT */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">QUY ĐỊNH LUẬT 15 PHÚT (Đúng giờ thi đấu)</h4>
                <p>Sau khi hai VĐV đã <strong>xác nhận chính xác ngày và giờ thi đấu</strong>, cả hai phải có mặt đúng giờ:</p>
                <p>• Nếu có việc đột xuất hoặc dự kiến vào muộn, VĐV phải <strong>chủ động thông báo trước hoặc trong thời gian chờ</strong>.</p>
                <p>• Nếu một VĐV đến trễ <strong>quá 15 phút 00 giây</strong> so với giờ đã thống nhất và <strong>không có bất kỳ thông báo nào</strong> → <strong>VĐV đó bị xử thua 0-3</strong>.</p>
                <p className="text-xs text-slate-500 italic">
                  * VĐV yêu cầu xử thắng phải cung cấp ảnh chụp tin nhắn hẹn giờ và thời gian chờ để BTC xác minh. Quyết định của BTC là quyết định cuối cùng.
                </p>
              </div>
            </div>
          </CardSection>

          {/* Section 2 - QUY ĐỊNH XÁC NHẬN KẾT QUẢ THI ĐẤU */}
          <CardSection badgeNumber={2} title="QUY ĐỊNH XÁC NHẬN KẾT QUẢ THI ĐẤU">
            <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
              <p>• Sau khi trận đấu kết thúc, <strong>VĐV/đội trưởng bên thắng</strong> có trách nhiệm chụp màn hình kết quả và gửi cho BTC để xác nhận.</p>
              <p>• Hình ảnh kết quả phải thể hiện rõ:</p>
              <ul className="list-disc list-inside pl-4 space-y-1 text-slate-800 font-medium">
                <li>Tên HLV trong FC Online</li>
                <li>Tỷ số trận đấu</li>
                <li>Thời gian thực tế trên thiết bị tại thời điểm chụp</li>
              </ul>
              <p>• Hai bên có trách nhiệm kiểm tra và xác nhận kết quả khi BTC yêu cầu.</p>
              <p>• Mọi khiếu nại về kết quả phải được gửi cho <strong>trọng tài/BTC trong vòng 05 phút</strong> kể từ khi trận đấu kết thúc.</p>
              <p>• Khi khiếu nại, VĐV <strong>bắt buộc cung cấp hình ảnh hoặc video làm bằng chứng</strong>. BTC sẽ căn cứ vào bằng chứng và thông tin liên quan để xử lý.</p>
              <p>• Khiếu nại gửi quá thời hạn có thể không được xem xét, trừ trường hợp đặc biệt do BTC quyết định.</p>
              <p className="text-xs text-slate-900 font-semibold italic pt-1 border-t border-slate-100">
                * Quyết định của BTC/trọng tài sau khi xem xét bằng chứng là quyết định cuối cùng.
              </p>
            </div>
          </CardSection>

          {/* Section 3 - THI ĐẤU BÙ & XỬ THUA */}
          <CardSection badgeNumber={3} title="THI ĐẤU BÙ & XỬ THUA">
            <div className="space-y-3.5 text-slate-700 text-sm leading-relaxed">
              {/* a */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">a) Trường hợp được thi đấu bù</h4>
                <p>• Các trận đấu không thể hoàn thành đúng thời hạn hoặc bị trễ lịch sẽ được BTC sắp xếp <strong>01 ngày thi đấu bù</strong>.</p>
                <p>• Thời gian thi đấu bù sẽ do BTC thông báo và các HLV có trách nhiệm chủ động sắp xếp để hoàn thành trận đấu trong thời gian được quy định.</p>
              </div>

              {/* b */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">b) Điều kiện được áp dụng thi đấu bù</h4>
                <p>• HLV chỉ được áp dụng quyền thi đấu bù nếu trong <strong>02 ngày gần nhất đã thi đấu ít nhất 01 trận</strong>.</p>
                <p>• Quy định này nhằm đảm bảo HLV vẫn đang tham gia giải đấu và có tinh thần chủ động hoàn thành lịch thi đấu.</p>
              </div>

              {/* c */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">c) Trường hợp bị xử thua 0-3</h4>
                <p>• Nếu HLV <strong>không thi đấu bất kỳ trận nào trong 02 ngày liên tiếp</strong> mà không có lý do chính đáng được BTC chấp thuận, HLV đó sẽ: <strong>Không được áp dụng thi đấu bù</strong> và bị <strong>xử thua 0-3</strong> đối với trận đấu quá hạn.</p>
                <p>• Trường hợp cả hai HLV đều không chủ động thi đấu, BTC sẽ xem xét trách nhiệm của từng bên trước khi đưa ra quyết định.</p>
              </div>

              {/* d */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">d) Không liên hệ được đối thủ</h4>
                <p>• HLV có trách nhiệm <strong>chủ động liên hệ đối thủ</strong> để thống nhất thời gian thi đấu.</p>
                <p>• Nếu đã nhiều lần nhắn tin hoặc gọi đối thủ nhưng không nhận được phản hồi, HLV phải <strong>chụp màn hình toàn bộ nội dung liên hệ</strong>, có thể hiện thời gian, và gửi cho BTC.</p>
                <p>• BTC sẽ căn cứ vào bằng chứng để xem xét <strong>xử thắng kỹ thuật 3-0</strong> cho HLV đã chủ động liên hệ. <em>(Nếu không có hình ảnh hoặc bằng chứng liên hệ, BTC có quyền không công nhận yêu cầu xử thắng kỹ thuật)</em>.</p>
              </div>

              {/* e */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">e) Trường hợp bị xác định bỏ giải</h4>
                <p>HLV có thể bị xác định là <strong>bỏ giải</strong> khi đồng thời có các dấu hiệu sau:</p>
                <ul className="list-disc list-inside space-y-0.5 pl-2 text-slate-800">
                  <li>Không trả lời tin nhắn của đối thủ hoặc BTC.</li>
                  <li>Không chủ động liên hệ để thi đấu.</li>
                  <li>Không có lý do chính đáng hoặc không thông báo trước cho BTC.</li>
                </ul>
                <p className="mt-1">Khi bị xác định bỏ giải, BTC có quyền <strong>xử thua các trận chưa thi đấu và loại HLV khỏi giải</strong>.</p>
              </div>

              <p className="text-xs text-slate-900 font-semibold italic pt-2 border-t border-slate-100">
                * Lưu ý: Trong mọi trường hợp phát sinh tranh chấp, BTC sẽ căn cứ vào lịch sử thi đấu, tin nhắn, hình ảnh và các bằng chứng liên quan để đưa ra quyết định cuối cùng.
              </p>
            </div>
          </CardSection>

          {/* Section 4 - Clean, Natural Tournament Regulation Format */}
          <CardSection badgeNumber={4} title="QUY ĐỊNH VỀ CÁC TRƯỜNG HỢP MẤT KẾT NỐI TRONG KHI THI ĐẤU">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p className="text-slate-800">
                Nhằm đảm bảo tính <strong>công bằng, minh bạch và quyền lợi của các VĐV</strong>, mọi trường hợp mất kết nối hoặc xảy ra sự cố kỹ thuật trong quá trình thi đấu phải được ghi nhận đầy đủ bằng <strong>hình ảnh hoặc video</strong>, kèm theo <strong>thời điểm xảy ra sự cố</strong> để BTC và trọng tài có cơ sở xem xét, xử lý.
              </p>

              {/* 1 */}
              <div className="space-y-1.5 pt-1">
                <h4 className="font-bold text-slate-900">1. Hành vi cố ý ngắt kết nối</h4>
                <p>• VĐV cố ý thoát trận, ngắt mạng, tắt game hoặc thực hiện bất kỳ hành vi nào nhằm làm gián đoạn trận đấu để tạo lợi thế cho bản thân sẽ bị xử lý nghiêm.</p>
                <p>• Tùy theo mức độ vi phạm, VĐV có thể: <strong>Bị xử thua trận đấu</strong>, <strong>bị loại khỏi giải</strong> hoặc <strong>cấm thi đấu từ 06 đến 12 tháng</strong> trong hệ thống giải Sao Vàng Cup™.</p>
                <p>• BTC có quyền kiểm tra các bằng chứng liên quan trước khi đưa ra quyết định cuối cùng.</p>
              </div>

              {/* 2 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">2. Khi xảy ra sự cố trong trận đấu</h4>
                <p>Khi xảy ra mất kết nối, lỗi game, lỗi máy tính hoặc sự cố khiến trận đấu bị gián đoạn, VĐV phải:</p>
                <p>• Ngay lập tức ghi lại tình trạng bằng <strong>ảnh chụp màn hình hoặc video</strong> (thể hiện rõ: tỷ số lúc out, phút thi đấu và thời gian thực).</p>
                <p>• Báo cáo sự việc cho trọng tài/BTC qua kênh hỗ trợ chính thức của giải đấu.</p>
                <p>• Không tự ý thống nhất kết quả hoặc tự tổ chức thi đấu lại khi chưa có sự đồng ý của BTC.</p>
                <p className="text-xs text-slate-500 italic">* Trường hợp VĐV không cung cấp được bằng chứng cần thiết, BTC có quyền từ chối xử lý khiếu nại.</p>
              </div>

              {/* 3 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">3. Trường hợp đang có tình huống tấn công</h4>
                <p>• Nếu xảy ra mất kết nối trong lúc một bên đang thực hiện tình huống tấn công có khả năng trực tiếp dẫn đến bàn thắng, BTC sẽ xem xét dựa trên video, hình ảnh và tình trạng trận đấu trước khi xảy ra sự cố.</p>
                <p>• Nếu bóng đã được sút hoặc chuyền trong một tình huống rõ ràng dẫn đến bàn thắng trước thời điểm mất kết nối, BTC có quyền công nhận bàn thắng.</p>
              </div>

              {/* 4 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">4. Thời gian khắc phục sự cố</h4>
                <p>• VĐV gặp sự cố về máy tính, thiết bị hoặc đường truyền mạng có tối đa <strong>10 phút</strong> để khắc phục kể từ thời điểm báo cáo.</p>
                <p>• Sau khi khắc phục, VĐV thông báo lại cho trọng tài để tiếp tục thi đấu. Quá 10 phút không có lý do chính đáng sẽ bị <strong>xử thua</strong>.</p>
                <p>• VĐV có trách nhiệm tự đảm bảo thiết bị và đường truyền mạng của mình đáp ứng điều kiện thi đấu.</p>
              </div>

              {/* 5 */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">5. Thi đấu lại sau khi mất kết nối</h4>
                <p>• <strong>Tỷ số trước thời điểm xảy ra sự cố sẽ được giữ nguyên.</strong> Hai bên chỉ thi đấu phần thời gian còn lại của trận đấu.</p>
                <p>• Quyền kiểm soát bóng khi bắt đầu lại trận đấu sẽ ưu tiên cho đội đang cầm bóng trước lúc xảy ra sự cố (nếu có đủ bằng chứng xác định).</p>
                
                {/* Bảng khung giờ đá lại */}
                <div className="mt-3 overflow-x-auto rounded border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-800 uppercase font-semibold">
                      <tr>
                        <th className="p-2.5 border-b border-slate-200">Thời gian bị out</th>
                        <th className="p-2.5 border-b border-slate-200">Quy tắc đá lại</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {disconnectTable.map((row, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-semibold text-slate-900">{row.minute}</td>
                          <td className="p-2.5 text-slate-700">{row.rule}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 italic mt-1">
                  * Lưu ý: Lúc đá lại, nếu trận trước đã có bàn thắng thì không nhất thiết phải phản lưới nhà để trả bàn thắng, tỉ số sẽ được cộng dồn sau đó.
                </p>
              </div>

              {/* 6 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">6. Các trường hợp có thể được xem xét thi đấu lại</h4>
                <p>BTC xem xét cho đá lại phần thời gian còn lại đối với các sự cố bất khả kháng như: mất điện đột ngột, đứt đường truyền mạng diện rộng, lỗi máy chủ FC Online, crash game.</p>
              </div>

              {/* 7 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">7. Mất kết nối trong tình huống phạt đền (Penalty)</h4>
                <p>• Nếu bên thủ môn bị out sau khi bóng đã sút chắc chắn vào lưới → Công nhận bàn thắng.</p>
                <p>• Nếu bên sút phạt đền bị mất kết nối trước khi thực hiện → Tái hiện lại tình huống phạt đền khi đá lại.</p>
              </div>

              {/* 8 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">8. Tự ý thoát trận (Bỏ trận)</h4>
                <p>VĐV đang bị dẫn bàn hoặc nhận thấy khả năng thắng thấp mà cố tình thoát game, ngắt mạng mà không có lý do hợp lệ sẽ bị <strong>xử thua 0-3 và có thể bị loại khỏi giải</strong>.</p>
              </div>

              {/* 9 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">9. Yêu cầu đối với bằng chứng sự cố</h4>
                <p>Khi báo cáo cần cung cấp: Ảnh/video sự cố, tỷ số lúc bị out, phút thi đấu và thời gian thực tế. <em>(Khuyến nghị VĐV nên chủ động quay lại màn hình khi thi đấu)</em>.</p>
              </div>

              {/* 10 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">10. Quyền quyết định của BTC</h4>
                <p>Đối với các trường hợp không thể xác định rõ nguyên nhân hoặc có tranh chấp, <strong>quyết định của Ban Tổ Chức sau khi xem xét chứng cứ là quyết định cuối cùng</strong>.</p>
              </div>
            </div>
          </CardSection>

          {/* Section 5 - Clean Code of Conduct */}
          <CardSection badgeNumber={5} title="QUY TẮC ỨNG XỬ & THI ĐẤU">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p className="text-slate-800">
                Nhằm đảm bảo môi trường <strong>công bằng – văn minh – chuyên nghiệp</strong>, mọi VĐV tham gia <strong>Sao Vàng Cup™</strong> phải tuân thủ các quy định sau:
              </p>

              {/* 1 */}
              <div className="space-y-1.5 pt-1">
                <h4 className="font-bold text-slate-900">1. Gian lận & thi đấu không công bằng</h4>
                <p className="text-slate-600">Nghiêm cấm mọi hành vi:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Sử dụng hack, phần mềm hoặc công cụ gian lận.</li>
                  <li>Nhờ người khác thi đấu hộ hoặc sử dụng tài khoản không đúng đăng ký.</li>
                  <li>Thông đồng, dàn xếp tỷ số hoặc cố tình thua trận.</li>
                  <li>Cố tình thoát game, ngắt kết nối để tạo lợi thế.</li>
                  <li>Thi đấu với thành viên không thuộc danh sách đã đăng ký.</li>
                  <li>Cá cược hoặc tham gia dàn xếp kết quả trận đấu.</li>
                </ul>
              </div>

              {/* 2 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">2. Thái độ & ứng xử</h4>
                <p>VĐV phải giữ tinh thần <strong>fair-play</strong> và tôn trọng đối thủ.</p>
                <p className="text-slate-600">Nghiêm cấm:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Chửi bới, xúc phạm, đe dọa hoặc khiêu khích đối thủ.</li>
                  <li>Quấy rối, gây mất đoàn kết hoặc cố tình gây tranh cãi.</li>
                  <li>Phát tán thông tin sai lệch gây ảnh hưởng đến giải đấu, VĐV hoặc BTC.</li>
                  <li>Có hành vi thiếu hợp tác hoặc cố tình làm chậm tiến độ giải đấu.</li>
                </ul>
              </div>

              {/* 3 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">3. Sự cố trong trận đấu</h4>
                <p>Khi xảy ra mất kết nối, lỗi game hoặc sự cố kỹ thuật, VĐV phải chụp ảnh hoặc quay video làm bằng chứng (ghi rõ <strong>tỷ số, phút thi đấu và thời gian xảy ra sự cố</strong>) và báo cáo ngay cho trọng tài/BTC qua kênh hỗ trợ của giải.</p>
                <p>BTC sẽ căn cứ vào bằng chứng để quyết định <strong>tiếp tục trận đấu, thi đấu lại hoặc công nhận kết quả</strong>. Trường hợp không có bằng chứng rõ ràng, BTC có quyền đưa ra quyết định dựa trên dữ liệu hiện có.</p>
              </div>

              {/* 4 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">4. Tuân thủ quyết định của BTC</h4>
                <p>VĐV có trách nhiệm thực hiện đúng lịch thi đấu, quy định và hướng dẫn của BTC. Mọi hành vi cố tình chống đối, trì hoãn hoặc không chấp hành quyết định có thể bị xử phạt.</p>
              </div>

              {/* 5 */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">5. Hình thức xử phạt</h4>
                <p className="text-slate-600">Tùy theo mức độ vi phạm, BTC có thể áp dụng một hoặc nhiều hình thức:</p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Nhắc nhở hoặc cảnh cáo.</li>
                  <li>Xử thua trận đấu.</li>
                  <li>Hủy kết quả trận đấu.</li>
                  <li>Loại khỏi giải.</li>
                  <li>Tước giải thưởng hoặc danh hiệu.</li>
                  <li>Cấm tham gia các mùa giải tiếp theo.</li>
                  <li>Cấm thi đấu vĩnh viễn đối với hành vi gian lận nghiêm trọng.</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <p className="text-slate-900 font-semibold italic">
                  * BTC Sao Vàng Cup™ có quyền xem xét và đưa ra quyết định cuối cùng đối với mọi tình huống phát sinh trong quá trình giải đấu.
                </p>
                <p className="text-xs text-slate-500">
                  Việc đăng ký tham gia <strong>Sao Vàng Cup™</strong> đồng nghĩa với việc VĐV đã đọc, hiểu và đồng ý tuân thủ toàn bộ quy định của giải.
                </p>
              </div>
            </div>
          </CardSection>

          {/* Section 6 */}
          <CardSection badgeNumber={6} title="BỎ GIẢI / RÚT LUI KHỎI GIẢI">
            <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
              <p>a) Rút lui hay bỏ giải khi giải đấu đang diễn ra đều <strong>không được hoàn lại lệ phí</strong> đã đóng.</p>
              <p>b) Khi một HLV bỏ giải, mọi kết quả trước đó và các trận còn lại của HLV này đều được xử thua 0-3 cho các đối thủ.</p>
            </div>
          </CardSection>

          {/* Section 7 - Warm & Sincere Gratitude Box */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50/60 via-emerald-50/40 to-slate-50 border border-emerald-200/80 p-8 sm:p-10 text-center shadow-sm">
            <div className="max-w-2xl mx-auto space-y-4">
              {/* Warm icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100/80 text-emerald-700 text-xl mb-1 shadow-sm">
                <i className="fa-solid fa-handshake-angle"></i>
              </div>

              <h2 className="font-fco text-xl sm:text-2xl font-bold uppercase tracking-wide text-emerald-950">
                7. LỜI CẢM ƠN TỪ BAN TỔ CHỨC
              </h2>

              <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed">
                <p>
                  BTC xin gửi lời <strong className="text-emerald-900 font-semibold">cảm ơn chân thành đến tất cả các HLV</strong> đã đồng hành, thi đấu nghiêm túc và tuân thủ nội quy của giải.
                </p>
                <p className="text-slate-600">
                  Chính tinh thần <span className="text-emerald-800 font-semibold">trách nhiệm, fair-play và sự tự giác</span> của mỗi HLV là yếu tố quan trọng giúp <span className="text-amber-800 font-semibold">Sao Vàng Cup™</span> ngày càng chuyên nghiệp, công bằng và gắn kết hơn.
                </p>
              </div>

              <div className="pt-2">
                <div className="inline-block px-6 py-3 rounded-full bg-white border border-emerald-200/90 shadow-sm">
                  <p className="text-emerald-800 font-semibold text-sm sm:text-base italic">
                    "Cảm ơn anh em đã cùng nhau tạo nên một sân chơi văn minh, cạnh tranh và đầy nhiệt huyết!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default NoiQuy;
