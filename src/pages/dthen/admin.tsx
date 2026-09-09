import React from "react";
import Banner from "../../components/banner";
import Footer from "../../components/footer";
import Body from "../../components/body";
import dthenImg from "../../img/DTHEN.jpg";

const DthenAdmin: React.FC = () => {
  return (
    <>
      <Banner
        title="BAN TỔ CHỨC & TIỂU SỬ ADMIN ĐỨC THÉN"
        subtitle="Thông tin người sáng lập, tiểu sử tuyển thủ chuyên nghiệp và Ban Điều Hành giải đấu ĐThén FCO ™"
        badge="ADMIN & FOUNDER PROFILE"
      />

      <Body>
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* ================= ADMIN PROFILE HERO SPOTLIGHT ================= */}
          <div className="p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#0b1c2e] dark:via-[#071524] dark:to-[#040e18] text-slate-800 dark:text-white border-2 border-blue-200 dark:border-blue-500/40 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
            
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-8 relative z-10">
              
              {/* Profile Avatar Frame */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-amber-500 p-1 border-2 border-blue-400/80 shadow-2xl relative group overflow-visible">
                  <img
                    src={dthenImg}
                    alt="Admin Đức Thén"
                    className="w-full h-full object-cover object-top rounded-[18px] sm:rounded-[22px] shadow-inner group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950/95 border border-amber-400 text-amber-300 text-[10px] font-oswald font-black uppercase tracking-widest shadow-md whitespace-nowrap">
                    FVPL PRO
                  </div>
                </div>

                <div className="mt-3.5 sm:mt-4 text-center">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/40 text-blue-800 dark:text-blue-300 text-[11px] sm:text-xs font-oswald font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
                    <span>FOUNDER & STREAMER</span>
                  </span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="space-y-3.5 sm:space-y-4 text-center md:text-left flex-1">
                <div>
                  <span className="text-[11px] sm:text-xs font-oswald font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
                    NGƯỜI SÁNG LẬP & TRƯỞNG BAN TỔ CHỨC
                  </span>
                  <h1 className="font-oswald text-2xl sm:text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-white tracking-wide mt-0.5">
                    ADMIN ĐỨC THÉN <span className="text-blue-600 dark:text-blue-400 text-xl sm:text-2xl md:text-3xl font-bold">(ĐTHÉN FCO)</span>
                  </h1>
                  <p className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold mt-1">
                    Tuyển thủ Chuyên Nghiệp FVPL | Streamer & Content Creator FC Online
                  </p>
                </div>

                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed font-normal">
                  <strong className="text-slate-950 dark:text-white font-bold">Đức Thén (Đthén)</strong> là một gương mặt quen thuộc và giàu sức ảnh hưởng trong cộng đồng người chơi <strong>FC Online Việt Nam</strong>. Từng góp mặt tranh tài tại hệ thống giải đấu chuyên nghiệp cấp cao nhất <strong>FVPL (Vietnam Pro League)</strong>, Đức Thén được biết đến với kỹ năng điều khiển trận đấu điêu luyện, tư duy chiến thuật nhạy bén và phong cách thi đấu cống hiến.
                </p>

                {/* ================= 3 ULTRA-CUSTOMIZED HIGH-CONTRAST CARDS ================= */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-3 text-left">
                  
                  {/* Card 1: Tuyển Thủ FVPL */}
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-amber-50/90 dark:bg-[#122234] border-2 border-amber-300 dark:border-amber-400/40 shadow-sm dark:shadow-lg hover:border-amber-400 dark:hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between space-y-3">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400" />
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-200 dark:bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-900 dark:text-amber-300 text-base sm:text-lg group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-xs">
                          <i className="fa-solid fa-trophy"></i>
                        </div>
                        <span className="text-[9px] font-oswald font-black px-2.5 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-400/40 uppercase tracking-wider">
                          ĐỈNH CAO FVPL
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-oswald font-black text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors uppercase tracking-wide">
                          Tuyển Thủ Chuyên Nghiệp
                        </h3>
                        <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed font-normal">
                          Tranh tài tại hệ thống giải đấu cấp cao nhất <strong>FVPL Vietnam</strong>, đối đầu các top team với kỹ năng thượng thừa.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-200 dark:border-slate-700 flex items-center justify-between text-[10px] font-oswald text-amber-800 dark:text-amber-300 font-bold uppercase">
                      <span>🏆 FVPL Summer 2026</span>
                      <span>⭐ Trình Độ Cao</span>
                    </div>
                  </div>

                  {/* Card 2: Cộng Đồng 500 Anh Em */}
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-blue-50/90 dark:bg-[#0d2238] border-2 border-blue-300 dark:border-blue-400/40 shadow-sm dark:shadow-lg hover:border-blue-500 dark:hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between space-y-3">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-200 dark:bg-blue-400/20 border border-blue-400 flex items-center justify-center text-blue-900 dark:text-blue-300 text-base sm:text-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xs">
                          <i className="fa-solid fa-users"></i>
                        </div>
                        <span className="text-[9px] font-oswald font-black px-2.5 py-0.5 rounded-full bg-blue-200/80 dark:bg-blue-500/20 text-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-400/40 uppercase tracking-wider">
                          SỨC HÚT LỚN
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-oswald font-black text-slate-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors uppercase tracking-wide">
                          Cộng Đồng 500 Anh Em
                        </h3>
                        <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed font-normal">
                          Sáng lập và dẫn dắt cộng đồng người chơi FC Online đông đảo, đoàn kết và luôn hỗ trợ các HLV phong trào.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-blue-200 dark:border-slate-700 flex items-center justify-between text-[10px] font-oswald text-blue-800 dark:text-blue-300 font-bold uppercase">
                      <span>👥 Group Đthén FCO</span>
                      <span>🤝 Fair-play 100%</span>
                    </div>
                  </div>

                  {/* Card 3: Live & Sáng Tạo Nội Dung */}
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-emerald-50/90 dark:bg-[#0c281e] border-2 border-emerald-300 dark:border-emerald-400/40 shadow-sm dark:shadow-lg hover:border-emerald-500 dark:hover:border-[#00e575] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col justify-between space-y-3">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-200 dark:bg-emerald-400/20 border border-emerald-400 flex items-center justify-center text-emerald-900 dark:text-[#00e575] text-base sm:text-lg group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                          <i className="fa-solid fa-headset"></i>
                        </div>
                        <span className="text-[9px] font-oswald font-black px-2.5 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-500/20 text-emerald-900 dark:text-[#00e575] border border-emerald-300 dark:border-emerald-400/40 uppercase tracking-wider">
                          STREAMER & LIVE
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-oswald font-black text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-[#00e575] transition-colors uppercase tracking-wide">
                          Live & Sáng Tạo Chiến Thuật
                        </h3>
                        <p className="text-xs text-slate-700 dark:text-slate-200 mt-1 leading-relaxed font-normal">
                          Livestream đập thẻ, hướng dẫn kỹ năng leo rank, phân tích sơ đồ chiến thuật và tạo giải đấu phong trào hấp dẫn.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-emerald-200 dark:border-slate-700 flex items-center justify-between text-[10px] font-oswald text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                      <span>📱 TikTok & Facebook</span>
                      <span>⚡ Giao Lưu Trực Tiếp</span>
                    </div>
                  </div>

                </div>

                {/* Channels & Connect Buttons */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-start gap-2.5">
                  <a
                    href="https://www.facebook.com/search/groups/?q=Đthén%20FCO%20và%20500%20anh%20em"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:scale-105 transition-all cursor-pointer group"
                    title="Truy cập nhóm Facebook Đthén FCO và 500 anh em"
                  >
                    <i className="fa-brands fa-facebook text-sm group-hover:scale-110 transition-transform"></i>
                    <span>Group: Đthén FCO và 500 anh em</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-75"></i>
                  </a>
                  
                  <a
                    href="https://www.tiktok.com/@duck.thens2601?_r=1&_t=ZS-99ZvOx8OVFM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-700 hover:border-amber-400 font-oswald text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:scale-105 transition-all cursor-pointer group"
                    title="Xem kênh TikTok Livestream chính thức của Đức Thén (@duck.thens2601)"
                  >
                    <i className="fa-brands fa-tiktok text-sm group-hover:scale-110 transition-transform text-pink-400"></i>
                    <span>TikTok: @duck.thens2601</span>
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-75"></i>
                  </a>
                </div>

              </div>

            </div>

          </div>

          {/* ================= COMMITTEE & SUPPORT STAFF ================= */}
          <div className="space-y-4 sm:space-y-6">
            <div className="border-b-2 border-blue-600 pb-2">
              <span className="text-xs font-oswald font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
                ORGANIZING COMMITTEE
              </span>
              <h2 className="font-oswald text-xl sm:text-3xl font-black uppercase text-slate-900 dark:text-white tracking-wide mt-0.5">
                CƠ CẤU BAN ĐIỀU HÀNH & TỔ TRỌNG TÀI
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Card 1: Role of Admin Duc Then */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#0b1f17] border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-oswald font-bold uppercase text-blue-700 dark:text-blue-400 tracking-wider block">
                      TRƯỞNG BAN TỔ CHỨC
                    </span>
                    <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-slate-900 dark:text-white mt-0.5">
                      ADMIN ĐỨC THÉN
                    </h3>
                  </div>
                  <img
                    src={dthenImg}
                    alt="Admin Đức Thén"
                    className="w-12 h-12 rounded-xl object-cover object-top border-2 border-blue-400/80 shadow-md flex-shrink-0"
                  />
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  <p>
                    • <strong className="text-slate-900 dark:text-white font-bold">Quyền hạn tối cao:</strong> Chịu trách nhiệm tổng thể về công tác tổ chức giải đấu, phê duyệt danh sách Huấn luyện viên tham gia và ban hành điều lệ chính thức.
                  </p>
                  <p>
                    • <strong className="text-slate-900 dark:text-white font-bold">Phán quyết tranh chấp:</strong> Tiếp nhận khiếu nại, xử lý các sự cố mạng/gian lận và đưa ra quyết định phán quyết cuối cùng có hiệu lực tuyệt đối.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-oswald text-xs font-bold uppercase tracking-wider shadow-sm">
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Điều Hành Trực Tiếp</span>
                  </span>
                </div>
              </div>

              {/* Card 2: Referees and Tech Supervisors */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#0b1f17] border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-xs font-oswald font-bold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider block">
                    BAN GIÁM SÁT KỸ THUẬT & TRỌNG TÀI
                  </span>
                  <h3 className="font-oswald text-lg sm:text-xl font-bold uppercase text-slate-900 dark:text-white mt-0.5">
                    TỔ TRỌNG TÀI: PHAN LONG
                  </h3>
                </div>

                <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  <p>
                    • <strong className="text-slate-900 dark:text-white font-bold">Phụ trách tổ trọng tài:</strong> Trọng tài <strong className="text-emerald-700 dark:text-emerald-400 font-bold">Phan Long</strong> chịu trách nhiệm trực tiếp công tác điều phối, giám sát các lượt trận và đảm bảo tính công bằng xuyên suốt giải đấu.
                  </p>
                  <p>
                    • <strong className="text-slate-900 dark:text-white font-bold">Kiểm duyệt đội hình:</strong> Giám sát nghiêm ngặt quỹ lương squad 305/305 và thẻ cầu thủ hợp lệ trước mỗi trận đấu.
                  </p>
                  <p>
                    • <strong className="text-slate-900 dark:text-white font-bold">Cập nhật dữ liệu:</strong> Tiếp nhận hình ảnh biên bản kết quả thi đấu từ các HLV và cập nhật tức thì lên Bảng Xếp Hạng.
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-oswald text-xs font-bold uppercase tracking-wider shadow-sm">
                    <i className="fa-solid fa-headset"></i>
                    <span>Tổ Trọng Tài Phan Long</span>
                  </span>
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

export default DthenAdmin;
