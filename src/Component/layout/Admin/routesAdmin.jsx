import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from '../header';
import AboutAdmin from './AboutAdmin';
import HomeAdmin from './homeAdmin';
import LaporanDonasiAdmin from './LaporanDonasiAdmin';
import ManajemenKonten from './manajemen_konten';
import KoordinatorDonatur from './KoordinatorDonatur';
import ListDonatur from './list_donatur';
import ListPenyaluranAdmin from './ListPenyaluranAdmin';
import NotifikasiManager from './NotifikasiManager';
import PenerimaManfaatAdmin from './PenerimaManfaatAdmin';
import QrCodeManager from './QrCodeManager';
import SidebarAdmin from './sidebarAdmin';

function RoutesAdmin({ admin, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <Header
        admin={admin}
        onLogout={onLogout}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <SidebarAdmin isOpen={isSidebarOpen}>
        <Routes>
          <Route path="/" element={<HomeAdmin admin={admin} />} />
          <Route path="/list/donatur" element={<ListDonatur />} />
          <Route path="/donatur/koordinator" element={<KoordinatorDonatur />} />
          <Route path="/transaksi/qrcode" element={<QrCodeManager />} />
          <Route path="/laporan/donasi" element={<LaporanDonasiAdmin />} />
          <Route path="/penyaluran/list" element={<ListPenyaluranAdmin />} />
          <Route path="/penyaluran/penerima-manfaat" element={<PenerimaManfaatAdmin />} />
          <Route path="/manajemen-konten" element={<ManajemenKonten />} />
          <Route path="/notifikasi" element={<NotifikasiManager />} />
          <Route path="/about" element={<AboutAdmin />} />
        </Routes>
      </SidebarAdmin>
    </>
  );
}

export default RoutesAdmin;
