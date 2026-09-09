const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} = require('docx');

async function generateDocx() {
  const primaryColor = '0F2C59'; // Deep Navy
  const secondaryColor = '1E40AF'; // Royal Blue
  const accentColor = 'D97706'; // Amber / Gold
  const darkTextColor = '1E293B'; // Slate 800
  const lightBgColor = 'F8FAFC'; // Slate 50
  const headerBgColor = '0F172A'; // Slate 900

  // Helper functions for formatting
  const createTitle = (text) =>
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 36, // 18pt
          color: primaryColor,
          font: 'Calibri',
        }),
      ],
    });

  const createSubtitle = (text) =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360 },
      children: [
        new TextRun({
          text,
          italics: true,
          size: 24, // 12pt
          color: '64748B',
          font: 'Calibri',
        }),
      ],
    });

  const createH1 = (text) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 360, after: 140 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 28, // 14pt
          color: primaryColor,
          font: 'Calibri',
        }),
      ],
    });

  const createH2 = (text) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 24, // 12pt
          color: secondaryColor,
          font: 'Calibri',
        }),
      ],
    });

  const createP = (text, options = {}) =>
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text,
          size: 22, // 11pt
          color: darkTextColor,
          font: 'Calibri',
          ...options,
        }),
      ],
    });

  const createBullet = (boldPrefix, text) =>
    new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: boldPrefix,
          bold: true,
          size: 22,
          color: darkTextColor,
          font: 'Calibri',
        }),
        new TextRun({
          text: ' ' + text,
          size: 22,
          color: darkTextColor,
          font: 'Calibri',
        }),
      ],
    });

  const createAlertBox = (type, title, text) => {
    let borderColor = '0284C7';
    let bgColor = 'F0F9FF';
    let tag = 'THÔNG TIN QUAN TRỌNG';

    if (type === 'warning') {
      borderColor = 'D97706';
      bgColor = 'FFFBEB';
      tag = 'LƯU Ý ĐẶC BIỆT';
    } else if (type === 'success') {
      borderColor = '059669';
      bgColor = 'ECFDF5';
      tag = 'MẸO SỬ DỤNG';
    }

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders: {
                left: { style: BorderStyle.SINGLE, size: 24, color: borderColor },
                top: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
              },
              shading: { fill: bgColor, type: ShadingType.CLEAR },
              margins: { top: 140, bottom: 140, left: 200, right: 200 },
              children: [
                new Paragraph({
                  spacing: { after: 60 },
                  children: [
                    new TextRun({
                      text: `[${tag}] ${title}: `,
                      bold: true,
                      size: 22,
                      color: borderColor,
                      font: 'Calibri',
                    }),
                    new TextRun({
                      text: text,
                      size: 22,
                      color: darkTextColor,
                      font: 'Calibri',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  const createTable = (headers, rowsData) => {
    const headerRow = new TableRow({
      tableHeader: true,
      children: headers.map(
        (h) =>
          new TableCell({
            shading: { fill: headerBgColor, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: h,
                    bold: true,
                    size: 20,
                    color: 'FFFFFF',
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          })
      ),
    });

    const bodyRows = rowsData.map((row, rIdx) => {
      const isAlt = rIdx % 2 === 1;
      return new TableRow({
        children: row.map(
          (cellText, cIdx) =>
            new TableCell({
              shading: isAlt ? { fill: lightBgColor, type: ShadingType.CLEAR } : undefined,
              margins: { top: 100, bottom: 100, left: 140, right: 140 },
              children: [
                new Paragraph({
                  alignment: cIdx === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
                  children: [
                    new TextRun({
                      text: cellText,
                      size: 20,
                      color: darkTextColor,
                      font: 'Calibri',
                    }),
                  ],
                }),
              ],
            })
        ),
      });
    });

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...bodyRows],
    });
  };

  // Construct document
  const doc = new Document({
    creator: 'Ban Tổ Chức Giải Đấu',
    title: 'HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN TRỊ GIẢI ĐẤU (ADMIN PORTAL)',
    description: 'Tài liệu hướng dẫn toàn diện dành cho Ban Tổ Chức Sao Vàng Cup & ĐThén FCO',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }, // 1 inch
          },
        },
        children: [
          createTitle('HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN TRỊ GIẢI ĐẤU'),
          createSubtitle('CỔNG ADMIN NỘI BỘ — SAO VÀNG CUP ™ & ĐTHÉN FCO ™'),

          createAlertBox(
            'warning',
            'BẢO MẬT ĐƯỜNG DẪN NỘI BỘ',
            'Nút truy cập trang quản trị đã được gỡ bỏ hoàn toàn khỏi giao diện người xem để bảo đảm tính riêng tư. Chỉ thành viên Ban Tổ Chức có đường dẫn và mã PIN mới có thể truy cập hệ thống này.'
          ),

          createH1('1. TỔNG QUAN & ĐƯỜNG DẪN TRUY CẬP'),
          createP(
            'Hệ thống Admin Portal là cổng quản lý tập trung độc lập dành cho Ban Tổ Chức. Hệ thống hỗ trợ quản lý thống nhất cả hai giải đấu lớn: Sao Vàng Cup ™ và ĐThén FCO ™ trên cùng một giao diện chuyên nghiệp.'
          ),
          createBullet('Đường dẫn trực tiếp trên máy cục bộ (Local):', 'http://localhost:3000/admin-portal'),
          createBullet('Đường dẫn chính thức trực tuyến (Vercel):', 'https://<tên-domain-của-bạn>/admin-portal'),
          createBullet('Đường dẫn tương thích ngược:', '/quanlygiaidau (hệ thống tự động chuyển hướng đến Admin Portal).'),
          createBullet('Hạ tầng Backend đám mây:', 'Google Cloud Firestore kết nối thời gian thực, đảm bảo mọi thay đổi tỉ số và phân nhánh thi đấu được lưu an toàn vĩnh viễn trên đám mây.'),

          createH1('2. ĐĂNG NHẬP BẢO MẬT & PHIÊN LÀM VIỆC (SESSION)'),
          createP(
            'Hệ thống được bảo vệ bằng lớp khóa xác thực mã PIN trước khi vào bảng điều khiển:'
          ),
          createBullet('Mã PIN mặc định:', '020604'),
          createBullet('Cơ chế giữ phiên (Session):', 'Sau khi đăng nhập thành công, phiên làm việc sẽ được lưu trong sessionStorage của trình duyệt. Bạn có thể thoải mái F5/tải lại trang hoặc chuyển tab mà không bị hỏi lại mã PIN.'),
          createBullet('Nút Đăng xuất (Logout):', 'Tại góc trên bên phải thanh Topbar luôn có nút màu đỏ "Đăng xuất". Bấm nút này sẽ xóa phiên bảo mật và khóa ngay lập tức portal khi bạn rời máy tính.'),

          createH1('3. CỔNG CHỌN GIẢI ĐẤU (TOURNAMENT SELECTION HUB)'),
          createP(
            'Ngay sau khi nhập đúng mã PIN, hệ thống mở ra Cổng chọn giải đấu trực quan cho phép bạn quyết định muốn làm việc với giải nào:'
          ),
          createBullet('Giải 1 - SAO VÀNG CUP ™:', 'Quy mô 4 bảng đấu (Bảng A, B, C, D) gồm 20 Huấn luyện viên, thi đấu vòng tròn 2 lượt (Lượt đi & Lượt về). Quản lý bảng điểm và cây phân nhánh Tứ kết, Bán kết, Chung kết. (Dữ liệu đám mây: document sao_vang).'),
          createBullet('Giải 2 - ĐTHÉN FCO ™:', 'Quy mô 8 bảng đấu (Bảng A đến H) gồm 32 Huấn luyện viên thi đấu vòng tròn 1 lượt. Quản lý phân nhánh trực tiếp từ Vòng 1/8 (16 đội), Tứ kết, Bán kết và Chung kết. (Dữ liệu đám mây: document dthen_fco).'),
          createP(
            'Tính năng chuyển đổi giải nhanh: Trong quá trình làm việc trong Dashboard, bạn có thể bấm nút [ ⇄ Đổi Giải ] trên thanh Topbar bất cứ lúc nào để chuyển sang giải đấu còn lại mà không cần đăng nhập lại.'
          ),

          createH1('4. HƯỚNG DẪN CHI TIẾT CÁC TAB CHỨC NĂNG'),

          createH2('4.1. Tab 1: Danh Sách Giải & Xuất Bản Ra Web'),
          createBullet('Công tắc BẬT / TẮT:', 'Giải đấu nào đang gạt BẬT sẽ là giải chính thức xuất hiện trên trang web khán giả (/ltd hoặc /dthen/ltd). Nếu bạn tắt hết, giao diện web sẽ hiện thông báo chờ giải đấu mới.'),
          createBullet('Quản lý nhiều mùa giải (Archive):', 'Hệ thống lưu giữ danh sách các mùa giải đã tạo. Bạn có thể chọn bất kỳ mùa giải nào để vào chỉnh sửa tỉ số hoặc xóa giải cũ không còn dùng.'),
          createBullet('Nút Tạo Giải Mới:', 'Chuyển nhanh sang màn hình khởi tạo mùa giải mới.'),

          createH2('4.2. Tab 2: Lịch Đấu & Chỉnh Sửa Tỉ Số'),
          createBullet('Bộ chọn Bảng đấu:', 'Bấm vào các nút BẢNG A, BẢNG B,... để lọc danh sách trận đấu của bảng đó.'),
          createBullet('Bộ lọc theo Vòng đấu:', 'Xem toàn bộ các vòng hoặc lọc nhanh từng vòng đấu cụ thể.'),
          createBullet('Ô nhập tỉ số trực tiếp:', 'Mỗi cặp đấu có 2 ô nhập tỉ số (Đội Nhà : Đội Khách). Chỉ cần gõ số bàn thắng, hệ thống sẽ tự động cập nhật trạng thái "Đã ghi nhận".'),
          createBullet('Bảng xếp hạng tự động tính điểm (Live Standings):', 'Ngay khi bạn điền tỉ số trận đấu, bảng xếp hạng phía trên sẽ tự động tính toán lại tức thì: Số trận đã đá (ĐĐ), Thắng, Hòa, Thua, Bàn thắng (BT), Bàn thua (SBT), Hiệu số bàn thắng (HS) và Tổng điểm (Đ).'),

          createH2('4.3. Tab 3: Vòng Loại Trực Tiếp (Knock-out)'),
          createBullet('Nút "Tạo Cây Knockout Ngay":', 'Khi các trận đấu vòng bảng kết thúc, bấm nút này để hệ thống tự động bốc Top 1 và Top 2 mỗi bảng theo hiệu số/điểm và xếp cặp chéo nhánh (Nhất bảng này gặp Nhì bảng kia).'),
          createBullet('Nhập tỉ số trận Knockout:', 'Điền tỉ số trận đấu. Đội thắng sẽ tự động được hệ thống đưa vào trận đấu của vòng tiếp theo (Tứ kết ➔ Bán kết ➔ Chung kết).'),
          createBullet('Đá luân lưu Penalty (PEN):', 'Nếu trận đấu kết thúc với tỉ số hòa, hệ thống tự động mở thêm 2 ô nhập Penalty để bạn điền tỉ số luân lưu phân định thắng thua.'),
          createBullet('Nút Mở lại vòng bảng:', 'Nếu phát hiện có trận vòng bảng nhập nhầm sau khi đã tạo cây Knockout, bấm nút xoay tròn để mở lại vòng bảng và tính toán lại.'),

          createH2('4.4. Tab 4: Tạo Giải Đấu Mới (Wizard 2 Bước)'),
          createBullet('Bước 1 - Thiết lập thể thức:', 'Nhập Tên giải đấu, Tên mùa giải (Mùa 2, Mùa 3...), Số bảng đấu (2, 4, hoặc 8 bảng), Số đội mỗi bảng, và chọn thể thức (Vòng tròn 1 lượt hoặc Vòng tròn 2 lượt đi/về). Bấm "Tiếp tục điền tên đội".'),
          createBullet('Bước 2 - Điền tên thành viên:', 'Nhập tên Huấn luyện viên và Câu lạc bộ cho từng bảng đấu.'),
          createBullet('Hoàn tất:', 'Bấm nút "HOÀN TẤT & TẠO GIẢI NGAY". Hệ thống sẽ tự động thuật toán Berger để lên lịch thi đấu hoàn chỉnh và kích hoạt xuất bản ra web.'),

          createH2('4.5. Tab 5: Firebase Cloud & Đồng Bộ Dữ Liệu'),
          createBullet('Chấm tròn trạng thái trên Topbar:', '🟢 Chấm xanh lá nhấp nháy: Đã kết nối Firebase Cloud Firestore trực tuyến (Online). 🟡 Chấm vàng hổ phách: Chế độ lưu trữ Local Storage nội bộ máy tính.'),
          createBullet('Nút "Đẩy Lên Cloud Firestore":', 'Ép lưu toàn bộ dữ liệu hiện tại lên máy chủ Google Cloud để mọi khán giả vào web đều xem được kết quả mới nhất.'),
          createBullet('Nút "Kéo Về Từ Cloud":', 'Tải bản ghi mới nhất từ Cloud Firestore về máy tính (rất hữu ích khi bạn đổi thiết bị hoặc chuyển quyền quản trị).'),

          createH1('5. DANH SÁCH BIẾN MÔI TRƯỜNG CLOUD (ENV)'),
          createP(
            'Để tính năng đám mây Firebase Firestore hoạt động trên Vercel khi xuất bản trực tuyến, hãy chắc chắn 6 biến sau đã được thêm vào Vercel Dashboard > Project Settings > Environment Variables:'
          ),
          createTable(
            ['STT', 'Tên Biến Môi Trường (Variable)', 'Ý Nghĩa / Mô Tả'],
            [
              ['1', 'REACT_APP_FIREBASE_API_KEY', 'Khóa Web API của dự án Firebase'],
              ['2', 'REACT_APP_FIREBASE_AUTH_DOMAIN', 'Tên miền xác thực (ví dụ: project.firebaseapp.com)'],
              ['3', 'REACT_APP_FIREBASE_PROJECT_ID', 'ID định danh dự án trên Google Cloud'],
              ['4', 'REACT_APP_FIREBASE_STORAGE_BUCKET', 'Địa chỉ lưu trữ bucket (project.appspot.com)'],
              ['5', 'REACT_APP_FIREBASE_MESSAGING_SENDER_ID', 'Mã định danh Cloud Messaging Sender'],
              ['6', 'REACT_APP_FIREBASE_APP_ID', 'Mã định danh ứng dụng Web Client App ID'],
            ]
          ),

          createH1('6. CÂU HỎI THƯỜNG GẶP (FAQ) & LƯU Ý KHI VẬN HÀNH'),
          createBullet('Tôi nhập nhầm tỉ số thì phải làm sao?', 'Bạn chỉ cần nhấp vào ô tỉ số của trận đấu đó, xóa đi và nhập lại số đúng. Bảng xếp hạng và Cloud Firestore sẽ tự động cập nhật ngay lập tức.'),
          createBullet('Tại sao người xem trên điện thoại không thấy điểm mới cập nhật?', 'Người xem chỉ cần vuốt màn hình xuống để tải lại (Pull to refresh), hoặc bấm nút "Làm mới" trên web. Nếu giải đấu chưa cấu hình Firebase trên Vercel, hãy cấu hình các biến môi trường như mục 5.'),
          createBullet('Có thể quản lý cùng lúc 2 giải không?', 'Có! Bạn có thể chuyển đổi linh hoạt giữa Sao Vàng Cup và ĐThén FCO bằng nút [ ⇄ Đổi Giải ] trên thanh công cụ bất kỳ lúc nào.'),
          createBullet('Khán giả có xem được trang admin không?', 'Không! Đường dẫn Admin được bảo mật riêng và không hiển thị trên bất kỳ menu công khai nào của web.'),

          new Paragraph({
            spacing: { before: 400 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '— CHÚC BAN TỔ CHỨC ĐIỀU HÀNH MỘT MÙA GIẢI THÀNH CÔNG RỰC RỠ! —',
                bold: true,
                size: 20,
                color: primaryColor,
                font: 'Calibri',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '..', 'HUONG_DAN_SU_DUNG_ADMIN_PORTAL.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('Successfully generated DOCX at:', outputPath);
}

generateDocx().catch((err) => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
