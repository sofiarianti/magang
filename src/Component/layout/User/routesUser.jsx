import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './sidebarUser';
import Header from '../header';
import Home from './homeUser';
import About from '../about';
import Profil from './profil';
import ProfilEdit from './profilEdit';
import RiwayatTransaksi from './RiwayatTransaksi';
import Transaksi from './Transaksi';
import Notifikasi from './Notifikasi';
import ForgotPassword from './ForgotPassword';
import ZakatCalculator from './ZakatCalculator';
import EducationZakat from './EducationZakat';
import HelpCenter from './HelpCenter';
import SecurityCenter from './SecurityCenter';


function RoutesUser({ user, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <Header
        user={user}
        onLogout={onLogout}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <Sidebar isOpen={isSidebarOpen}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/profil/edit" element={<ProfilEdit />} />
          <Route path="/donasi" element={<Transaksi user={user} />} />
          <Route path="/transaksi/riwayat" element={<RiwayatTransaksi user={user} />} />
          <Route path="/notifikasi" element={<Notifikasi user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/kalkulator-zakat" element={<ZakatCalculator />} />
          <Route path="/edukasi-zakat" element={<EducationZakat />} />
          <Route path="/bantuan" element={<HelpCenter />} />
          <Route path="/keamanan" element={<SecurityCenter />} />
          <Route path="/transaksi" element={<Transaksi user={user} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Sidebar>
    </>
  );
}

export default RoutesUser;
