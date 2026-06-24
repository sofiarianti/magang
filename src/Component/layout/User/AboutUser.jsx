import React, { useState } from 'react';
import { FiClock, FiHeart, FiMail, FiMapPin, FiTarget } from 'react-icons/fi';
import useAPI from '../../hooks/useAPI';
import endpoints from '../../Services/endpointUser';

function AboutUser() {
  const [selectedLembaga, setSelectedLembaga] = useState('');
  const donaturEndpoint = selectedLembaga ? endpoints.donatur.getByLembaga(selectedLembaga) : '/api/donatur';
  const { data, loading, error } = useAPI(donaturEndpoint);
  const { data: lembagaList, loading: lembagaLoading, error: lembagaError } = useAPI(endpoints.lembaga.getAll);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-blue-200/50 w-full max-w-md text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-600 text-sm">Memuat informasi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <p className="text-red-600 text-sm md:text-base">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <FiTarget className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-widest opacity-80">Tentang Kami</p>
                <h1 className="text-3xl md:text-4xl font-bold">DT Peduli &amp; Yayasan Kunci Kemurnian Sejahtera</h1>
              </div>
            </div>
            <p className="text-blue-100 text-lg mt-2 max-w-2xl">
              Sebagai naungan amil zakat dan lembaga filantropi, kami bergerak bersama untuk memberdayakan
              umat melalui zakat, infak, sedekah, dan program sosial yang nyata.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-lg p-8 md:p-10">
          <p className="text-sm uppercase tracking-widest text-blue-600 font-bold mb-3">
            TENTANG DT PEDULI
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
            Berbagi untuk Kemanusiaan dan Pemberdayaan
          </h2>
          <p className="text-slate-700 text-lg leading-relaxed mb-4">
            DT Peduli adalah program sosial di bawah naungan Yayasan Kunci Kemurnian Sejahtera yang fokus pada
            penyaluran zakat, infak, sedekah, dan donasi untuk membantu masyarakat rentan dan korban bencana.
          </p>
          <p className="text-slate-600 text-base leading-relaxed">
            Melalui layanan zakat, program qurban, pendidikan tahfidz, bantuan ekonomi usaha mikro, serta tanggap darurat,
            kami berkomitmen menjalankan amanah donatur secara profesional, transparan, dan penuh akuntabilitas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-lg p-8 hover:border-blue-300 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiTarget className="text-blue-600 text-lg" />
              </div>
              <h3 className="text-xl font-bold text-blue-900">Visi</h3>
            </div>
            <p className="text-slate-700 text-base leading-relaxed">
              Menjadi lembaga zakat dan donasi yang <strong>amanah</strong>, <strong>transparan</strong>,
              dan dapat dipercaya oleh masyarakat untuk memberikan manfaat berkelanjutan.
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
                <span className="text-amber-600 font-bold mt-1">*</span>
                <span>Mengelola zakat, infak, sedekah, dan donasi secara profesional dan bertanggung jawab</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 font-bold mt-1">*</span>
                <span>Menyalurkan bantuan tepat sasaran bagi dhuafa, korban bencana, dan keluarga terdampak</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 font-bold mt-1">*</span>
                <span>Mendukung program usaha mikro, gerobak berkah, dan pemberdayaan ekonomi lokal</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 font-bold mt-1">*</span>
                <span>Menyelenggarakan program pendidikan, tahfidz, dan dukungan sosial untuk generasi muda</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-amber-50 rounded-3xl border-2 border-blue-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Memahami Zakat</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Apa Itu Zakat?</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Zakat adalah salah satu instrumen utama DT Peduli untuk membersihkan harta dan memberi dukungan
                kepada mereka yang berhak. Dengan penyaluran yang tepat, zakat menjadi solusi sosial dan ekonomi
                untuk meningkatkan kesejahteraan masyarakat.
              </p>
              <p className="text-slate-600 text-sm">
                Selain zakat, kami juga mengelola infak, sedekah, dan donasi kemanusiaan untuk program sosial, pendidikan,
                dan bantuan darurat yang menjangkau wilayah Bogor dan sekitarnya.
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

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-3">Hubungi Kami</h2>
            <p className="text-slate-600">Informasi kontak dan jam operasional DT Peduli</p>
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
                    <strong>Email:</strong> support@dtpeduli.org
                  </p>
                  <p className="text-sm text-slate-600">
                    <strong>WhatsApp:</strong> 0823 1900 0200
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
                    <strong>Senin - Sabtu</strong>
                  </p>
                  <p className="text-sm text-slate-600">08:00 - 18:00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {Array.isArray(data) && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Donatur Terbaru</h2>
                <p className="text-slate-600 text-sm mt-1">Daftar donatur yang telah bergabung dengan DT Peduli</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3 shadow-sm">
                  <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">Filter Lembaga</label>
                  <select
                    value={selectedLembaga}
                    onChange={(e) => setSelectedLembaga(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Semua Lembaga</option>
                    {lembagaLoading && <option value="">Memuat lembaga...</option>}
                    {!lembagaLoading && lembagaError && <option value="">Gagal memuat lembaga</option>}
                    {!lembagaLoading && !lembagaError && lembagaList && lembagaList.map((lembaga) => (
                      <option key={lembaga.id || lembaga._id || lembaga.id_lembaga} value={lembaga.id || lembaga._id || lembaga.id_lembaga}>
                        {lembaga.nama || lembaga.name || `Lembaga ${lembaga.id || lembaga._id || lembaga.id_lembaga}`}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-2 font-semibold text-sm">
                  {data.length} Donatur
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-blue-100 shadow-md overflow-hidden">
              {data.length > 0 ? (
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
              ) : (
                <div className="p-8 text-center text-slate-600">
                  Belum ada donatur untuk lembaga ini.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AboutUser;
