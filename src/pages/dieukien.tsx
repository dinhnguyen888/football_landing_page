import React, { useState } from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Dieukien: React.FC = () => {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <>
      <Banner
        title="ĐIỀU KIỆN THAM DỰ & LỆ PHÍ"
        subtitle="Quy định đăng ký, chấp nhận điều lệ và các cổng đóng lệ phí giải đấu"
        badge="REGISTRATION TERMS"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Terms */}
          <CardSection title="A. ĐIỀU KIỆN THAM DỰ GIẢI ĐẤU">
            <div className="space-y-3 text-slate-700 text-sm leading-relaxed">
              <p><strong>1. Điều kiện tham gia:</strong> Tất cả các đội bóng / HLV muốn tham gia phải đăng ký theo biểu mẫu của BTC. Tuân thủ đầy đủ các quy định về thành phần, sơ đồ và luật chơi.</p>
              <p><strong>2. Hình thức thi đấu:</strong> Các trận đấu diễn ra theo hình thức thi đấu trực tuyến (Online) trên nền tảng game FC Online.</p>
              <p><strong>3. Quy định về trò chơi:</strong> Các trận đấu tuân thủ quy tắc thời gian, giới hạn lương 255 và sơ đồ tối đa 5 hậu vệ.</p>
              <p><strong>4. Tính công bằng và Fair-play:</strong> Mọi đội bóng phải thể hiện tinh thần thể thao văn minh. Các hành vi gian lận sẽ bị xử lý nghiêm khắc.</p>
              <p><strong>5. Phần thưởng:</strong> Phần thưởng cho các đội xuất sắc nhất sẽ được trao sau khi kết thúc giải đấu.</p>
            </div>
          </CardSection>

          {/* Fees & Payment */}
          <CardSection title="B. PHÍ ĐIỀU LỆ GIẢI ĐẤU (50.000 VNĐ / VĐV)">
            <p className="text-slate-700 text-sm mb-3">
              Mỗi vận động viên tham gia đóng phí điều lệ <strong>50.000 VNĐ</strong> qua các cổng thanh toán sau:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-oswald font-bold text-sm text-emerald-800 uppercase block">
                  1. NGÂN HÀNG VIETINBANK
                </span>
                <p className="text-xs text-slate-600">STK: <strong className="font-mono text-slate-900 text-sm">0886200436</strong></p>
                <p className="text-xs text-slate-600">Chủ tài khoản: <strong>PHAN DINH LONG</strong></p>
                <button
                  onClick={() => copyToClipboard("0886200436", "vietin")}
                  className="mt-2 px-3 py-1 text-xs rounded bg-white border border-slate-300 hover:bg-slate-100 font-medium text-slate-700 flex items-center space-x-1"
                >
                  <i className="fa-solid fa-copy"></i>
                  <span>{copiedAccount === "vietin" ? "Đã sao chép!" : "Sao chép STK"}</span>
                </button>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-oswald font-bold text-sm text-pink-800 uppercase block">
                  2. VÍ MOMO / THẺ CÀO VIETTEL
                </span>
                <p className="text-xs text-slate-600">SĐT / Momo: <strong className="font-mono text-slate-900 text-sm">0886200436</strong></p>
                <p className="text-xs text-slate-600">Chủ SĐT: <strong>PHAN DINH LONG</strong></p>
                <button
                  onClick={() => copyToClipboard("0886200436", "momo")}
                  className="mt-2 px-3 py-1 text-xs rounded bg-white border border-slate-300 hover:bg-slate-100 font-medium text-slate-700 flex items-center space-x-1"
                >
                  <i className="fa-solid fa-copy"></i>
                  <span>{copiedAccount === "momo" ? "Đã sao chép!" : "Sao chép SĐT"}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic pt-2">
              * Sau khi chuyển khoản, HLV vui lòng gửi ảnh chụp biên lai cho Admin Phan Long để hoàn tất thủ tục.
            </p>
          </CardSection>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Dieukien;
