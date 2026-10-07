import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./utils/themeContext";
import Trangchu from "./pages/trangchu";

import Navbar from "./components/navbar";
import ScrollEnhancer from "./components/ScrollEnhancer";
import Dieukien from "./pages/dieukien";
import NoiQuy from "./pages/noiquy";
import Quydinh from "./pages/quydinh";
import Admin from "./pages/admin";
import Cacnhomgiai from "./pages/cacnhomgiai";
import Xephang from "./pages/xephangthoidai";
import Tieudiem from "./pages/tieudiem";
import Danhsachhlv from "./pages/danhsachhlv";
import Thethuc from "./pages/thethuc";
import Giaithuong from "./pages/giaithuong";

export default function App() {
  return (
    <ThemeProvider>
      <ScrollEnhancer />
      <Navbar />
      <Routes>
        {/* Sao Vàng Cup Tournament Routes */}
        <Route path="/" element={<Trangchu />} />
        <Route path="/saovang" element={<Trangchu />} />
        <Route path="/dieukienthamdu" element={<Dieukien />} />
        <Route path="/noiquy" element={<NoiQuy />} />
        <Route path="/quydinh" element={<Quydinh />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cacnhomgiai" element={<Cacnhomgiai />} />
        <Route path="/topcacmua" element={<Navigate to="/xephang" replace />} />
        <Route path="/xephang" element={<Xephang />} />
        <Route path="/tieudiem" element={<Tieudiem />} />
        <Route path="/danhsachhlv" element={<Danhsachhlv />} />
        <Route path="/thethuc" element={<Thethuc />} />
        <Route path="/giaithuong" element={<Giaithuong />} />
      </Routes>
    </ThemeProvider>
  );
}

