import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Dieukien: React.FC = () => {
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
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Dieukien;
