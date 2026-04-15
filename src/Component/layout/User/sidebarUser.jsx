import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBookOpen,
  FiChevronDown,
  FiCreditCard,
  FiGrid,
  FiHelpCircle,
  FiHome,
  FiShield,
  FiUser,
} from 'react-icons/fi';

function SidebarUser({ isOpen = true, children, user }) {
  const location = useLocation();
  const isGuest = Boolean(user?.isGuest);
  const [openDropdown, setOpenDropdown] = useState(null);

  const displayName = useMemo(() => {
    if (isGuest) return 'Guest Donatur';
    return user?.donatur?.nama || user?.nama || 'Donatur';
  }, [isGuest, user]);

  const displayMeta = useMemo(() => {
    if (isGuest) return 'Akses cepat tanpa login';
    return user?.donatur?.email || user?.email || 'Akun aktif';
  }, [isGuest, user]);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const isActivePath = (paths) => paths.some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    const isDonasiPage =
      location.pathname.startsWith('/donasi/zakat') ||
      location.pathname.startsWith('/donasi/infaq-sedekah') ||
      location.pathname.startsWith('/donasi/wakaf');

    const isPengaturanPage =
      location.pathname.startsWith('/profil') ||
      location.pathname.startsWith('/about') ||
      location.pathname.startsWith('/bantuan') ||
      location.pathname.startsWith('/keamanan');

    if (isDonasiPage) {
      setOpenDropdown('donasi');
      return;
    }

    if (isPengaturanPage) {
      setOpenDropdown('pengaturan');
      return;
    }

    setOpenDropdown(null);
  }, [location.pathname]);

  const menuItems = [
    {
      to: '/',
      label: 'Home',
      icon: FiHome,
      active: location.pathname === '/',
    },
    {
      to: '/edukasi-zakat',
      label: 'Edukasi Zakat',
      icon: FiBookOpen,
      active: location.pathname.startsWith('/edukasi-zakat'),
    },
    {
      to: '/kalkulator-zakat',
      label: 'Kalkulator Zakat',
      icon: FiGrid,
      active: location.pathname.startsWith('/kalkulator-zakat'),
    },
  ];

  const donasiItems = [
    { to: '/donasi/zakat', label: 'Zakat' },
    { to: '/donasi/infaq-sedekah', label: 'Infaq / Sedekah' },
    { to: '/donasi/wakaf', label: 'Wakaf' },
  ];

  const pengaturanItems = [
    ...(!isGuest ? [{ to: '/profil', label: 'Profil Saya' }] : []),
    { to: '/about', label: 'Tentang Kami' },
    { to: '/bantuan', label: 'Pusat Bantuan' },
    { to: '/keamanan', label: 'Keamanan & Privasi' },
  ];

  const itemClass = (active) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      active
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const iconClass = (active) =>
    `flex h-9 w-9 items-center justify-center rounded-lg text-[15px] ${
      active ? 'bg-white/12 text-white' : 'bg-slate-100 text-slate-500'
    }`;

  return (
    <>
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-72 transform border-r border-slate-200 bg-white text-slate-700 shadow-sm transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <FiUser className="text-base" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="truncate text-xs text-slate-500">{displayMeta}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-5">
            <div className="space-y-6">
              <section className="space-y-2">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Menu Utama
                </p>
                <div className="space-y-1.5">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.to} to={item.to} className={itemClass(item.active)}>
                        <span className={iconClass(item.active)}>
                          <Icon />
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-2">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Donasi
                </p>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('donasi')}
                    className={`${itemClass(isActivePath(['/donasi/zakat', '/donasi/infaq-sedekah', '/donasi/wakaf']))} w-full justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={iconClass(isActivePath(['/donasi/zakat', '/donasi/infaq-sedekah', '/donasi/wakaf']))}>
                        <FiCreditCard />
                      </span>
                      <span>Program Donasi</span>
                    </div>
                    <FiChevronDown
                      className={`text-sm transition-transform ${
                        openDropdown === 'donasi' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openDropdown === 'donasi' && (
                    <div className="ml-4 border-l border-slate-200 pl-4">
                      <div className="space-y-1">
                        {donasiItems.map((item) => {
                          const active = location.pathname.startsWith(item.to);
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                                active
                                  ? 'bg-slate-100 font-medium text-slate-900'
                                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {!isGuest && (
                    <Link
                      to="/transaksi/riwayat"
                      className={itemClass(location.pathname.startsWith('/transaksi/riwayat'))}
                    >
                      <span className={iconClass(location.pathname.startsWith('/transaksi/riwayat'))}>
                        <FiCreditCard />
                      </span>
                      <span>Riwayat Transaksi</span>
                    </Link>
                  )}
                </div>
              </section>

              <section className="space-y-2">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Pengaturan
                </p>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('pengaturan')}
                    className={`${itemClass(isActivePath(['/profil', '/about', '/bantuan', '/keamanan']))} w-full justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={iconClass(isActivePath(['/profil', '/about', '/bantuan', '/keamanan']))}>
                        {isGuest ? <FiHelpCircle /> : <FiShield />}
                      </span>
                      <span>Pengaturan</span>
                    </div>
                    <FiChevronDown
                      className={`text-sm transition-transform ${
                        openDropdown === 'pengaturan' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openDropdown === 'pengaturan' && (
                    <div className="ml-4 border-l border-slate-200 pl-4">
                      <div className="space-y-1">
                        {pengaturanItems.map((item) => {
                          const active = location.pathname.startsWith(item.to);
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                                active
                                  ? 'bg-slate-100 font-medium text-slate-900'
                                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </nav>
        </div>
      </aside>

      <div
        className={`min-h-screen bg-slate-50 pt-16 transition-all duration-300 ${
          isOpen ? 'pl-72' : 'pl-4'
        }`}
      >
        {children}
      </div>
    </>
  );
}

export default SidebarUser;
