import React, { useState } from 'react';
import { FiHelpCircle, FiChevronDown, FiChevronUp, FiMessageCircle, FiPhone, FiMail, FiMapPin, FiClock, FiSearch } from 'react-icons/fi';

function HelpCenter() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'admin', text: 'Selamat datang. Bagaimana kami dapat membantu Anda hari ini?' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMsg = { id: messages.length + 1, type: 'user', text: newMessage };
      setMessages([...messages, userMsg]);
      setNewMessage('');

      // Simulasi respon admin
      setTimeout(() => {
        const adminMsg = {
          id: messages.length + 2,
          type: 'admin',
          text: 'Terima kasih atas pertanyaan Anda. Tim kami akan merespons dalam waktu singkat.'
        };
        setMessages(prev => [...prev, adminMsg]);
      }, 1000);
    }
  };

  const faqs = [
    {
      id: 1,
      pertanyaan: 'Bagaimana cara mendaftar di aplikasi ini?',
      jawaban: 'Untuk mendaftar, klik tombol "Register" di halaman login. Isi data diri Anda dengan lengkap dan benar, kemudian klik "Daftar". Anda akan menerima email konfirmasi untuk memverifikasi akun Anda.'
    },
    {
      id: 2,
      pertanyaan: 'Apakah aman memberikan data personal di sini?',
      jawaban: 'Ya, sangat aman. Kami menggunakan enkripsi tingkat tinggi dan mematuhi standar keamanan internasional. Semua data Anda dilindungi dengan teknologi terkini. Untuk detail lebih lanjut, kunjungi halaman Keamanan & Kebijakan Privasi kami.'
    },
    {
      id: 3,
      pertanyaan: 'Bagaimana cara melakukan donasi?',
      jawaban: 'Setelah login, pilih menu "Donasi" dari sidebar. Pilih jenis donasi yang ingin Anda berikan (Donasi Umum, Zakat, Infak, dll). Masukkan jumlah dan keterangan, kemudian proses pembayaran sesuai instruksi. Anda akan menerima konfirmasi donasi via email.'
    },
    {
      id: 4,
      pertanyaan: 'Bagaimana cara melihat riwayat donasi saya?',
      jawaban: 'Klik "Riwayat Transaksi" di menu Transaksi untuk melihat semua donasi Anda. Anda dapat melihat tanggal, jumlah, jenis donasi, dan status pembayaran untuk setiap transaksi.'
    },
    {
      id: 5,
      pertanyaan: 'Apakah ada biaya admin atau biaya tersembunyi?',
      jawaban: 'Tidak ada biaya tersembunyi. Semua biaya (jika ada) akan ditampilkan dengan jelas sebelum Anda menyelesaikan transaksi. Anda dapat melihat rincian total pembayaran sebelum konfirmasi akhir.'
    },
    {
      id: 6,
      pertanyaan: 'Bagaimana jika saya lupa password?',
      jawaban: 'Klik "Lupa Password?" di halaman login. Masukkan email Anda dan klik "Reset". Anda akan menerima link reset password ke email Anda. Klik link tersebut dan buat password baru untuk akun Anda.'
    },
    {
      id: 7,
      pertanyaan: 'Bagaimana cara mengubah data profil saya?',
      jawaban: 'Masuk ke menu "Profil Saya" → klik "Edit Profil". Di halaman ini, Anda dapat mengubah informasi pribadi, nomor telepon, dan alamat. Jangan lupa klik "Simpan" untuk menyimpan perubahan.'
    },
    {
      id: 8,
      pertanyaan: 'Berapa lama waktu pemrosesan donasi?',
      jawaban: 'Donasi online biasanya diproses dalam 1-3 hari kerja. Anda akan menerima notifikasi ketika donasi telah diterima dan diproses. Untuk donasi dengan nominal besar, mungkin memerlukan verifikasi tambahan.'
    }
  ];

  const contactInfo = [
    {
      icon: FiPhone,
      label: 'Telepon',
      value: '(021) 1234-5678',
      detail: 'Senin - Jumat: 08:00 - 17:00 WIB'
    },
    {
      icon: FiMail,
      label: 'Email',
      value: 'support@mpzdt.org',
      detail: 'Respon dalam 24 jam kerja'
    },
    {
      icon: FiMapPin,
      label: 'Kantor',
      value: 'Jl. Dakwah No. 123, Jakarta',
      detail: 'Kunjungan dengan janji temu'
    },
    {
      icon: FiClock,
      label: 'Jam Operasional',
      value: 'Senin - Jumat',
      detail: '08:00 - 17:00 WIB'
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
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiHelpCircle className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest opacity-80">Dukungan Pelanggan</p>
                <h1 className="text-3xl md:text-4xl font-bold">Pusat Bantuan</h1>
              </div>
            </div>
            <p className="text-blue-100 text-lg mt-2 max-w-2xl">
              Temukan jawaban atas pertanyaan Anda dan dapatkan dukungan dari tim kami yang berpengalaman.
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

            {/* Quick Chat */}
            <div className="bg-white rounded-2xl border-2 border-blue-100 overflow-hidden flex flex-col h-96 shadow-sm">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FiMessageCircle size={18} />
                  Chat Support
                </h2>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-200 text-slate-900 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="border-t-2 border-blue-100 p-4 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    Kirim
                  </button>
                </div>
              </div>
            </div>
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
                <p className="text-base font-medium">support@mpzdt.org</p>
              </div>
              <div className="bg-white/15 backdrop-blur border border-white/25 rounded-2xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-blue-100">WhatsApp</p>
                <p className="text-base font-medium">+62 812-3456-7890</p>
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
