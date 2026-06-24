import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './sidebarUser';
import About from './AboutUser';
import Home from './homeUser';
import HeaderUser from './HeaderUser';
import Profil from './profilUser';
import ProfilEdit from './profilEdit';
import RiwayatTransaksi from './RiwayatTransaksiUser';
import Transaksi from './TransaksiUser';
import KonfirmasiPembayaranUser from './KonfirmasiPembayaranUser';
import Notifikasi from './NotifikasiUser';
import ForgotPassword from './ForgotPassword';
import ZakatCalculator from './ZakatkalkulatorUser';
import EducationZakat from './EdukasiZakatUser';
import HelpCenter from './HelpCenter';
import SecurityCenter from './SecurityCenter';

function RoutesUser({ user, onLogout, onGuestLoginRequest }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isGuest = Boolean(user?.isGuest);

  return (
    <>
      <HeaderUser
        user={user}
        onLogout={onLogout}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onGuestLoginRequest={onGuestLoginRequest}
      />
      <Sidebar isOpen={isSidebarOpen} user={user}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/profil" element={isGuest ? <Navigate to="/" replace /> : <Profil />} />
          <Route path="/profil/edit" element={isGuest ? <Navigate to="/" replace /> : <ProfilEdit />} />
          <Route path="/donasi" element={<Navigate to="/donasi/zakat" replace />} />
          <Route path="/donasi/zakat" element={<Transaksi user={user} forcedJenisKey="zakat" />} />
          <Route path="/donasi/infaq-sedekah" element={<Transaksi user={user} forcedJenisKey="infaq-sedekah" />} />
          <Route path="/donasi/wakaf" element={<Transaksi user={user} forcedJenisKey="wakaf" />} />
          <Route path="/transaksi/riwayat" element={isGuest ? <Navigate to="/" replace /> : <RiwayatTransaksi user={user} />} />
          <Route path="/transaksi/konfirmasi-pembayaran" element={<KonfirmasiPembayaranUser user={user} />} />
          <Route path="/bsz" element={isGuest ? <Navigate to="/" replace /> : <Navigate to="/transaksi/riwayat" replace />} />
          <Route path="/notifikasi" element={isGuest ? <Navigate to="/" replace /> : <Notifikasi user={user} />} />
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
