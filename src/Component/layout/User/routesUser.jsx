import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './sidebarUser';
import Header from '../header';
import Home from './homeUser';
import About from '../about';
import Profil from './profilUser';
import ProfilEdit from './profilEdit';
import RiwayatTransaksi from './RiwayatTransaksiUser';
import Transaksi from './TransaksiUser';
import Notifikasi from './NotifikasiUser';
import ForgotPassword from './ForgotPassword';
import ZakatCalculator from './ZakatkalkulatorUser';
import EducationZakat from './EdukasiZakatUser';
import HelpCenter from './HelpCenter';
import SecurityCenter from './SecurityCenter';
import GuestIdentityForm from './GuestIdentityForm';

function RoutesUser({ user, onLogout, onGuestLoginRequest }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isGuest = Boolean(user?.isGuest);

  return (
    <>
      <Header
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
          <Route path="/donasi/zakat" element={isGuest ? <GuestIdentityForm user={user} /> : <Transaksi user={user} forcedJenisKey="zakat" />} />
          <Route path="/donasi/infaq-sedekah" element={isGuest ? <GuestIdentityForm user={user} /> : <Transaksi user={user} forcedJenisKey="infaq-sedekah" />} />
          <Route path="/donasi/wakaf" element={isGuest ? <GuestIdentityForm user={user} /> : <Transaksi user={user} forcedJenisKey="wakaf" />} />
          <Route path="/transaksi/riwayat" element={isGuest ? <Navigate to="/" replace /> : <RiwayatTransaksi user={user} />} />
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
