import React, { useEffect, useMemo, useState } from 'react';
import useAPI from '../../hooks/useAPI';
import endpointsUser from '../../Services/endpointUser';
import usePostDonatur from '../../hooks/usePostDonatur';
import usePostTransaksi from '../../hooks/usePostTransaksi';
import { addNotification } from '../../Services/notifikasi';

function InputTransaksiDonasi({ admin }) {
  const { data: donaturData } = useAPI(endpointsUser.donatur.getAll);
  const { data: jenisDonasiData } = useAPI(endpointsUser.jenis_donasi.getAll);
  const { data: detailDonasiData } = useAPI(endpointsUser.detail_donasi.getAll);
  const { data: himpunData } = useAPI(endpointsUser.himpun?.getAll || '/api/himpun');
  
  const { postDonatur, loading: loadingPostDonatur, error: errorPostDonatur } = usePostDonatur();
  const { postTransaksi, loading: loadingPostTransaksi, error: errorPostTransaksi } = usePostTransaksi();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [donaturMode, setDonaturMode] = useState('existing'); // 'existing' or 'new'
  const [selectedDonatur, setSelectedDonatur] = useState('');
  const [newDonaturNama, setNewDonaturNama] = useState('');
  const [newDonaturNik, setNewDonaturNik] = useState('');
  const [newDonaturEmail, setNewDonaturEmail] = useState('');
  const [newDonaturNoHp, setNewDonaturNoHp] = useState('');
  const [newDonaturAlamat, setNewDonaturAlamat] = useState('');
  const [newDonaturJenisKelamin, setNewDonaturJenisKelamin] = useState('Laki-laki');
  const [selectedJenisDonasi, setSelectedJenisDonasi] = useState('');
  const [selectedDetailDonasi, setSelectedDetailDonasi] = useState('');
  const [selectedHimpun, setSelectedHimpun] = useState('');
  const [nominal, setNominal] = useState('');
  const [catatan, setCatatan] = useState('');
  const [status, setStatus] = useState('berhasil');

  // Parse data
  const donaturList = useMemo(() => {
    if (Array.isArray(donaturData)) return donaturData;
    if (Array.isArray(donaturData?.donatur)) return donaturData.donatur;
    if (Array.isArray(donaturData?.data)) return donaturData.data;
    return [];
  }, [donaturData]);

  const jenisDonasiList = useMemo(() => {
    if (Array.isArray(jenisDonasiData)) return jenisDonasiData;
    if (Array.isArray(jenisDonasiData?.jenis_donasi)) return jenisDonasiData.jenis_donasi;
    if (Array.isArray(jenisDonasiData?.data)) return jenisDonasiData.data;
    return [];
  }, [jenisDonasiData]);

  const himpunList = useMemo(() => {
    if (Array.isArray(himpunData)) return himpunData;
    if (Array.isArray(himpunData?.himpun)) return himpunData.himpun;
    if (Array.isArray(himpunData?.data)) return himpunData.data;
    return [];
  }, [himpunData]);

  // Normalize all detail donasi from API
  const allDetailDonasiList = useMemo(() => {
    if (Array.isArray(detailDonasiData?.detail_donasi)) return detailDonasiData.detail_donasi;
    if (Array.isArray(detailDonasiData)) return detailDonasiData;
    if (Array.isArray(detailDonasiData?.data)) return detailDonasiData.data;
    return [];
  }, [detailDonasiData]);

  // Filter detail donasi based on selected jenis donasi
  const detailDonasiList = useMemo(() => {
    if (!selectedJenisDonasi || allDetailDonasiList.length === 0) return [];

    const selectedJenis = jenisDonasiList.find(
      (item) =>
        String(item.id) === String(selectedJenisDonasi) ||
        String(item.kode_jenis_donasi) === String(selectedJenisDonasi) ||
        String(item.id_jenis_donasi) === String(selectedJenisDonasi)
    );

    if (!selectedJenis) return [];

    // Get id and kode from selected jenis
    const idJenis = selectedJenis.id || selectedJenis.id_jenis_donasi || selectedJenis.jenis_donasi_id;
    const kodeJenis = selectedJenis.kode_jenis_donasi || selectedJenis.kode;

    return allDetailDonasiList.filter((detail) => {
      // Match by id_jenis_donasi
      const matchById =
        idJenis &&
        (String(detail.id_jenis_donasi) === String(idJenis) ||
          String(detail.jenis_donasi_id) === String(idJenis));
      
      // Match by kode_jenis_donasi
      const matchByKode =
        kodeJenis &&
        (String(detail.kode_jenis_donasi) === String(kodeJenis) ||
          String(detail.kode_jenis) === String(kodeJenis));

      return matchById || matchByKode;
    });
  }, [selectedJenisDonasi, jenisDonasiList, allDetailDonasiList]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(value || 0) || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    let donaturToUse = null;

    if (donaturMode === 'existing') {
      if (!selectedDonatur) {
        setError('Pilih donatur terlebih dahulu.');
        return;
      }
      donaturToUse = donaturList.find(
        (d) =>
          d.id === selectedDonatur ||
          d.kode_donatur === selectedDonatur ||
          d.id_donatur === selectedDonatur
      );
    } else {
      // Validate new donatur data
      if (!newDonaturNama.trim()) {
        setError('Masukkan nama donatur terlebih dahulu.');
        return;
      }
      if (!newDonaturEmail.trim()) {
        setError('Masukkan email donatur terlebih dahulu.');
        return;
      }
      if (!newDonaturNoHp.trim()) {
        setError('Masukkan nomor handphone donatur terlebih dahulu.');
        return;
      }
    }

    if (!selectedJenisDonasi) {
      setError('Pilih jenis donasi terlebih dahulu.');
      return;
    }
    if (!selectedDetailDonasi) {
      setError('Pilih program/detail donasi terlebih dahulu.');
      return;
    }
    if (!selectedHimpun) {
      setError('Pilih metode pembayaran terlebih dahulu.');
      return;
    }
    if (!nominal || Number(nominal) <= 0) {
      setError('Masukkan nominal donasi yang valid.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let donaturToUse = null;

      // If new donatur, create it first using hook
      if (donaturMode === 'new') {
        try {
          // Generate password: at least 6 characters (email prefix + timestamp)
          const emailPrefix = newDonaturEmail.split('@')[0];
          const defaultPassword = emailPrefix.substring(0, 3) + String(Date.now()).slice(-6);
          
          const result = await postDonatur(
            newDonaturNik || '',
            newDonaturNama,
            newDonaturAlamat || '', // alamat opsional
            '-', // tempat_lahir
            '2000-01-01', // tanggal_lahir
            newDonaturJenisKelamin || 'Laki-laki', // jenis_kelamin
            'Islam', // agama dengan default
            'Belum Menikah', // status_perkawinan dengan default
            '-', // pekerjaan
            'Indonesia', // kewarganegaraan dengan default
            newDonaturNoHp, // no_hp (wajib)
            newDonaturEmail,
            defaultPassword, // password dengan minimal 6 karakter
            1 // isRegister = 1 (register/non-guest)
          );

          if (!result || !result.kode_donatur) {
            throw new Error(errorPostDonatur || 'Gagal membuat data donatur baru.');
          }

          donaturToUse = result;
        } catch (err) {
          throw new Error(err.message || 'Gagal membuat data donatur baru.');
        }
      } else {
        // Get existing donatur
        donaturToUse = donaturList.find(
          (d) =>
            d.id === selectedDonatur ||
            d.kode_donatur === selectedDonatur ||
            d.id_donatur === selectedDonatur
        );

        if (!donaturToUse) {
          throw new Error('Donatur yang dipilih tidak valid.');
        }
      }

      // Get selected data
      const jenis = jenisDonasiList.find(
        (j) =>
          j.id === selectedJenisDonasi ||
          j.kode_jenis_donasi === selectedJenisDonasi ||
          j.id_jenis_donasi === selectedJenisDonasi
      );

      const himpun = himpunList.find(
        (h) =>
          h.id === selectedHimpun ||
          h.kode_himpun === selectedHimpun ||
          h.id_himpun === selectedHimpun
      );

      const detailDonasi = detailDonasiList.find(
        (dd) =>
          dd.id === selectedDetailDonasi ||
          dd.kode_detail_donasi === selectedDetailDonasi ||
          dd.id_detail_donasi === selectedDetailDonasi
      );

      if (!donaturToUse || !jenis || !himpun || !detailDonasi) {
        throw new Error('Data yang dipilih tidak valid.');
      }

      // Submit transaction using hook
      const kodeTransaksi = `TRX-${Date.now()}-ADM`;
      
      const result = await postTransaksi(
        kodeTransaksi,                                    // 1. kode_transaksi
        donaturToUse.kode_donatur || donaturToUse.id,   // 2. kode_donatur
        jenis.kode_jenis_donasi || jenis.id,            // 3. kode_jenis_donasi
        detailDonasi.kode_detail_donasi || detailDonasi.id, // 4. kode_detail_donasi
        String(admin?.kode_user || '') || 'admin',      // 5. kode_user
        himpun.kode_himpun || himpun.id,                // 6. kode_himpun
        null,                                            // 7. kode_detail_transaksi
        Number(nominal),                                 // 8. jumlah_donasi
        status,                                          // 9. status
        catatan || '',                                   // 10. catatan
        1,                                               // 11. isRegister
        himpun.nama_himpun || himpun.nama,             // 12. metodePembayaran
        ''                                               // 13. jalurPembayaran
      );

      if (!result) {
        throw new Error(errorPostTransaksi || 'Gagal menyimpan transaksi donasi.');
      }

      // Handle various response structures
      const transaksiData = result.transaksi || result.data || result;
      const kodeTrx = transaksiData?.kode_transaksi || transaksiData?.id || kodeTransaksi;

      setSuccessMessage(
        `Transaksi donasi berhasil disimpan! Kode Transaksi: ${kodeTrx}`
      );

      // Send notification
      addNotification({
        title: 'Transaksi Donasi Diterima',
        message: `Terima kasih telah berdonasi sebesar ${formatCurrency(nominal)}. Donasi Anda sedang diproses.`,
        userType: 'donatur',
        audienceKey: donaturToUse.kode_donatur || donaturToUse.id,
      });

      // Reset form
      setDonaturMode('existing');
      setSelectedDonatur('');
      setNewDonaturNama('');
      setNewDonaturEmail('');
      setNewDonaturNoHp('');
      setNewDonaturNik('');
      setNewDonaturAlamat('');
      setNewDonaturJenisKelamin('Laki-laki');
      setSelectedJenisDonasi('');
      setSelectedDetailDonasi('');
      setSelectedHimpun('');
      setNominal('');
      setCatatan('');
      setStatus('berhasil');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan transaksi donasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDonaturMode('existing');
    setSelectedDonatur('');
    setNewDonaturNama('');
    setNewDonaturNik('');
    setNewDonaturEmail('');
    setNewDonaturNoHp('');
    setNewDonaturAlamat('');
    setNewDonaturJenisKelamin('Laki-laki');
    setSelectedJenisDonasi('');
    setSelectedDetailDonasi('');
    setSelectedHimpun('');
    setNominal('');
    setCatatan('');
    setStatus('berhasil');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="w-full px-6 lg:px-16 py-12 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-blue-700 font-semibold">Input Data</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-2">Form Transaksi Donasi</h1>
          <p className="text-sm text-slate-600 mt-3">
            Catat transaksi donasi dari donatur yang datang langsung ke kantor.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">Form Input</p>
            <p className="mt-1 text-sm text-slate-500">
              Lengkapi semua field untuk mencatat transaksi donasi baru.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Donatur Mode Selection */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900 mb-3">Pilih Sumber Data Donatur</p>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="donaturMode"
                    value="existing"
                    checked={donaturMode === 'existing'}
                    onChange={(e) => {
                      setDonaturMode(e.target.value);
                      setSelectedDonatur('');
                    }}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="ml-2 text-sm font-medium text-blue-800">Gunakan Donatur Existing</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="donaturMode"
                    value="new"
                    checked={donaturMode === 'new'}
                    onChange={(e) => {
                      setDonaturMode(e.target.value);
                      setNewDonaturNama('');
                      setNewDonaturNik('');
                      setNewDonaturEmail('');
                      setNewDonaturNoHp('');
                      setNewDonaturAlamat('');
                    }}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="ml-2 text-sm font-medium text-blue-800">Input Donatur Baru</span>
                </label>
              </div>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donatur - Existing Mode */}
              {donaturMode === 'existing' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Donatur <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedDonatur}
                    onChange={(e) => setSelectedDonatur(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={donaturMode === 'existing'}
                  >
                    <option value="">-- Pilih Donatur --</option>
                    {donaturList.map((donatur) => (
                      <option
                        key={donatur.id || donatur.kode_donatur}
                        value={donatur.id || donatur.kode_donatur}
                      >
                        {donatur.nama || donatur.nama_donatur} ({donatur.kode_donatur || donatur.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Donatur Baru - New Mode */}
              {donaturMode === 'new' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Nama Donatur <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newDonaturNama}
                      onChange={(e) => setNewDonaturNama(e.target.value)}
                      placeholder="Masukkan nama lengkap donatur"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={donaturMode === 'new'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      NIK (Nomor Identitas Kependudukan)
                    </label>
                    <input
                      type="text"
                      value={newDonaturNik}
                      onChange={(e) => setNewDonaturNik(e.target.value)}
                      placeholder="Masukkan NIK donatur (opsional)"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength="16"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newDonaturEmail}
                      onChange={(e) => setNewDonaturEmail(e.target.value)}
                      placeholder="Masukkan email donatur"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={donaturMode === 'new'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      No. Handphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newDonaturNoHp}
                      onChange={(e) => setNewDonaturNoHp(e.target.value)}
                      placeholder="Masukkan nomor handphone"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required={donaturMode === 'new'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Alamat
                    </label>
                    <input
                      type="text"
                      value={newDonaturAlamat}
                      onChange={(e) => setNewDonaturAlamat(e.target.value)}
                      placeholder="Masukkan alamat donatur (opsional)"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Jenis Kelamin
                    </label>
                    <select
                      value={newDonaturJenisKelamin}
                      onChange={(e) => setNewDonaturJenisKelamin(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </>
              )}

              {/* Jenis Donasi */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Jenis Donasi <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedJenisDonasi}
                  onChange={(e) => {
                    setSelectedJenisDonasi(e.target.value);
                    setSelectedDetailDonasi(''); // Reset detail donasi
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Pilih Jenis Donasi --</option>
                  {jenisDonasiList.map((jenis) => (
                    <option key={jenis.id || jenis.kode_jenis_donasi} value={jenis.id || jenis.kode_jenis_donasi}>
                      {jenis.nama_donasi || jenis.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detail Donasi / Program */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Program Donasi <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDetailDonasi}
                  onChange={(e) => setSelectedDetailDonasi(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!selectedJenisDonasi}
                >
                  <option value="">-- Pilih Program --</option>
                  {detailDonasiList.map((detail) => (
                    <option
                      key={detail.id || detail.kode_detail_donasi}
                      value={detail.id || detail.kode_detail_donasi}
                    >
                      {detail.nama_detail_donasi || detail.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Metode Pembayaran */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Metode Pembayaran <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedHimpun}
                  onChange={(e) => setSelectedHimpun(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Pilih Metode Pembayaran --</option>
                  {himpunList.map((himpun) => (
                    <option key={himpun.id || himpun.kode_himpun} value={himpun.id || himpun.kode_himpun}>
                      {himpun.nama_himpun || himpun.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nominal */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Nominal Donasi <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  <span className="text-slate-600 font-medium">Rp</span>
                  <input
                    type="number"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    placeholder="Masukkan nominal donasi"
                    className="ml-2 flex-1 bg-transparent text-sm focus:outline-none"
                    required
                    min="0"
                  />
                </div>
                {nominal && (
                  <p className="text-xs text-slate-600 mt-2">
                    Total: <span className="font-semibold">{formatCurrency(nominal)}</span>
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Status Transaksi <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="berhasil">✓ Berhasil (Tunai Diterima)</option>
                  <option value="diproses">⏳ Diproses (Tunda Verifikasi)</option>
                </select>
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Catatan (Opsional)</label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tambahkan catatan tentang donasi ini..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="4"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="reset"
                onClick={handleReset}
                className="flex-1 rounded-xl border-2 border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 md:p-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Panduan Penggunaan</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✓ Pilih donatur dari daftar yang sudah terdaftar di sistem</li>
            <li>✓ Tentukan jenis donasi (Zakat, Infaq, Sedekah, dll)</li>
            <li>✓ Pilih program/detail donasi sesuai kebutuhan</li>
            <li>✓ Tentukan metode pembayaran (Tunai, Transfer, Kartu, dll)</li>
            <li>✓ Masukkan nominal donasi yang diterima</li>
            <li>✓ Pilih status: "Berhasil" jika tunai langsung diterima, atau "Diproses" jika perlu verifikasi</li>
            <li>✓ Tambahkan catatan jika diperlukan (nama pendonasi, bukti, dll)</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default InputTransaksiDonasi;
