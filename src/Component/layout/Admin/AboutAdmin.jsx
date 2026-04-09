import React from 'react';

function AboutAdmin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Tentang Aplikasi</h1>
            <p className="text-slate-600">Informasi tentang sistem manajemen donasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Sistem Manajemen Donasi MPZ</h2>
            
            <div className="space-y-6 text-slate-700">
              <p>
                Aplikasi ini dirancang untuk membantu pengelolaan data donasi, zakat, infaq, dan sedekah 
                dengan mudah dan efisien. Sistem ini menyediakan fitur lengkap untuk administrator dalam 
                mengelola data donatur, transaksi, dan informasi terkait.
              </p>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Fitur Utama:</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>Manajemen data donatur</li>
                  <li>Pencatatan dan pelacakan transaksi</li>
                  <li>Pengelolaan zakat dan infaq</li>
                  <li>Sistem notifikasi real-time</li>
                  <li>Laporan dan analitik komprehensif</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Versi:</h3>
                <p>1.0.0</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Hubungi Kami:</h3>
                <p>Email: admin@mpz-donasi.id</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutAdmin;
