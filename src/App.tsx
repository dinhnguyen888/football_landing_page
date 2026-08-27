import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./utils/themeContext";
import HomeHub from "./pages/homehub";
import Trangchu from "./pages/trangchu";

import Navbar from "./components/navbar";
import Dieukien from "./pages/dieukien";
import NoiQuy from "./pages/noiquy";
import Quydinh from "./pages/quydinh";
import Admin from "./pages/admin";
import Cacnhomgiai from "./pages/cacnhomgiai";
import Topmua from "./pages/topcacmua";
import Xephang from "./pages/xephangthoidai";
import Tieudiem from "./pages/tieudiem";
import Danhsachhlv from "./pages/danhsachhlv";
import Ltd from "./pages/ltd";
import Thethuc from "./pages/thethuc";
import Giaithuong from "./pages/giaithuong";
import Quanlygiaidau from "./pages/quanlygiaidau";
import Taogiaidau from "./pages/taogiaidau";

// ĐThén FCO Pages
import DthenTrangchu from "./pages/dthen/trangchu";
import DthenNoiQuy from "./pages/dthen/noiquy";
import DthenTheThuc from "./pages/dthen/thethuc";
import DthenQuyDinh from "./pages/dthen/quydinh";
import DthenDieuKien from "./pages/dthen/dieukien";
import DthenGiaiThuong from "./pages/dthen/giaithuong";
import DthenLtd from "./pages/dthen/ltd";
import DthenXephang from "./pages/dthen/xephangthoidai";
import DthenAdmin from "./pages/dthen/admin";

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <Routes>
        {/* Hub Selection Portal */}
        <Route path="/" element={<HomeHub />} />

        {/* Sao Vàng Cup Tournament Routes */}
        <Route path="/saovang" element={<Trangchu />} />
        <Route path="/dieukienthamdu" element={<Dieukien />} />
        <Route path="/noiquy" element={<NoiQuy />} />
        <Route path="/quydinh" element={<Quydinh />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cacnhomgiai" element={<Cacnhomgiai />} />
        <Route path="/topcacmua" element={<Topmua />} />
        <Route path="/xephang" element={<Xephang />} />
        <Route path="/tieudiem" element={<Tieudiem />} />
        <Route path="/danhsachhlv" element={<Danhsachhlv />} />
        <Route path="/ltd" element={<Ltd />} />
        <Route path="/thethuc" element={<Thethuc />} />
        <Route path="/giaithuong" element={<Giaithuong />} />
        <Route path="/quanlygiaidau" element={<Quanlygiaidau />} />
        <Route path="/taogiaidau" element={<Taogiaidau />} />

        {/* ĐThén FCO Tournament Routes */}
        <Route path="/dthen" element={<DthenTrangchu />} />
        <Route path="/dthenfco" element={<DthenTrangchu />} />
        <Route path="/dthen/noiquy" element={<DthenNoiQuy />} />
        <Route path="/dthen/thethuc" element={<DthenTheThuc />} />
        <Route path="/dthen/quydinh" element={<DthenQuyDinh />} />
        <Route path="/dthen/dieukienthamdu" element={<DthenDieuKien />} />
        <Route path="/dthen/giaithuong" element={<DthenGiaiThuong />} />
        <Route path="/dthen/ltd" element={<DthenLtd />} />
        <Route path="/dthen/xephang" element={<DthenXephang />} />
        <Route path="/dthen/admin" element={<DthenAdmin />} />
      </Routes>
    </ThemeProvider>
  );
}
