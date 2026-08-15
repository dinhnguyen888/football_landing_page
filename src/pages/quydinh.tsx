import React from "react";
import Banner from "../components/banner";
import Footer from "../components/footer";
import Body from "../components/body";
import CardSection from "../components/cardsection";

const Quydinh: React.FC = () => {
  return (
    <>
      <Banner
        title="QUY ĐỊNH ĐỘI HÌNH"
        subtitle="Tiêu chuẩn quỹ lương 255/255, quy định sơ đồ 5 hậu vệ và quy trình xử lý vi phạm"
        badge="SQUAD RULES"
      />

      <Body>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section 1: Squad Standards */}
          <CardSection title="1. TIÊU CHUẨN ĐỘI HÌNH">
            <div className="space-y-2 text-slate-700 text-sm leading-relaxed">
              <p>a) Sử dụng đội hình tự do, được phép thay đổi hoặc mua cầu thủ mới trong lúc giải đấu diễn ra.</p>
              <p>b) <strong>Giới hạn quỹ lương tối đa: 255/255.</strong></p>
              <p>c) Được phép kích hoạt buff Huấn Luyện Viên (Team Color & Coach).</p>
              <p>d) <strong>Sử dụng sơ đồ tối đa 5 hậu vệ</strong> (hậu vệ gồm các vị trí: SW, LWB, LB, RCB, LCB, CB, RWB, RB).</p>
              <p>e) Phải chỉnh ở tất cả 10 sơ đồ chiến thuật đều tối đa không quá 5 hậu vệ.</p>
            </div>
          </CardSection>

          {/* Section 2: Violations Handling */}
          <CardSection title="2. QUY TRÌNH XỬ LÝ VI PHẠM SƠ ĐỒ / LƯƠNG">
            <p className="text-slate-600 text-sm mb-3">
              Khi bên A phát hiện bên B vi phạm (có ảnh chụp chứng minh), sẽ áp dụng các tình huống xử lý sau:
            </p>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  • Phát hiện ở phòng chờ hoặc trước khi bắt đầu trận 1:
                </strong>
                <span>Báo ngay cho bên B để bên B điều chỉnh (vì chưa bắt đầu trận 1).</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  • Phát hiện khi trận 1 đã bắt đầu từ 00:01s:
                </strong>
                <span>Đá lại trận 1 nếu bên A đồng ý. Nếu A không đồng ý, <strong>bên B bị xử thua trận 1</strong>.</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  • Phát hiện ở phòng chờ trước khi bắt đầu trận 2:
                </strong>
                <span>Đá lại trận 1 nếu A đồng ý. Giữ nguyên kết quả trận 1 nếu A không đồng ý đá lại (bên B sửa lại trước khi đá trận 2).</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  • Phát hiện khi trận 2 đã bắt đầu từ 00:01s:
                </strong>
                <span>Đá lại trận 2 nếu bên A đồng ý. Nếu A không đồng ý, <strong>bên B bị xử thua trận 2</strong>.</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  • Các trận tiếp theo:
                </strong>
                <span>Áp dụng theo đúng công thức trên. Kết quả trận trước luôn được giữ nguyên nếu đã xác nhận hợp lệ trước đó.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 mt-4">
              ⚠️ Các HLV có trách nhiệm kiểm tra chéo lẫn nhau trước mỗi trận đấu để tăng tính công bằng cho giải!
            </div>
          </CardSection>
        </div>
      </Body>

      <Footer />
    </>
  );
};

export default Quydinh;
