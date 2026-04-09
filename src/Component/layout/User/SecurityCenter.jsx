import React, { useState } from 'react';
import { FiShield, FiChevronDown, FiCheck, FiLock, FiAlertCircle } from 'react-icons/fi';

function SecurityCenter() {
  const [expandedSection, setExpandedSection] = useState('lembaga');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'lembaga',
      title: '🏢 Informasi Lembaga Resmi',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
            <h4 className="font-bold text-blue-900 mb-3">Data Lembaga</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div>
                <strong className="text-blue-900">Nama Lembaga:</strong>
                <p>Masjid Pusat Zakat Donatur (MPZDT)</p>
              </div>
              <div>
                <strong className="text-blue-900">Nomor Izin Operasional:</strong>
                <p>SK. Kemenag No. 123/2020</p>
              </div>
              <div>
                <strong className="text-blue-900">NPWP:</strong>
                <p>12.345.678.9-123.000</p>
              </div>
              <div>
                <strong className="text-blue-900">Nomor Rekening Resmi:</strong>
                <p>1234567890 (BNI Syariah)</p>
              </div>
              <div>
                <strong className="text-blue-900">Alamat Kantor:</strong>
                <p>Jl. Dakwah No. 123, Jakarta 12345, Indonesia</p>
              </div>
              <div>
                <strong className="text-blue-900">Telepon:</strong>
                <p>(021) 1234-5678</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
            <h4 className="font-bold text-blue-900 mb-3">Kredibilitas & Sertifikasi</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <FiCheck className="text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Terakreditasi A</strong> - Kementerian Agama Republik Indonesia</span>
              </li>
              <li className="flex gap-2">
                <FiCheck className="text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Tersertifikasi ISO 9001:2015</strong> - Standar Manajemen Kualitas</span>
              </li>
              <li className="flex gap-2">
                <FiCheck className="text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Anggota BAZNAS</strong> - Badan Amil Zakat Nasional</span>
              </li>
              <li className="flex gap-2">
                <FiCheck className="text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Laporan Keuangan Transparan</strong> - Audit eksternal setiap tahun</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
            <h4 className="font-bold text-amber-900 mb-3">Visi & Misi</h4>
            <div className="space-y-3 text-sm text-amber-800">
              <div>
                <strong className="text-amber-900">Visi:</strong>
                <p className="mt-1">Menjadi lembaga zakat terpercaya yang memberdayakan umat dan memberantas kemiskinan dengan mengedepankan transparansi dan profesionalisme.</p>
              </div>
              <div>
                <strong className="text-amber-900">Misi:</strong>
                <ul className="mt-1 space-y-1 ml-4">
                  <li>1. Mengumpulkan zakat dengan integritas tinggi dari masyarakat Muslim</li>
                  <li>2. Mendistribusikan zakat kepada asnaf yang berhak bersdasarkan syariat Islam</li>
                  <li>3. Mendampingi mustahik menuju kemandirian ekonomi</li>
                  <li>4. Mengelola zakat dengan transparan dan profesional</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'privasi',
      title: '🔐 Kebijakan Privasi',
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            Kami berkomitmen untuk melindungi privasi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, 
            menggunakan, dan melindungi informasi pribadi Anda.
          </p>

          <div className="space-y-3">
            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">1. Informasi yang Kami Kumpulkan</h4>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Nama lengkap, alamat email, dan nomor telepon</li>
                <li>• Alamat fisik dan data demografis</li>
                <li>• Riwayat transaksi dan aktivitas di aplikasi</li>
                <li>• Informasi pembayaran (dienkripsi dan aman)</li>
                <li>• Cookies dan data log akses</li>
              </ul>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">2. Penggunaan Informasi</h4>
              <p className="text-sm text-slate-700 mb-2">Kami menggunakan informasi Anda untuk:</p>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Memproses donasi dan transaksi Anda</li>
                <li>• Mengirimkan notifikasi dan laporan donasi</li>
                <li>• Meningkatkan layanan dan pengalaman pengguna</li>
                <li>• Memenuhi kewajiban hukum dan peraturan</li>
                <li>• Komunikasi tentang pembaruan dan penawaran khusus</li>
              </ul>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">3. Perlindungan Data</h4>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Enkripsi SSL/TLS untuk semua transmisi data</li>
                <li>• Firewall dan sistem keamanan berlapis</li>
                <li>• Akses terbatas hanya untuk pegawai yang berwenang</li>
                <li>• Audit keamanan rutin oleh pihak ketiga independen</li>
                <li>• Backup data berkala untuk mencegah kehilangan data</li>
              </ul>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">4. Berbagi Data dengan Pihak Ketiga</h4>
              <p className="text-sm text-slate-700 mb-2">Kami TIDAK akan membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali:</p>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Diwajibkan oleh hukum atau otoritas pemerintah</li>
                <li>• Mitra pembayaran untuk memproses transaksi (dienkripsi)</li>
                <li>• Layanan cloud untuk backup dan keamanan data</li>
              </ul>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">5. Hak-Hak Anda</h4>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Mengakses dan melihat data pribadi Anda</li>
                <li>• Meminta koreksi atau penghapusan data</li>
                <li>• Membatalkan langganan komunikasi marketing</li>
                <li>• Mengajukan keluhan kepada otoritas perlindungan data</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
            <p className="text-sm text-amber-800">
              <strong>Pembaruan Kebijakan:</strong> Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. 
              Perubahan material akan diberitahukan melalui email atau notifikasi di aplikasi.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'syarat',
      title: '📋 Syarat & Ketentuan',
      content: (
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            Dengan menggunakan aplikasi MPZDT, Anda setuju untuk mematuhi syarat dan ketentuan berikut:
          </p>

          <div className="space-y-3">
            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">1. Penggunaan Aplikasi</h4>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Anda harus berusia minimal 18 tahun untuk menggunakan aplikasi ini</li>
                <li>• Akun Anda adalah pribadi dan tidak dapat dipindahkan ke orang lain</li>
                <li>• Anda bertanggung jawab atas semua aktivitas dalam akun Anda</li>
                <li>• Dilarang menggunakan aplikasi untuk tujuan ilegal atau merugikan</li>
              </ul>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">2. Donasi & Pembayaran</h4>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Semua donasi bersifat sukarela dan tidak dapat dikembalikan</li>
                <li>• Anda bertanggung jawab atas keakuratan informasi pembayaran</li>
                <li>• Kami menerima berbagai metode pembayaran yang ditampilkan di aplikasi</li>
                <li>• Biaya admin (jika ada) akan ditampilkan sebelum Anda mengkonfirmasi pembayaran</li>
              </ul>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">3. Transparansi & Laporan</h4>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Kami menyediakan laporan penggunaan zakat secara berkala</li>
                <li>• Laporan keuangan audit tersedia untuk publik</li>
                <li>• Anda dapat meminta informasi detail tentang penyaluran zakat Anda</li>
                <li>• Informasi donator dijaga kerahasiaannya sesuai kebijakan privasi</li>
              </ul>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">4. Tanggung Jawab Kami</h4>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Kami berusaha menjaga aplikasi tetap aman dan fungsional</li>
                <li>• Kami tidak bertanggung jawab atas gangguan teknis di luar kontrol kami</li>
                <li>• Kami tidak bertanggung jawab atas kehilangan data karena kelalaian pengguna</li>
                <li>• Kami berhak menutup akun yang melanggar syarat dan ketentuan</li>
              </ul>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">5. Pembatasan Tanggung Jawab</h4>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Aplikasi disediakan "sebagaimana adanya" tanpa garansi</li>
                <li>• Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan aplikasi</li>
                <li>• Tanggung jawab kami terbatas pada jumlah donasi terakhir Anda</li>
                <li>• Kami tidak bertanggung jawab atas masalah dengan bank atau payment gateway</li>
              </ul>
            </div>

            <div className="bg-white border-l-4 border-blue-600 p-5 rounded-2xl shadow-sm">
              <h4 className="font-bold text-slate-900 mb-2">6. Modifikasi & Penghapusan Akun</h4>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Kami berhak memodifikasi fitur aplikasi kapan saja</li>
                <li>• Anda dapat menghapus akun Anda melalui pengaturan profil</li>
                <li>• Data donasi akan tetap disimpan untuk audit dan keperluan hukum</li>
                <li>• Penghapusan akun bersifat permanen dan tidak dapat dibatalkan</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Versi Terbaru:</strong> Syarat dan ketentuan terakhir diperbarui pada Maret 2026. 
              Dengan terus menggunakan aplikasi, Anda setuju dengan versi terbaru.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'password',
      title: '🔒 Keamanan Password & Akun',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
            <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
              <FiAlertCircle size={18} />
              Tips Keamanan Password yang Kuat
            </h4>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex gap-2">
                <span className="font-bold text-red-600">✓</span>
                <span><strong>Minimal 12 karakter</strong> - Semakin panjang semakin aman</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-red-600">✓</span>
                <span><strong>Campur huruf, angka, dan simbol</strong> - Contoh: P@$$w0rd2024!</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-red-600">✓</span>
                <span><strong>Hindari informasi pribadi</strong> - Jangan gunakan nama atau tanggal lahir</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-red-600">✓</span>
                <span><strong>Jangan gunakan password yang sama</strong> - Gunakan password unik untuk setiap akun</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-red-600">✓</span>
                <span><strong>Ubah password secara berkala</strong> - Minimal 3 bulan sekali</span>
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5">
            <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
              <FiLock size={18} />
              Cara Mengubah Password
            </h4>
            <ol className="space-y-2 text-sm text-green-800">
              <li>1. Buka menu <strong>"Profil Saya"</strong> dari sidebar</li>
              <li>2. Klik <strong>"Pengaturan"</strong> atau <strong>"Password & Keamanan"</strong></li>
              <li>3. Masukkan <strong>password lama Anda</strong> untuk verifikasi</li>
              <li>4. Buat <strong>password baru</strong> yang kuat</li>
              <li>5. Konfirmasi password baru dengan mengetiknya kembali</li>
              <li>6. Klik <strong>"Ubah Password"</strong> dan tunggu konfirmasi</li>
            </ol>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
            <h4 className="font-bold text-blue-900 mb-3">Apa yang Harus Dilakukan Jika Akun Diretas?</h4>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>1. <strong>Segera reset password</strong> melalui halaman "Lupa Password"</li>
              <li>2. <strong>Hubungi tim support kami</strong> di support@mpzdt.org dengan bukti identitas</li>
              <li>3. <strong>Periksa riwayat transaksi</strong> untuk aktivitas mencurigakan</li>
              <li>4. <strong>Aktifkan autentikasi dua faktor</strong> (jika tersedia) untuk perlindungan ekstra</li>
              <li>5. <strong>Monitor akun Anda</strong> untuk beberapa waktu ke depan</li>
            </ol>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
            <h4 className="font-bold text-amber-900 mb-3">Jangan Lakukan Ini</h4>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>❌ Jangan bagikan password Anda kepada siapa pun, bahkan tim support MPZDT</li>
              <li>❌ Jangan menyimpan password di tempat yang mudah diakses orang lain</li>
              <li>❌ Jangan login dari perangkat publik atau WiFi yang tidak aman</li>
              <li>❌ Jangan klik link dari email mencurigakan (phishing)</li>
              <li>❌ Jangan biarkan orang lain melihat password Anda saat mengetik</li>
            </ul>
          </div>

          <div className="bg-slate-100 border-2 border-slate-300 rounded-2xl p-5">
            <h4 className="font-bold text-slate-900 mb-3">Fitur Keamanan Tambahan</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <FiCheck className="text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Enkripsi End-to-End</strong> - Semua data sensitif dienkripsi</span>
              </li>
              <li className="flex gap-2">
                <FiCheck className="text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Logout Otomatis</strong> - Logout setelah 30 menit tidak aktif</span>
              </li>
              <li className="flex gap-2">
                <FiCheck className="text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Notifikasi Login</strong> - Notifikasi saat ada login baru dari perangkat baru</span>
              </li>
              <li className="flex gap-2">
                <FiCheck className="text-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>Pemantauan Aktivitas</strong> - Anda dapat melihat riwayat login dan perangkat yang terhubung</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-5 text-white shadow-md">
            <p className="text-sm font-medium">
              <strong>Butuh Bantuan dengan Keamanan Akun?</strong><br />
              Hubungi tim support kami di support@mpzdt.org atau telepon (021) 1234-5678
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiShield className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest opacity-80">Perlindungan Data</p>
                <h1 className="text-3xl md:text-4xl font-bold">Keamanan & Privasi</h1>
              </div>
            </div>
            <p className="text-blue-100 text-lg mt-2 max-w-2xl">
              Kami berkomitmen melindungi data pribadi Anda dengan standar keamanan tertinggi.
            </p>
          </div>
        </div>

        {/* Tabs/Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all border-2 ${
                expandedSection === section.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-blue-600 border-blue-200 hover:border-blue-400'
              }`}
            >
              {section.id === 'lembaga' && '🏢 Lembaga'}
              {section.id === 'privasi' && '🔐 Privasi'}
              {section.id === 'syarat' && '📋 Syarat'}
              {section.id === 'password' && '🔒 Password'}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            expandedSection === section.id && (
              <div key={section.id} className="bg-white rounded-3xl border-2 border-blue-100 shadow-lg overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-amber-50 border-b-2 border-blue-100">
                  <h2 className="text-2xl font-bold text-blue-900">{section.title}</h2>
                </div>

                <div className="px-8 py-8">
                  {section.content}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Alternative Accordion View */}
        {expandedSection === null && (
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-2xl border-2 border-blue-100 overflow-hidden hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-blue-50 transition-colors"
                >
                  <h2 className="text-lg font-bold text-blue-900 text-left">{section.title}</h2>
                  <FiChevronDown className="text-blue-600 flex-shrink-0" size={24} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Legal */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-xl p-8 md:p-10 text-white mt-8">
          <div className="max-w-3xl">
            <div className="flex items-start gap-3 mb-4">
              <FiShield className="text-amber-500 text-2xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold">Komitmen Keamanan Data Anda</h3>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Semua kebijakan dan ketentuan ini berlaku sesuai dengan hukum positif Indonesia dan prinsip-prinsip Syariat Islam. 
              Data Anda dilindungi dengan enkripsi tingkat enterprise dan audit keamanan berkala oleh pihak ketiga independen.
            </p>
            <p className="text-xs text-slate-500 border-t border-slate-700 pt-4">
              Dokumen ini terakhir diperbarui pada Maret 2026. MPZDT berhak mengubah kebijakan ini, namun perubahan material 
              akan diberitahukan kepada pengguna melalui email atau notifikasi di aplikasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecurityCenter;
