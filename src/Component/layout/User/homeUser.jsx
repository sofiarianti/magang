import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAPI from '../../hooks/useAPI';
import endpoints from '../../Services/endpointUser';

function Home({ user }) {
  const navigate = useNavigate();
  const donaturId = user?.id || user?.donatur?.id;
  const endpoint = donaturId
    ? endpoints.donatur.getById(donaturId)
    : endpoints.donatur.getAll;
  const { data, loading, error } = useAPI(endpoint);

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Donation target state
  const [monthlyTarget, setMonthlyTarget] = useState(() => {
    const saved = localStorage.getItem('donationMonthlyTarget');
    return saved ? parseInt(saved) : 0;
  });
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetInput, setTargetInput] = useState(monthlyTarget.toString());

  // Berita detail modal state
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [showBeritaModal, setShowBeritaModal] = useState(false);

  // Save monthly target to localStorage
  const handleSaveTarget = () => {
    const target = parseInt(targetInput) || 0;
    if (target > 0) {
      setMonthlyTarget(target);
      localStorage.setItem('donationMonthlyTarget', target.toString());
      setShowTargetModal(false);
    }
  };

  // Calculate daily target
  const dailyTarget = monthlyTarget > 0 ? Math.ceil(monthlyTarget / 30) : 0;

  const heroImages = [
    {
      src: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&h=400&fit=crop',
      alt: 'Masjid dan Ibadah',
      title: 'Tunaikan Zakat dengan Ikhlas',
      subtitle: 'Satu dashboard untuk mengelola seluruh donasi Anda'
    },
    {
      src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=400&fit=crop',
      alt: 'Berbagi dan Kepedulian',
      title: 'Dampak Zakat untuk Mustahik',
      subtitle: 'Lihat bagaimana zakat Anda membantu mereka yang membutuhkan'
    },
    {
      src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
      alt: 'Pendidikan dan Pengembangan',
      title: 'Zakat untuk Masa Depan',
      subtitle: 'Investasi dalam pendidikan dan kesejahteraan umat'
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  let currentDonatur = null;

  if (data?.donatur) {
    if (Array.isArray(data.donatur)) {
      currentDonatur =
        data.donatur.find((item) => item.id === donaturId) ||
        data.donatur[0] ||
        null;
    } else {
      currentDonatur = data.donatur;
    }
  } else if (Array.isArray(data) && user) {
    currentDonatur =
      data.find((item) => {
        if (user.email && item.email) return item.email === user.email;
        if (user.id && item.id) return item.id === user.id;
        return false;
      }) || null;
  }

  // Fetch transactions by kode_donatur (only when donatur data is loaded and we have kd_donatur)
  const transaksiEndpoint = !loading && currentDonatur?.kode_donatur
    ? endpoints.transaksi.getByKodeDonatur(currentDonatur.kode_donatur)
    : null;
  const { data: transaksiData } = useAPI(transaksiEndpoint);

  // Fetch informasi (berita)
  const { data: informasiData } = useAPI(endpoints.informasi.getAll);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const displayName =
    currentDonatur?.nama || user?.name || user?.nama || 'Sahabat Dermawan';

  const normalizeStatus = (trx) => {
   
    return (
      trx?.status || trx?.status_transaksi || trx?.statusTransaksi || 'pending'
    );
  };

  // Transform transaksi data
  const recentTransactions = React.useMemo(() => {
    if (!transaksiData) return [];
    
    const transactions = Array.isArray(transaksiData) 
      ? transaksiData 
      : transaksiData?.transaksi || [];
    
    if (transactions.length === 0) return [];
    
    const sortedTransactions = transactions.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;
      // If dates are equal, sort by id descending
      const idA = parseInt(a.id || a.kode_transaksi || 0);
      const idB = parseInt(b.id || b.kode_transaksi || 0);
      return idB - idA;
    });
    
    
    return sortedTransactions.slice(0, 3).map((trx) => {
      // Format date
      const tanggalObj = new Date(trx.created_at);
      const formattedDate = tanggalObj.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      
      // Format nominal 
      const nominalNumber = parseInt(trx.jumlah_donasi || 0);
      const formattedNominal = nominalNumber.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      
      return {
        id: trx.id || trx.kode_transaksi,
        jenis: trx.jenis_donasi || trx.jenis || 'Donasi Umum',
        tanggal: formattedDate,
        nominal: formattedNominal,
        status: (normalizeStatus(trx).toLowerCase() === 'success' || normalizeStatus(trx).toLowerCase() === 'verified' || normalizeStatus(trx).toLowerCase() === 'diverifikasi' || normalizeStatus(trx).toLowerCase() === 'berhasil') ? 'Sukses' : 'Diproses'
      };
    });
  }, [transaksiData]);

  // Calculate monthly statistics
  const monthlyStats = React.useMemo(() => {
    if (!transaksiData) return { currentMonthTransactions: 0, previousMonthTransactions: 0 };
    
    const transactions = Array.isArray(transaksiData) 
      ? transaksiData 
      : transaksiData?.transaksi || [];
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    let currentMonthCount = 0;
    let previousMonthCount = 0;
    
    transactions.forEach((trx) => {
      const trxDate = new Date(trx.created_at || trx.tanggal_transaksi || 0);
      const trxMonth = trxDate.getMonth();
      const trxYear = trxDate.getFullYear();
      
      if (trxMonth === currentMonth && trxYear === currentYear) {
        currentMonthCount++;
      } else if (trxMonth === prevMonth && trxYear === prevYear) {
        previousMonthCount++;
      }
    });
    
    return { currentMonthTransactions: currentMonthCount, previousMonthTransactions: previousMonthCount };
  }, [transaksiData]);

  // Calculate today's donation
  const todayDonation = React.useMemo(() => {
    if (!transaksiData) return 0;
    
    const transactions = Array.isArray(transaksiData) 
      ? transaksiData 
      : transaksiData?.transaksi || [];
    
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    let totalToday = 0;
    
    transactions.forEach((trx) => {
      const trxDate = new Date(trx.created_at || trx.tanggal_transaksi || 0);
      const trxDateString = trxDate.toISOString().split('T')[0];
      
      if (trxDateString === todayString) {
        totalToday += Number(trx.jumlah_donasi) || 0;
      }
    });
    
    return totalToday;
  }, [transaksiData]);

  // Calculate personal donation statistics
  const donationStats = React.useMemo(() => {
    if (!transaksiData) return { totalDonation: 0, monthlyDonation: 0, yearlyDonation: 0 };
    
    const transactions = Array.isArray(transaksiData) 
      ? transaksiData 
      : transaksiData?.transaksi || [];
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let totalDonation = 0;
    let monthlyDonation = 0;
    let yearlyDonation = 0;
    
    transactions.forEach((trx) => {
      const amount = Number(trx.jumlah_donasi) || 0;
      const trxDate = new Date(trx.created_at || trx.tanggal_transaksi || 0);
      const trxMonth = trxDate.getMonth();
      const trxYear = trxDate.getFullYear();
      
      totalDonation += amount;
      
      if (trxMonth === currentMonth && trxYear === currentYear) {
        monthlyDonation += amount;
      }
      
      if (trxYear === currentYear) {
        yearlyDonation += amount;
      }
    });
    
    return { totalDonation, monthlyDonation, yearlyDonation };
  }, [transaksiData]);

  const quickStats = [
    {
      label: 'Total Donasi Saya',
      value: donationStats.totalDonation.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }),
      change: '+12%',
      PillLabel: 'Sejak bergabung',
    },
    {
      label: 'Donasi Bulan Ini',
      value: donationStats.monthlyDonation.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }),
      change: '+8%',
      PillLabel: 'Bulan ini',
    },
    {
      label: 'Transaksi Bulan Ini',
      value: `${monthlyStats.currentMonthTransactions} transaksi`,
      change: monthlyStats.previousMonthTransactions > 0 
        ? `+${Math.round(((monthlyStats.currentMonthTransactions - monthlyStats.previousMonthTransactions) / monthlyStats.previousMonthTransactions) * 100)}%`
        : '+0%',
      PillLabel: 'Donatur aktif',
    },
  ];

  const programs = [
    {
      id: 1,
      nama: 'Beasiswa Santri Penghafal Qur’an',
      kategori: 'Pendidikan',
      progress: 72,
    },
    {
      id: 2,
      nama: 'Program Pemberdayaan UMKM Mustahik',
      kategori: 'Ekonomi',
      progress: 54,
    },
    {
      id: 3,
      nama: 'Layanan Kesehatan Dhuafa',
      kategori: 'Kesehatan',
      progress: 39,
    },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <p className="text-blue-600 text-sm md:text-base">
          Memuat data dashboard donatur...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <p className="text-red-600 text-sm md:text-base">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="w-full px-6 lg:px-16 py-8 lg:py-10 space-y-6">
        {/* Baris atas: judul + tanggal */}
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-blue-600/80">
              MPZ DT • Dashboard Donatur
            </p>
            <h1 className="text-xl md:text-2xl font-semibold text-blue-900 truncate">
              Assalamualaikum, {displayName}
            </h1>
            <p className="text-xs md:text-sm text-blue-700 truncate">
              Pantau zakat, infaq, dan sedekah Anda secara ringkas dan transparan.
            </p>
          </div>
          <div className="flex flex-row gap-3 flex-shrink-0">
            <div className="bg-white shadow-sm border border-slate-100 rounded-xl px-4 py-2 text-right flex-shrink-0">
              <p className="text-[11px] text-slate-400">Hari ini</p>
              <p className="text-xs font-medium text-slate-700">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Grid utama */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1.1fr] gap-6">
          {/* Kolom kiri */}
          <div className="space-y-4">
            {/* Kartu hero utama */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-2xl shadow-lg h-64 md:h-80">
              {/* Background Images Carousel */}
              {heroImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-amber-100/50" />
                </div>
              ))}

              {/* Content Overlay */}
              <div className="relative z-10 h-full flex items-center px-6 py-6 md:px-8 md:py-7 text-white">
                <div className="max-w-md">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-amber-300 mb-2">
                    Selamat Datang Kembali
                  </p>
                  <h2 className="text-2xl md:text-3xl font-semibold leading-snug mb-3">
                    {heroImages[currentImageIndex].title}
                  </h2>
                  <p className="text-xs md:text-sm text-amber-100 mb-4">
                    {heroImages[currentImageIndex].subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => navigate('/edukasi-zakat')}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-amber-400 text-blue-900 text-xs md:text-sm font-medium shadow-sm hover:bg-amber-400 transition"
                    >
                      Pelajari Zakat
                    </button>
                  </div>
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </section>

            {/* Kartu statistik cepat */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {quickStats.map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-blue-700">{item.label}</p>
                    <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-medium px-2 py-0.5">
                      {item.PillLabel}
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-semibold text-blue-900">
                    {item.value}
                  </p>
                  <p className="text-[11px] text-amber-600 font-medium">
                    {item.change} dari periode sebelumnya
                  </p>
                  <div className="mt-1 flex gap-1 h-8 items-end">
                    <span className="w-1.5 rounded-full bg-blue-200 h-3" />
                    <span className="w-1.5 rounded-full bg-blue-300 h-4" />
                    <span className="w-1.5 rounded-full bg-blue-400 h-5" />
                    <span className="w-1.5 rounded-full bg-amber-400 h-6" />
                    <span className="w-1.5 rounded-full bg-amber-500 h-8" />
                  </div>
                </div>
              ))}
            </section>

            {/* Riwayat transaksi */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-blue-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">
                    Riwayat Transaksi Terakhir
                  </h3>
                  <p className="text-[11px] text-blue-600">
                    Ringkasan beberapa transaksi donasi terkini Anda.
                  </p>
                </div>
                <button className="text-[11px] text-amber-600 hover:text-amber-700 font-medium">
                  Lihat semua
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {recentTransactions.map((trx) => (
                  <div
                    key={trx.id}
                    className="px-4 py-3 flex items-center justify-between text-xs md:text-sm hover:bg-slate-50/70"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-xs font-semibold text-amber-700">
                        ZK
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">
                          {trx.jenis}
                        </p>
                        <p className="text-[11px] text-blue-600">
                          {trx.tanggal}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-900">
                        {trx.nominal}
                      </p>
                      <p
                        className={`text-[11px] font-medium ${
                          trx.status === 'Sukses'
                            ? 'text-green-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {trx.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Kolom kanan */}
          <div className="space-y-4">
            {/* Kartu ringkasan donasi hari ini */}
            <section className="bg-white rounded-2xl shadow-sm border border-blue-200 px-5 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-blue-600">Ringkasan Hari Ini</p>
                  <h3 className="text-sm font-semibold text-blue-900">
                    Aktivitas Donasi Anda
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setTargetInput(monthlyTarget.toString());
                    setShowTargetModal(true);
                  }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-medium hover:bg-amber-200 transition-colors"
                >
                  {monthlyTarget > 0 ? 'Ubah Target' : 'Atur Target'}
                </button>
              </div>
              
              {monthlyTarget > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-3 text-center text-[11px]">
                    <div className="rounded-xl bg-blue-50 px-2 py-2">
                      <p className="text-blue-700 mb-1">Donasi Hari Ini</p>
                      <p className="text-sm font-semibold text-blue-900">
                        {todayDonation.toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                    <div className="rounded-xl bg-amber-50 px-2 py-2">
                      <p className="text-amber-700 mb-1">Target Harian</p>
                      <p className="text-sm font-semibold text-amber-800">
                        {dailyTarget.toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                    <div className="rounded-xl bg-blue-50 px-2 py-2">
                      <p className="text-blue-700 mb-1">Sisa Target</p>
                      <p className="text-sm font-semibold text-amber-600">
                        {Math.max(monthlyTarget - donationStats.monthlyDonation, 0).toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-1">
                    <div className="flex items-center justify-between text-[10px] text-blue-600 mb-1">
                      <span>Progress Target Bulan Ini</span>
                      <span>{Math.round(Math.min((donationStats.monthlyDonation / monthlyTarget) * 100, 100))}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-blue-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(Math.round((donationStats.monthlyDonation / monthlyTarget) * 100), 100)}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-blue-600 mb-3">Belum ada target donasi yang ditetapkan</p>
                  <button
                    onClick={() => {
                      setTargetInput('');
                      setShowTargetModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Atur Target Donasi
                  </button>
                </div>
              )}
            </section>

            {/* Program unggulan */}
            <section className="bg-white rounded-2xl shadow-sm border border-blue-200 px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-blue-900">
                  Program Zakat Unggulan
                </h3>
                <button className="text-[11px] text-amber-600 hover:text-amber-700 font-medium">
                  Lihat semua program
                </button>
              </div>
              <div className="space-y-3">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="rounded-xl border border-blue-200 px-3 py-2.5 hover:bg-blue-50/80 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-blue-900">
                          {program.nama}
                        </p>
                        <p className="text-[11px] text-blue-600">
                          {program.kategori}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-amber-600">
                        {program.progress}%
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-blue-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"
                        style={{ width: `${program.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>            </section>

            {/* Tips & Panduan */}
            <section className="bg-white rounded-2xl shadow-sm border border-blue-200 px-5 py-4 space-y-3">
              <h3 className="text-sm font-semibold text-blue-900">
                Tips Berzakat
              </h3>
              <div className="space-y-2">
                <div className="flex gap-3 p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-900">Hitung Nisab dengan Tepat</p>
                    <p className="text-[10px] text-blue-600">Pastikan harta mencapai nisab sebelum zakat</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-700">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-900">Pilih Program yang Tepat</p>
                    <p className="text-[10px] text-blue-600">Sesuaikan penggunaan zakat dengan kebutuhan</p>
                  </div>
                </div>
                <div className="flex gap-3 p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                    ✓
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-blue-900">Pantau Penyaluran</p>
                    <p className="text-[10px] text-blue-600">Ikuti dampak zakat Anda kepada muzakki</p>
                  </div>
                </div>
              </div>            </section>            
          </div>
        </div>
        {!currentDonatur && (
          <p className="text-[11px] md:text-xs text-blue-600">
            Belum ada data donatur yang terhubung dengan akun ini. Silakan
            lengkapi profil untuk pengalaman yang lebih personal.
          </p>
        )}

        {/* Section Berita Zakat */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-blue-900">
                Berita & Edukasi Zakat
              </h3>
              <p className="text-xs md:text-sm text-blue-600">
                Pelajari lebih lanjut tentang zakat dan dampak positifnya
              </p>
            </div>
          </div>

          {(() => {
            let beritaList = [];
            
            // Parse berbagai format response API
            if (Array.isArray(informasiData)) {
              beritaList = informasiData;
            } else if (informasiData?.informasi_mahasiswa && Array.isArray(informasiData.informasi_mahasiswa)) {
              beritaList = informasiData.informasi_mahasiswa;
            } else if (informasiData?.informasi && Array.isArray(informasiData.informasi)) {
              beritaList = informasiData.informasi;
            } else if (informasiData?.data && Array.isArray(informasiData.data)) {
              beritaList = informasiData.data;
            }

            if (beritaList.length === 0) {
              return (
                <div className="text-center py-12 bg-white rounded-2xl border border-blue-200">
                  <p className="text-slate-600 mb-3">Belum ada berita tersedia</p>
                  <p className="text-xs text-slate-500">Berita akan ditampilkan di sini segera</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {beritaList.slice(0, 3).map((berita, idx) => (
                  <div
                    key={berita.id_informasi_mahasiswa || berita.id || idx}
                    className="bg-white rounded-2xl shadow-md border border-blue-200 overflow-hidden hover:shadow-lg hover:border-amber-300 transition-all duration-300 group cursor-pointer"
                    onClick={() => {
                      setSelectedBerita(berita);
                      setShowBeritaModal(true);
                    }}
                  >
                    <div className="h-40 bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden relative">
                      {berita.foto ? (
                        <img
                          src={berita.foto}
                          alt={berita.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                          <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                          {berita.kategori || 'Berita'}
                        </span>
                        <span className="text-xs text-blue-600">
                          {berita.tanggal ? new Date(berita.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Terbaru'}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-blue-900 line-clamp-2">
                        {berita.judul}
                      </h4>
                      <p className="text-xs text-blue-600 line-clamp-2">
                        {berita.deskripsi || berita.isi?.substring(0, 100)}
                      </p>
                      <button 
                        className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBerita(berita);
                          setShowBeritaModal(true);
                        }}
                      >
                        Baca selengkapnya →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>

        {/* Modal Atur Target Donasi */}
        {showTargetModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Atur Target Donasi Bulanan</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Tetapkan target donasi bulanan Anda dan kami akan hitung target harian otomatis
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Target Donasi Bulanan *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-medium">Rp</span>
                    <input
                      type="number"
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      placeholder="Contoh: 1000000"
                      className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    💡 Target harian akan otomatis dihitung: {Math.ceil(parseInt(targetInput || 0) / 30).toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    })}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                  <p className="font-semibold text-blue-900 mb-1">Contoh perhitungan:</p>
                  <ul className="text-blue-700 space-y-1 list-disc list-inside">
                    <li>Target bulanan: Rp 1.000.000</li>
                    <li>Target harian: Rp 1.000.000 ÷ 30 = Rp 33.333</li>
                    <li>Progress akan ditampilkan di dashboard</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowTargetModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveTarget}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    Simpan Target
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Detail Berita */}
        {showBeritaModal && selectedBerita && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
              {/* Foto Header */}
              <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden relative">
                {selectedBerita.foto ? (
                  <img
                    src={selectedBerita.foto}
                    alt={selectedBerita.judul}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                    <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Close button */}
                <button
                  onClick={() => {
                    setShowBeritaModal(false);
                    setSelectedBerita(null);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 space-y-4">
                {/* Meta Info */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                    {selectedBerita.kategori || 'Berita'}
                  </span>
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedBerita.tanggal ? new Date(selectedBerita.tanggal).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : 'Terbaru'}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
                  {selectedBerita.judul}
                </h2>

                {/* Full Description */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedBerita.deskripsi || selectedBerita.isi || 'Konten tidak tersedia'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setShowBeritaModal(false);
                      setSelectedBerita(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;