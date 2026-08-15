import React from "react";
import { Routes, Route } from "react-router-dom";
import Trangchu from "./pages/trangchu"

import Navbar from "./components/navbar"
import Dieukien from "./pages/dieukien"
import NoiQuy from "./pages/noiquy"
import Quydinh from "./pages/quydinh"
import Admin from "./pages/admin"
import Cacnhomgiai from "./pages/cacnhomgiai"
import Topmua from "./pages/topcacmua"
import Xephang from "./pages/xephangthoidai"
import Tieudiem from "./pages/tieudiem"
import Danhsachhlv from "./pages/danhsachhlv"
import Ltd from "./pages/ltd"
import Thethuc from "./pages/thethuc"
import Giaithuong from "./pages/giaithuong"
import Quanlygiaidau from "./pages/quanlygiaidau"

export default function App() {
  return (
	  <>
	  <Navbar />
		  <Routes>
			  <Route path="/" element={<Trangchu />} />
			  <Route path="/dieukienthamdu" element ={<Dieukien />} />
			  <Route path="/noiquy" element = {<NoiQuy />} />
			  <Route path="/quydinh" element = {<Quydinh />} />
			  <Route path="/admin" element = {<Admin />} />

			  <Route path="/cacnhomgiai" element = {<Cacnhomgiai />} />
			  <Route path="/topcacmua" element = {<Topmua />} />
			  <Route path="/xephang" element = {<Xephang />} />
			  <Route path="/tieudiem" element = {<Tieudiem />} />
			  <Route path="/danhsachhlv" element = {<Danhsachhlv/>} />
			  <Route path="/ltd" element = {<Ltd/>} />
			  <Route path="/thethuc" element = {<Thethuc/>} />
			  <Route path="/giaithuong" element = {<Giaithuong/>} />
			  <Route path="/quanlygiaidau" element = {<Quanlygiaidau/>} />
		  </Routes>	
	  </>
  )
}
