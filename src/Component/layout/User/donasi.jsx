import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAPI from '../../hooks/useAPI';
import endpoints from '../../Services/endpointUser';

function Donasi({ user }) {
  const navigate = useNavigate();
  const {
    data: jenisData,
    loading: loadingJenis,
    error: errorJenis,
  } = useAPI(endpoints.jenis_donasi.getAll);

  // Ambil semua detail donasi (akan difilter di sisi frontend)
  const {
    data: detailData,
    loading: loadingDetail,
    error: errorDetail,
  } = useAPI(endpoints.detail_donasi.getAll);

  const [selectedJenis, setSelectedJenis] = useState(null);

  // Normalisasi data jenis_donasi
  const jenisDonasiList = useMemo(() => {
    if (Array.isArray(jenisData)) return jenisData;
    if (Array.isArray(jenisData?.jenis_donasi)) return jenisData.jenis_donasi;
    if (Array.isArray(jenisData?.data)) return jenisData.data;
    return [];
  }, [jenisData]);

  // Normalisasi data detail_donasi
  const detailDonasiList = useMemo(() => {
    if (Array.isArray(detailData?.detail_donasi)) return detailData.detail_donasi;
    if (Array.isArray(detailData)) return detailData;
    if (Array.isArray(detailData?.data)) return detailData.data;
    return [];
  }, [detailData]);

  // Filter detail_donasi berdasarkan jenis yang dipilih (id_jenis_donasi / kode_jenis_donasi)
  const filteredDetailByJenis = useMemo(() => {
    if (!selectedJenis) return [];

    const idJenis = selectedJenis.id || selectedJenis.id_jenis_donasi;
    const kodeJenis = selectedJenis.kode || selectedJenis.kode_jenis_donasi;

    return detailDonasiList.filter((detail) => {
      const matchById =
        idJenis &&
        (detail.id_jenis_donasi === idJenis ||
          detail.jenis_donasi_id === idJenis);
      const matchByKode =
        kodeJenis &&
        (detail.kode_jenis_donasi === kodeJenis ||
          detail.kode_jenis === kodeJenis);
      return matchById || matchByKode;
    });
  }, [detailDonasiList, selectedJenis]);

  const loading = loadingJenis || loadingDetail;
  const error = errorJenis || errorDetail;

  // Fungsi untuk mendapatkan ikon berdasarkan jenis donasi
  const getIconForJenis = (nama) => {
    const lowerNama = nama?.toLowerCase() || '';
    if (lowerNama.includes('zakat')) {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      );
    } else if (lowerNama.includes('infaq')) {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-slate-200/50 w-full max-w-md text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">Memuat daftar donasi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-slate-100">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-red-200/50 w-full max-w-md text-center">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-red-600 text-sm">Terjadi kesalahan saat memuat data. Silakan coba lagi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-6 lg:px-16">
      <div className="w-full space-y-10">

        {/* hero section */}
        <div className="bg-gradient-to-br from-slate-800 via-blue-600 to-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-6 md:px-12 py-6 md:py-9">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Komitmen Kami</h2>
              <p className="text-sm text-blue-100 max-w-2xl">
                Platform MPZ DT didirikan dengan visi menjadi jembatan kepercayaan antara donatur dan mustahik, memastikan setiap rupiah yang disumbangkan sampai tepat sasaran dengan penuh transparansi dan akuntabilitas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Metric 1 */}
              <div className="relative">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold text-amber-400">1,250</span>
                  <span className="text-lg text-blue-200">Keluarga</span>
                </div>
                <div className="h-0.5 w-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mb-2"></div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Telah merasakan manfaat langsung dari program-program zakat dan donasi kami selama tahun ini.
                </p>
              </div>

              {/* Metric 2 */}
              <div className="relative">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold text-amber-400">Rp 2.5</span>
                  <span className="text-lg text-blue-200">Miliar</span>
                </div>
                <div className="h-0.5 w-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mb-2"></div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Total dana yang telah tersalurkan melalui berbagai program kemanusiaan dan sosial kami.
                </p>
              </div>

              {/* Metric 3 */}
              <div className="relative">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold text-amber-400">2,840</span>
                  <span className="text-lg text-blue-200">Donatur</span>
                </div>
                <div className="h-0.5 w-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mb-2"></div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Komunitas donatur aktif kami yang terus berkembang dengan komitmen berbagi kebaikan setiap hari.
                </p>
              </div>

              {/* Metric 4 */}
              <div className="relative">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-bold text-amber-400">100%</span>
                  <span className="text-lg text-blue-200">Transparan</span>
                </div>
                <div className="h-0.5 w-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mb-2"></div>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Laporan keuangan dan program tersedia untuk semua donatur sebagai bentuk akuntabilitas kami.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-0.5">Terpercaya & Tersertifikasi</h4>
                  <p className="text-xs text-blue-200">Lembaga kami tersertifikasi oleh badan independen dan memenuhi standar internasional.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-0.5">Sistem Keamanan Berlapis</h4>
                  <p className="text-xs text-blue-200">Data dan transaksi Anda dilindungi dengan enkripsi tingkat enterprise untuk keamanan maksimal.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-0.5">Dampak Terukur & Nyata</h4>
                  <p className="text-xs text-blue-200">Setiap donasi dilaporkan secara detail dengan bukti dampak langsung kepada penerima manfaat.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Pilih Jenis Donasi */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Pilih Jenis Donasi
              </h2>
              <p className="text-base text-slate-600 max-w-2xl">
                Setiap jenis donasi memiliki tujuan mulia. Pilih yang sesuai dengan niat dan kemampuan Anda untuk memberikan dampak maksimal.
              </p>
            </div>
            {selectedJenis && (
              <button
                onClick={() => setSelectedJenis(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-blue-900 text-white hover:shadow-lg transition-all text-sm font-semibold border border-amber-400/30"
              >
                Ubah Pilihan
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jenisDonasiList.map((item) => {
              const isActive =
                selectedJenis &&
                (selectedJenis.id === item.id ||
                  selectedJenis.kode === item.kode);

              return (
                <button
                  key={item.id || item.kode}
                  onClick={() => setSelectedJenis(item)}
                  className={`relative text-left rounded-2xl overflow-hidden transition-all duration-300 transform group ${
                    isActive
                      ? "shadow-2xl scale-105"
                      : "shadow-lg hover:shadow-2xl hover:scale-[1.03]"
                  }`}
                >
                  {/* Card Background */}
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-blue-50 via-slate-50 to-amber-50"
                      : "bg-white group-hover:bg-gradient-to-br group-hover:from-slate-50 group-hover:to-blue-50"
                  }`} />

                  {/* Top Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-amber-600"
                      : "bg-gradient-to-r from-blue-200 to-blue-300 group-hover:from-amber-400 group-hover:to-amber-600"
                  }`} />

                  {/* Content */}
                  <div className="relative p-7">
                    <div className="flex items-start gap-5 mb-5">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        isActive
                          ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg"
                          : "bg-gradient-to-br from-slate-100 to-blue-100 text-slate-700 group-hover:from-amber-100 group-hover:to-amber-200 group-hover:text-amber-700"
                      }`}>
                        {getIconForJenis(item.nama_donasi || item.nama || item.nama_jenis)}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold transition-colors ${
                          isActive ? "text-slate-900" : "text-slate-900 group-hover:text-slate-900"
                        }`}>
                          {item.nama_donasi || item.nama || item.nama_jenis}
                        </h3>
                      </div>
                    </div>

                    {item.deskripsi && (
                      <p className={`text-sm mb-5 line-clamp-2 transition-colors ${
                        isActive ? "text-slate-600" : "text-slate-600 group-hover:text-slate-700"
                      }`}>
                        {item.deskripsi}
                      </p>
                    )}

                    {/* Bottom CTA */}
                    <div className={`flex items-center justify-between pt-4 border-t transition-colors ${
                      isActive ? "border-amber-300" : "border-slate-200 group-hover:border-amber-400/30"
                    }`}>
                      <span className={`text-sm font-bold transition-colors ${
                        isActive ? "text-amber-700" : "text-blue-700 group-hover:text-amber-700"
                      }`}>
                        Pilih Program
                      </span>
                      {isActive && (
                        <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center animate-pulse">
                          <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Program Donasi */}
        {selectedJenis && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Program {selectedJenis.nama || selectedJenis.nama_jenis}
              </h2>
              <p className="text-sm text-slate-600">
                Pilih program spesifik untuk mendukung kebaikan yang Anda inginkan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDetailByJenis.map((detail) => (
                <button
                  key={detail.id || detail.kode_detail_donasi}
                  onClick={() => {
                    navigate("/transaksi", {
                      state: {
                        selectedJenis,
                        selectedDetail: detail,
                        user
                      }
                    });
                  }}
                  className="bg-white rounded-2xl border-2 border-blue-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-400 text-left p-6 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 rounded-2xl group-hover:from-blue-50 group-hover:to-blue-50/50 transition-all duration-300 pointer-events-none" />
                  <div className="relative flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                        {detail.kode_detail_donasi}
                      </p>
                      <h3 className="text-lg font-bold text-slate-800">
                        {detail.nama_detail_donasi || detail.nama}
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300 flex-shrink-0">
                      <svg className={`w-5 h-5 transition-colors ${
                        "text-blue-600 group-hover:text-amber-400"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 relative">
                    Dukung program ini dan bantu mereka yang membutuhkan. Setiap donasi Anda membuat perbedaan.
                  </p>
                  <div className="flex items-center justify-between relative">
                    <span className="text-sm text-blue-600 font-bold group-hover:text-amber-700">
                      Donasi Sekarang →
                    </span>
                    <span className="text-xs text-slate-400">Klik untuk lanjut</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Tips Memilih Donasi */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-6 md:px-12 py-6 md:py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Panduan Memilih Donasi</h2>
              <p className="text-sm text-slate-600 max-w-3xl">
                Kami memahami setiap donasi adalah keputusan penting. Berikut panduan untuk membantu Anda memilih program donasi yang paling sesuai dengan nilai dan tujuan kemanusiaan Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tip 1 */}
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-base">1</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Tentukan Niat & Tujuan Anda</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Apakah Anda ingin memenuhi kewajiban zakat, memberikan infaq, atau mendukung program khusus? Mengetahui niat jelas membantu Anda memilih program yang paling bermakna dan sesuai dengan hati nurani.
                  </p>
                </div>
              </div>

              {/* Tip 2 */}
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-base">2</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Sesuaikan dengan Kemampuan Finansial</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pilih nominal donasi yang tidak memberatkan finansial Anda. Kedisiplinan dalam donasi berkala lebih berharga daripada nominal besar sekali waktu. Donasi berkelanjutan menciptakan dampak yang lebih konsisten.
                  </p>
                </div>
              </div>

              {/* Tip 3 */}
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-base">3</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Pahami Kebutuhan Penerima Manfaat</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Setiap program kami dirancang untuk memenuhi kebutuhan spesifik. Baca deskripsi program, pelajari siapa yang akan membantu, dan bagaimana dampak nyata dari donasi Anda terhadap kehidupan mereka.
                  </p>
                </div>
              </div>

              {/* Tip 4 */}
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-base">4</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Prioritaskan Dampak Jangka Panjang</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pilih program yang tidak sekadar membantu saat ini, tetapi memberikan solusi berkelanjutan. Program pendidikan, pelatihan keterampilan, atau pemberdayaan ekonomi memiliki dampak transformatif jangka panjang.
                  </p>
                </div>
              </div>

              {/* Tip 5 */}
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-base">5</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Cek Transparansi & Laporan Kami</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kami menyediakan laporan detail untuk setiap program. Lihat bagaimana dana Anda digunakan, statistik penerima manfaat, dan feedback dari lapangan. Transparansi adalah bentuk kepercayaan kami kepada Anda.
                  </p>
                </div>
              </div>

              {/* Tip 6 */}
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-base">6</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Libatkan Hati & Akal Sehat</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Donasi yang iklas adalah kombinasi hati nuranimu menggerak hati, dan akal sehat memilih tujuan yang tepat. Tidak ada keputusan donasi yang salah selama dilakukan dengan tulus dan pengetahuan yang cukup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donasi;