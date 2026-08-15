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
          <CardSection badgeNumber={1} title="A. ĐIỀU KIỆN THAM DỰ GIẢI ĐẤU">
            <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900">1. Điều kiện tham gia</h4>
                <p><strong>Tất cả HLV yêu thích FC Online đều có thể đăng ký tham gia giải đấu</strong>, không phân biệt trình độ hay kinh nghiệm. HLV tham dự cần đăng ký đầy đủ thông tin theo biểu mẫu của BTC và tuân thủ các quy định về đội hình, sơ đồ chiến thuật và luật thi đấu.</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">2. Hình thức thi đấu</h4>
                <p>Các trận đấu được tổ chức theo hình thức trực tuyến (Online) trên nền tảng FC Online.</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">3. Quy định thi đấu</h4>
                <p>
                  Các HLV tham gia giải phải tuân thủ các quy định thi đấu của FC Online do BTC áp dụng.
                </p>
                <p className="pt-1">
                  👉 Xem chi tiết <a href="/quydinh" className="text-emerald-700 font-bold hover:text-emerald-600 underline underline-offset-4 decoration-emerald-500/50 hover:decoration-emerald-500 transition-colors">tại đây</a>.
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">4. Tinh thần Fair-play</h4>
                <p>Mọi HLV phải thi đấu nghiêm túc, văn minh và công bằng. Các hành vi gian lận, cố tình lợi dụng lỗi game hoặc vi phạm luật sẽ bị BTC xử lý theo quy định.</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900">5. Phần thưởng</h4>
                <p>Các phần thưởng của giải sẽ được trao cho những HLV đạt thành tích xuất sắc sau khi giải đấu kết thúc và kết quả được BTC xác nhận.</p>
              </div>
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
                  2. VÍ ĐIỆN TỬ MOMO
                </span>
                <p className="text-xs text-slate-600">SĐT / Ví Momo: <strong className="font-mono text-slate-900 text-sm">0886200436</strong></p>
                <p className="text-xs text-slate-600">Chủ tài khoản: <strong>PHAN DINH LONG</strong></p>
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
