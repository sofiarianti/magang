import React, { useState } from 'react';
import { FiHelpCircle, FiChevronDown, FiChevronUp, FiPhone, FiMail, FiMapPin, FiClock, FiSearch } from 'react-icons/fi';

function HelpCenter() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const faqs = [
    {
      id: 1,
      pertanyaan: 'Bagaimana cara mendaftar dan mulai berdonasi?',
      jawaban: 'Klik tombol "Register" di halaman login, isi data diri dengan lengkap, lalu submit. Setelah akun aktif, Anda dapat langsung memilih jenis donasi dan mengikuti instruksi pembayaran yang tersedia.'
    },
    {
      id: 2,
      pertanyaan: 'Apakah data saya aman di aplikasi ini?',
      jawaban: 'Ya. Data pribadi dan transaksi Anda disimpan dengan protokol keamanan standar, dan hanya digunakan untuk keperluan donasi, laporan, dan komunikasi terkait akun Anda.'
    },
    {
      id: 3,
      pertanyaan: 'Bagaimana cara melakukan donasi melalui aplikasi?',
      jawaban: 'Login lalu pilih menu "Donasi". Pilih program, masukkan nominal, lalu ikuti panduan pembayaran. Setelah selesai, sistem akan menampilkan bukti donasi dan mengirimkan notifikasi.'
    },
    {
      id: 4,
      pertanyaan: 'Bagaimana saya melihat riwayat donasi dan status transaksi?',
      jawaban: 'Buka menu "Riwayat Transaksi" atau "Transaksi". Anda akan melihat daftar donasi, tanggal, jumlah, jenis donasi, dan status pembayaran lengkap.'
    },
    {
      id: 5,
      pertanyaan: 'Apakah ada biaya admin atau biaya tersembunyi?',
      jawaban: 'Semua biaya ditampilkan secara transparan sebelum Anda menyelesaikan pembayaran. Tidak ada biaya tersembunyi selain yang sudah diinformasikan di halaman konfirmasi.'
    },
    {
      id: 6,
      pertanyaan: 'Bagaimana cara mengganti password?',
      jawaban: 'Buka halaman "Profil Saya" dan pilih opsi ubah password. Masukkan password lama dan buat password baru tanpa perlu verifikasi email tambahan.'
    },
    {
      id: 7,
      pertanyaan: 'Bagaimana cara memperbarui informasi profil saya?',
      jawaban: 'Masuk ke "Profil Saya" lalu klik "Edit Profil". Anda bisa memperbarui nama, alamat, nomor telepon, dan data penting lain; lalu simpan perubahan.'
    },
    {
      id: 8,
      pertanyaan: 'Berapa lama proses donasi sampai terkonfirmasi?',
      jawaban: 'Donasi biasanya diproses dalam 1-3 hari kerja. Setelah dikonfirmasi, Anda akan menerima notifikasi dan bukti transaksi dari sistem.'
    }
  ];

  const contactInfo = [
    {
      icon: FiPhone,
      label: 'WhatsApp / Telepon',
      value: '0823 1900 0200',
      detail: 'Senin - Sabtu: 08:00 - 18:00 WIB'
    },
    {
      icon: FiMail,
      label: 'Email Support',
      value: 'support@dtpeduli.org',
      detail: 'Respon dalam 24 jam kerja'
    },
    {
      icon: FiMapPin,
      label: 'Kantor Pusat',
      value: 'Jl. Gegerkalong Girang No.32, Isola, Kec. Sukasari, Kota Bandung, Jawa Barat 40153',
      
    },
    {
      icon: FiClock,
      label: 'Jam Operasional',
      value: 'Senin - Sabtu',
      detail: '08:00 - 18:00 WIB'
    }
  ];

  // Filter FAQs berdasarkan search query
  const filteredFaqs = faqs.filter(faq =>
    faq.pertanyaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.jawaban.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        {/* Hero Header */}
<div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FiHelpCircle className="text-white text-2xl" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest opacity-80">Bantuan & Dukungan</p>
                  <h1 className="text-3xl md:text-4xl font-bold">Pusat Bantuan</h1>
                </div>
              </div>
              <p className="text-blue-100 text-lg mt-2 max-w-3xl">
                Dapatkan bantuan untuk donasi, profil, pembayaran, dan keamanan akun dalam satu tempat. Tim DT Peduli siap mendukung Anda.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-3 text-blue-400" size={20} />
            <input
              type="text"
              placeholder="Cari pertanyaan atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-700"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* FAQ Header */}
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Pertanyaan yang Sering Diajukan</h2>
              <p className="text-slate-600">Temukan jawaban cepat untuk pertanyaan umum Anda</p>
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-blue-100 p-8 text-center">
                  <p className="text-slate-600 text-sm">Tidak ada pertanyaan yang cocok dengan pencarian Anda.</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border-2 border-blue-100 overflow-hidden hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50 transition-colors"
                    >
                      <p className="text-sm font-semibold text-blue-900 text-left">{faq.pertanyaan}</p>
                      {expandedFaq === faq.id ? (
                        <FiChevronUp className="text-blue-600 flex-shrink-0" size={20} />
                      ) : (
                        <FiChevronDown className="text-slate-400 flex-shrink-0" size={20} />
                      )}
                    </button>

                    {expandedFaq === faq.id && (
                      <div className="px-6 py-4 bg-blue-50 border-t-2 border-blue-100">
                        <p className="text-sm text-slate-700 leading-relaxed">{faq.jawaban}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact & Chat Section */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-blue-900">Hubungi Kami Langsung</h3>
              <p className="text-sm text-slate-600">Hubungi tim support kami melalui berbagai saluran</p>
            </div>

            {contactInfo.map((contact, idx) => {
              const Icon = contact.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl border-2 border-blue-100 p-5 hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{contact.label}</p>
                      <p className="text-blue-700 font-medium text-sm mt-1">{contact.value}</p>
                      <p className="text-slate-500 text-xs mt-1">{contact.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-3xl shadow-xl p-8 md:p-10 text-white">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold mb-3">Belum Menemukan Jawaban?</h3>
            <p className="text-blue-100 mb-6 text-sm">
              Tim dukungan pelanggan kami yang tersedia 24/7 siap membantu Anda. Hubungi kami melalui salah satu saluran di bawah ini untuk bantuan lebih lanjut.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/15 backdrop-blur border border-white/25 rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-blue-100">Email</p>
                <p className="text-base font-medium">support@dtpeduli.org</p>
              </div>
              <div className="bg-white/15 backdrop-blur border border-white/25 rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-blue-100">WhatsApp</p>
                <p className="text-base font-medium">0823 1900 0200</p>
              </div>
              <div className="bg-white/15 backdrop-blur border border-white/25 rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-blue-100">Telepon</p>
                <p className="text-base font-medium">(021) 1234-5678</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;
