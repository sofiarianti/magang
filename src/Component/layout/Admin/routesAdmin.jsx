import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from '../header';
import AboutAdmin from './AboutAdmin';
import HomeAdmin from './homeAdmin';
import InputTransaksiDonasi from './InputTransaksiDonasi';
import LaporanDonasiAdmin from './LaporanDonasiAdmin';
import ManajemenKonten from './manajemen_kontenAdmin';
import KoordinatorDonatur from './KoordinatorDonatur';
import ListDonatur from './list_donaturAdmin';
import ListPenyaluranAdmin from './ListPenyaluranAdmin';
import NotifikasiManager from './NotifikasiAdmin';
import PenerimaManfaatAdmin from './PenerimaManfaatAdmin';
import QrCodeManager from './QrCodeAdmin';
import RegistrasiAdmin from './RegistrasiAdmin';
import SidebarAdmin from './sidebarAdmin';
import { isRoleAllowed, resolveAdminRole } from './roleAdmin';

function RoutesAdmin({ admin, onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const role = resolveAdminRole(admin);

  const guard = (element, allow) => {
    if (isRoleAllowed(role, allow)) return element;
    return <Navigate to="/" replace />;
  };

  return (
    <>
      <Header
        admin={admin}
        onLogout={onLogout}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <SidebarAdmin isOpen={isSidebarOpen} admin={admin}>
        <Routes>
          <Route path="/" element={<HomeAdmin admin={admin} />} />
          <Route path="/list/donatur" element={<ListDonatur />} />
          <Route path="/donatur/koordinator" element={<KoordinatorDonatur />} />
          <Route path="/admin/input-transaksi" element={<InputTransaksiDonasi admin={admin} />} />
          <Route path="/transaksi/qrcode" element={<QrCodeManager />} />
          <Route path="/laporan/donasi" element={<LaporanDonasiAdmin admin={admin} />} />
          <Route path="/penyaluran/list" element={<ListPenyaluranAdmin />} />
          <Route path="/penyaluran/penerima-manfaat" element={<PenerimaManfaatAdmin />} />
          <Route path="/manajemen-konten" element={<ManajemenKonten />} />
          <Route path="/notifikasi" element={<NotifikasiManager />} />
          <Route path="/admin/registrasi" element={guard(<RegistrasiAdmin />, ['super_admin'])} />
          <Route path="/about" element={<AboutAdmin />} />
        </Routes>
      </SidebarAdmin>
    </>
  );
}

export default RoutesAdmin;
