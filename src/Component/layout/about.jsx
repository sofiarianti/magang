import React from 'react';
import { FiMapPin, FiMail, FiClock, FiTarget, FiHeart } from 'react-icons/fi';
import useAPI from '../hooks/useAPI';

function About() {
  const { data, loading, error } = useAPI(`/api/donatur`);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-blue-200/50 w-full max-w-md text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-600 text-sm">Memuat informasi...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <p className="text-red-600 text-sm md:text-base">{error}</p>
      </div>
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
                <FiTarget className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest opacity-80">Identitas</p>
                <h1 className="text-3xl md:text-4xl font-bold">Tentang Kami</h1>
              </div>
            </div>
            <p className="text-blue-100 text-lg mt-2 max-w-2xl">
              Lembaga Pengelola Zakat dan Donasi yang Amanah, Transparan, dan Berdampak
            </p>
          </div>
        </div>

        {/* Hero Content */}
        <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-lg p-8 md:p-10">
          <p className="text-sm uppercase tracking-widest text-blue-600 font-bold mb-3">
            TENTANG MPZDT
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            Lembaga Pengelola Zakat, Infak, Sedekah & Donasi
          </h2>
          <p className="text-slate-700 text-lg leading-relaxed mb-4">
            MPZ DT (Masjid Pusat Zakat Donatur) adalah lembaga yang berkomitmen untuk mengelola zakat, infak, sedekah, 
            dan donasi kemanusiaan secara <strong>amanah</strong>, <strong>profesional</strong>, dan <strong>transparan</strong>.
          </p>
          <p className="text-slate-600 text-base leading-relaxed">
            Setiap dana yang dipercayakan oleh para donatur akan disalurkan kepada masyarakat yang membutuhkan melalui 
            berbagai program sosial, pendidikan, pemberdayaan ekonomi, dan kesehatan. Kami percaya bahwa zakat adalah 
            lebih dari sekadar kewajiban - ini adalah ibadah yang menciptakan dampak sosial yang nyata dan berkelanjutan.
          </p>
        </div>

        {/* VISI MISI */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-lg p-8 hover:border-blue-300 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiTarget className="text-blue-600 text-lg" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">Visi</h3>
            </div>
            <p className="text-slate-700 text-base leading-relaxed">
              Menjadi lembaga pengelola zakat dan donasi yang <strong>amanah</strong>, <strong>transparan</strong>, 
              dan memberikan dampak nyata bagi kesejahteraan masyarakat dan pembangunan berkelanjutan.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-amber-100 shadow-lg p-8 hover:border-amber-300 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <FiHeart className="text-amber-600 text-lg" />
              </div>
              <h3 className="text-xl font-bold text-amber-900">Misi</h3>
            </div>
            <ul className="text-slate-700 text-sm space-y-2">
              <li className="flex gap-2">
                <span className="text-amber-600 font-bold mt-1">•</span>
                <span>Mengelola zakat dan donasi secara profesional dan transparan</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 font-bold mt-1">•</span>
                <span>Menyalurkan bantuan tepat sasaran kepada mustahik</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 font-bold mt-1">•</span>
                <span>Memberdayakan masyarakat melalui program ekonomi dan sosial</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 font-bold mt-1">•</span>
                <span>Memberikan laporan keuangan yang akurat dan terverifikasi</span>
              </li>
            </ul>
          </div>
        </div>

        {/* TENTANG ZAKAT */}
        <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-3xl border-2 border-blue-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Memahami Zakat</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Apa Itu Zakat?</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Zakat secara bahasa berarti <strong>"tumbuh dan berkembang"</strong>. Dalam istilah Islam, zakat adalah 
                ibadah yang wajib ditunaikan oleh setiap Muslim yang mampu untuk membersihkan harta dan jiwa dari sifat 
                kikir serta membantu sesama yang membutuhkan.
              </p>
              <p className="text-slate-600 text-sm">
                Zakat adalah hak fakir miskin yang wajib dikeluarkan oleh yang mampu, bukan sekedar sedekah sukarela. 
                Ini adalah pilar Islam keempat yang memiliki dimensi spiritual dan sosial yang mendalam.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-900">Manfaat Zakat</h3>
              <div className="space-y-2">
                <div className="bg-white rounded-2xl p-4 border-l-4 border-blue-600">
                  <p className="text-sm text-slate-700"><strong className="text-blue-900">Spiritual:</strong> Membersihkan jiwa dari kerakusan dan keserakahan</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border-l-4 border-amber-600">
                  <p className="text-sm text-slate-700"><strong className="text-amber-900">Sosial:</strong> Mengurangi kesenjangan dan kemiskinan di masyarakat</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border-l-4 border-blue-600">
                  <p className="text-sm text-slate-700"><strong className="text-blue-900">Ekonomi:</strong> Meningkatkan daya beli masyarakat kurang mampu</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border-l-4 border-amber-600">
                  <p className="text-sm text-slate-700"><strong className="text-amber-900">Ukhuwah:</strong> Mempererat tali silaturahmi antar umat Muslim</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KONTAK */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Hubungi Kami</h2>
            <p className="text-slate-600">Informasi kontak dan jam operasional MPZDT</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-md p-6 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Alamat Kantor</h3>
                  <p className="text-sm text-slate-600">
                    Ruko Johar Grande, Jl. Johar Raya No.3, Kedung Waringin, Tanah Sareal, Bogor, Jawa Barat 16161
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-amber-100 shadow-md p-6 hover:border-amber-300 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-amber-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Kontak</h3>
                  <p className="text-sm text-slate-600 mb-1">
                    <strong>Email:</strong> info@mpzdt.id
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>Telepon:</strong> (022) 1234567
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-md p-6 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiClock className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">Jam Operasional</h3>
                  <p className="text-sm text-slate-600 mb-1">
                    <strong>Senin – Jumat</strong>
                  </p>
                  <p className="text-sm text-slate-600">
                    08:00 – 16:00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* DONATUR TERBARU */}
        {Array.isArray(data) && data.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Donatur Terbaru</h2>
                <p className="text-slate-600 text-sm mt-1">Daftar donatur yang telah bergabung dengan MPZDT</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-2 font-semibold text-sm">
                {data.length} Donatur
              </span>
            </div>

            <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-md overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto divide-y divide-blue-100">
                {data.map((donatur) => (
                  <div
                    key={donatur.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {donatur.nama || 'Donatur'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {donatur.email || 'Email tidak tersedia'}
                      </p>
                    </div>

                    {donatur.nominal && (
                      <p className="text-sm font-bold text-blue-600 ml-4">
                        Rp {Number(donatur.nominal).toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default About;