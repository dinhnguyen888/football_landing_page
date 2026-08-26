import React from "react";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import Body from "../../components/body";
import CardSection from "../../components/cardsection";

const DthenDieuKien: React.FC = () => {
  return (
    <>
      <Banner
        title="ĐIỀU KIỆN THAM DỰ GIẢI ĐẤU ĐTHÉN FCO ™"
        subtitle="Tiêu chí xét duyệt tư cách Vận động viên, thiết bị thi đấu và trách nhiệm của HLV"
        badge="ENTRY REQUIREMENTS"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          <CardSection badgeNumber={1} title="TIÊU CHÍ XÉT DUYỆT TƯ CÁCH THAM DỰ">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <p className="text-slate-800">
                Tất cả các Huấn luyện viên tham gia <strong>FC ONLINE ĐTHÉN FCO ™</strong> phải đáp ứng đầy đủ các tiêu chuẩn sau:
              </p>

              <ul className="list-disc list-inside space-y-2 pl-1">
                <li>Có tài khoản FC Online máy chủ Việt Nam (Garena) hoạt động bình thường, không có tiền sử vi phạm chính sách game.</li>
                <li>Đường truyền Internet ổn định (ưu tiên cắm dây LAN) nhằm hạn chế tối đa rủi ro ngắt kết nối giữa trận.</li>
                <li>Tham gia đầy đủ nhóm Zalo / Discord chính thức của giải đấu để nhận thông báo và hẹn lịch thi đấu với đối thủ.</li>
                <li>Cam kết thi đấu trung thực, tuân thủ tuyệt đối lịch trình và các phán quyết của Ban Tổ Chức.</li>
              </ul>
            </div>
          </CardSection>

          <CardSection badgeNumber={2} title="TRÁCH NHIỆM & NGHĨA VỤ CỦA HLV">
            <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
              <p>• <strong>Báo cáo kết quả:</strong> Chụp ảnh màn hình bảng tổng kết trận đấu và gửi lên nhóm bảng đấu ngay khi kết thúc.</p>
              <p>• <strong>Giải quyết khiếu nại:</strong> Mọi khiếu nại về hành vi phi thể thao hoặc sự cố cần cung cấp video / hình ảnh bằng chứng rõ ràng cho BTC trong vòng 30 phút sau trận đấu.</p>
            </div>
          </CardSection>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default DthenDieuKien;
