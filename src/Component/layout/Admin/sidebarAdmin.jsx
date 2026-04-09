import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiInfo,
  FiUsers,
} from 'react-icons/fi';

function SidebarAdmin({ isOpen = true, children }) {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const isActivePath = useCallback(
    (paths) => paths.some((path) => location.pathname.startsWith(path)),
    [location.pathname]
  );

  useEffect(() => {
    if (location.pathname === '/') {
      setOpenDropdown(null);
      return;
    }

    if (isActivePath(['/list/donatur', '/donatur/koordinator'])) {
      setOpenDropdown('donatur');
      return;
    }

    if (isActivePath(['/laporan/donasi', '/transaksi/qrcode'])) {
      setOpenDropdown('transaksi');
      return;
    }

    if (isActivePath(['/penyaluran/list', '/penyaluran/penerima-manfaat'])) {
      setOpenDropdown('penyaluran');
      return;
    }

    if (isActivePath(['/laporan/donasi', '/laporan/penyaluran', '/laporan/transaksi'])) {
      setOpenDropdown('laporan');
      return;
    }

    setOpenDropdown(null);
  }, [location.pathname, isActivePath]);

  const baseItemClasses =
    'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors';

  const iconClasses =
    'flex items-center justify-center w-7 h-7 rounded-full text-[13px]';

  return (
    <>
      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-slate-200 text-slate-700 shadow-sm z-30 transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-slate-200 px-4 py-4">
          <div className="rounded-2xl bg-[linear-gradient(135deg,_#0f172a_0%,_#1e3a8a_100%)] px-4 py-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200">
              Admin Panel
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              Navigasi dashboard admin yang ringkas dan rapi.
            </p>
          </div>
        </div>

        <nav className="mt-4 px-3 space-y-3 text-sm">
          <div className="space-y-1">
            <Link
              to="/"
              className={`${baseItemClasses} ${
                location.pathname === '/'
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span
                className={`${iconClasses} ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <FiGrid />
              </span>
              <span className="truncate">Dashboard</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div>
              <button
                type="button"
                onClick={() => toggleDropdown('donatur')}
                className={`${baseItemClasses} w-full justify-between ${
                  isActivePath(['/list/donatur', '/donatur/koordinator'])
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`${iconClasses} ${
                      isActivePath(['/list/donatur', '/donatur/koordinator'])
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <FiUsers />
                  </span>
                  <span>Donatur</span>
                </div>
                <span className="text-[10px]">{openDropdown === 'donatur' ? '▾' : '▸'}</span>
              </button>
              {openDropdown === 'donatur' && (
                <div className="mt-1 ml-9 space-y-1">
                  <Link to="/list/donatur" className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${location.pathname.startsWith('/list/donatur') ? 'bg-blue-50 text-blue-900' : 'text-slate-500 hover:bg-slate-50'}`}>List Donatur</Link>
                  <Link to="/donatur/koordinator" className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${location.pathname.startsWith('/donatur/koordinator') ? 'bg-blue-50 text-blue-900' : 'text-slate-500 hover:bg-slate-50'}`}>Koordinator</Link>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleDropdown('transaksi')}
                className={`${baseItemClasses} w-full justify-between ${
                  isActivePath(['/laporan/donasi', '/transaksi/qrcode'])
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`${iconClasses} ${
                      isActivePath(['/laporan/donasi', '/transaksi/qrcode'])
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <FiCreditCard />
                  </span>
                  <span>Transaksi</span>
                </div>
                <span className="text-[10px]">{openDropdown === 'transaksi' ? '▾' : '▸'}</span>
              </button>
              {openDropdown === 'transaksi' && (
                <div className="mt-1 ml-9 space-y-1">
                  <Link to="/laporan/donasi" className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${location.pathname.startsWith('/laporan/donasi') ? 'bg-blue-50 text-blue-900' : 'text-slate-500 hover:bg-slate-50'}`}>Laporan Donasi</Link>
                  <Link to="/transaksi/qrcode" className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${location.pathname.startsWith('/transaksi/qrcode') ? 'bg-blue-50 text-blue-900' : 'text-slate-500 hover:bg-slate-50'}`}>QR Code</Link>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleDropdown('penyaluran')}
                className={`${baseItemClasses} w-full justify-between ${
                  isActivePath(['/penyaluran/list', '/penyaluran/penerima-manfaat'])
                    ? 'bg-blue-50 text-blue-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`${iconClasses} ${
                      isActivePath(['/penyaluran/list', '/penyaluran/penerima-manfaat'])
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <FiInfo />
                  </span>
                  <span>Penyaluran</span>
                </div>
                <span className="text-[10px]">{openDropdown === 'penyaluran' ? '▾' : '▸'}</span>
              </button>
              {openDropdown === 'penyaluran' && (
                <div className="mt-1 ml-9 space-y-1">
                  <Link to="/penyaluran/list" className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${location.pathname.startsWith('/penyaluran/list') ? 'bg-blue-50 text-blue-900' : 'text-slate-500 hover:bg-slate-50'}`}>List Penyaluran</Link>
                  <Link to="/penyaluran/penerima-manfaat" className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${location.pathname.startsWith('/penyaluran/penerima-manfaat') ? 'bg-blue-50 text-blue-900' : 'text-slate-500 hover:bg-slate-50'}`}>Penerima Manfaat</Link>
                </div>
              )}
            </div>
            <Link to="/manajemen-konten" className={`${baseItemClasses} ${location.pathname.startsWith('/manajemen-konten') ? 'bg-blue-50 text-blue-900' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span className={`${iconClasses} ${location.pathname.startsWith('/manajemen-konten') ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-500'}`}>
                <FiFileText />
              </span>
              <span className="truncate">Manajemen Konten</span>
            </Link>
          </div>
        </nav>
      </aside>

      <div
        className={`pt-16 min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] transition-all duration-200 ${
          isOpen ? 'pl-64' : 'pl-4'
        }`}
      >
        {children}
      </div>
    </>
  );
}

export default SidebarAdmin;
