import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiCreditCard,FiSettings } from 'react-icons/fi';

function SidebarUser({ isOpen = true, children }) {
  const location = useLocation();
  
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const isActivePath = (paths) =>
    paths.some((p) => location.pathname.startsWith(p));

  const baseItemClasses =
    'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors';

  const iconClasses =
    'flex items-center justify-center w-7 h-7 rounded-full text-[13px]';

  return (
    <>
      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-slate-100 text-slate-700 shadow-sm z-30 transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="mt-4 px-3 space-y-3 text-sm">
          <div className="space-y-1">
            <Link
              to="/"
              className={`${baseItemClasses} ${
                location.pathname === '/'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span
                className={`${iconClasses} ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <FiHome />
              </span>
              <span className="truncate">Home</span>
            </Link>
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <div>
              <button
                type="button"
                onClick={() => toggleDropdown('transaksi')}
                className={`${baseItemClasses} w-full justify-between ${
                  isActivePath(['/informasi', '/about'])
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`${iconClasses} ${
                      isActivePath(['/informasi', '/about'])
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <FiCreditCard />
                  </span>
                  <span>Transaksi</span>
                </div>
                <span className="text-[10px]">
                  {openDropdown === 'transaksi' ? '▾' : '▸'}
                </span>
              </button>
              {openDropdown === 'transaksi' && (
                <div className="mt-1 ml-9 space-y-1">
                   <Link
                    to="/donasi"
                    className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                      location.pathname.startsWith('/donasi')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Donasi
                  </Link>
                  <Link
                    to="/transaksi/riwayat"
                    className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                      location.pathname.startsWith('/transaksi/riwayat')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Riwayat Transaksi
                  </Link>
                  <Link
                    to="/edukasi-zakat"
                    className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                      location.pathname.startsWith('/edukasi-zakat')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Edukasi Zakat
                  </Link>
                  <Link
                    to="/kalkulator-zakat"
                    className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                      location.pathname.startsWith('/kalkulator-zakat')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Kalkulator Zakat
                  </Link>
                </div>
              )}
            </div>
            {/* Pengaturan dropdown */}
            <div>
              <button
                type="button"
                onClick={() => toggleDropdown('pengaturan')}
                className={`${baseItemClasses} w-full justify-between ${
                  isActivePath(['/informasi', '/about'])
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`${iconClasses} ${
                      isActivePath(['/informasi', '/about'])
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <FiSettings />
                  </span>
                  <span>Pengaturan</span>
                </div>
                <span className="text-[10px]">
                  {openDropdown === 'pengaturan' ? '▾' : '▸'}
                </span>
              </button>
              {openDropdown === 'pengaturan' && (
                <div className="mt-1 ml-9 space-y-1">
                   <Link
                    to="/profil"
                    className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                      location.pathname.startsWith('/profil')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Profil Saya
                  </Link>
                  <Link
                    to="/about"
                    className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                      location.pathname.startsWith('/about')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Tentang kami            
                  </Link>
                  <Link
                    to="/bantuan"
                    className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                      location.pathname.startsWith('/bantuan')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Pusat Bantuan
                  </Link>
                  <Link
                    to="/keamanan"
                    className={`block px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                      location.pathname.startsWith('/keamanan')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    Keamanan & Privasi
                  </Link>
                </div>
              )}
            </div>
          </div>
          </div>
        </nav>
      </aside>

      <div
        className={`pt-16 min-h-screen bg-slate-50 transition-all duration-200 ${
          isOpen ? 'pl-64' : 'pl-4'
        }`}
      >
        {children}
      </div>
    </>
  );
}

export default SidebarUser;

