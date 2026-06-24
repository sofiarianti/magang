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
    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
      active
        ? 'bg-blue-900 text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const iconClass = (active) =>
    `flex h-8 w-8 items-center justify-center rounded-lg text-[15px] transition-colors ${
      active
        ? 'bg-white/20 text-white'
        : 'text-slate-500 group-hover:text-slate-700'
    }`;

  const submenuClass = (active) =>
    `block rounded-lg px-3 py-2 text-sm transition-colors ${
      active
        ? 'bg-slate-100 font-semibold text-slate-900'
        : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    <>
      <aside
        className={`fixed top-16 bottom-0 left-0 z-30 w-72 transform border-r border-slate-200 bg-white text-slate-700 shadow-sm transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-white">
                <FiUser className="text-sm" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="truncate text-xs text-slate-500">{displayMeta}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-3">
            <div className="space-y-3">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} className={itemClass(item.active)}>
                      <span className={iconClass(item.active)}>
                        <Icon />
                      </span>
                      <p className="truncate">{item.label}</p>
                    </Link>
                  );
                })}
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleDropdown('donasi')}
                  className={`${itemClass(isActivePath(['/donasi/zakat', '/donasi/infaq-sedekah', '/donasi/wakaf']))} w-full justify-between`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={iconClass(isActivePath(['/donasi/zakat', '/donasi/infaq-sedekah', '/donasi/wakaf']))}>
                      <FiCreditCard />
                    </span>
                    <p className="truncate">Program Donasi</p>
                  </div>
                  <FiChevronDown
                    className={`text-sm flex-shrink-0 transition-transform ${
                      openDropdown === 'donasi' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openDropdown === 'donasi' && (
                  <div className="ml-8 space-y-1">
                    {donasiItems.map((item) => {
                      const active = location.pathname.startsWith(item.to);
                      return (
                        <Link key={item.to} to={item.to} className={submenuClass(active)}>
                          {item.label}
                        </Link>
                      );
                    })}
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
                    <p className="truncate">Riwayat Transaksi</p>
                  </Link>
                )}
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleDropdown('pengaturan')}
                  className={`${itemClass(isActivePath(['/profil', '/about', '/bantuan', '/keamanan']))} w-full justify-between`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={iconClass(isActivePath(['/profil', '/about', '/bantuan', '/keamanan']))}>
                      {isGuest ? <FiHelpCircle /> : <FiShield />}
                    </span>
                    <p className="truncate">Pengaturan</p>
                  </div>
                  <FiChevronDown
                    className={`text-sm flex-shrink-0 transition-transform ${
                      openDropdown === 'pengaturan' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openDropdown === 'pengaturan' && (
                  <div className="ml-8 space-y-1">
                    {pengaturanItems.map((item) => {
                      const active = location.pathname.startsWith(item.to);
                      return (
                        <Link key={item.to} to={item.to} className={submenuClass(active)}>
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
