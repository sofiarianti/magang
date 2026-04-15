import React, { useState, useMemo } from 'react';

// Nishab (minimal untuk wajib zakat)
const NISHAB = {
  emas: 85, // gram
  gaji: 2757000 // Rp (setara 85 gram emas)
};

function ZakatCalculator() {
  const [zakatType, setZakatType] = useState('penghasilan');
  const [inputs, setInputs] = useState({
    penghasilan: { bulanan: '' },
    emas: { berat: '', hargaPerGram: '' },
    tabungan: { jumlah: '', bulanBekerja: '' },
    nilaiBisnis: { nilai: '', hutang: '' },
    pertanian: { hasil: '', tipeHasil: 'padi' }
  });

  const handleInputChange = (type, field, value) => {
    setInputs(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value ? parseFloat(value) : ''
      }
    }));
  };

  const results = useMemo(() => {
    let hasil = {
      nishab: 0,
      total: 0,
      zakat: 0,
      persentase: 0,
      keterangan: '',
      wajibZakat: false
    };

    switch (zakatType) {
      case 'penghasilan': {
        const { bulanan } = inputs.penghasilan;
        if (!bulanan) return hasil;

        hasil.nishab = NISHAB.gaji;
        hasil.total = bulanan;
        hasil.wajibZakat = bulanan >= NISHAB.gaji;

        if (hasil.wajibZakat) {
          hasil.zakat = bulanan * 0.025; // 2.5%
          hasil.persentase = 2.5;
          hasil.keterangan = `Gaji bulanan Anda sebesar Rp${bulanan.toLocaleString('id-ID')} telah melebihi nishab. Zakat wajib dikeluarkan sebesar 2.5% per tahun (atau ${(bulanan * 0.025).toLocaleString('id-ID', {maximumFractionDigits: 0})} per bulan jika dibayar bulanan).`;
        } else {
          hasil.keterangan = `Gaji bulanan Anda masih di bawah nishab (Rp${NISHAB.gaji.toLocaleString('id-ID')}). Zakat penghasilan belum wajib, tapi zakat infak sunnah sangat dianjurkan.`;
        }
        break;
      }

      case 'emas': {
        const { berat, hargaPerGram } = inputs.emas;
        if (!berat || !hargaPerGram) return hasil;

        const totalNilai = berat * hargaPerGram;
        hasil.nishab = NISHAB.emas * hargaPerGram;
        hasil.total = totalNilai;
        hasil.wajibZakat = berat >= NISHAB.emas;

        if (hasil.wajibZakat) {
          const sisaSetelahNishab = berat - NISHAB.emas;
          hasil.zakat = (sisaSetelahNishab * hargaPerGram) * 0.025;
          hasil.persentase = 2.5;
          hasil.keterangan = `Emas Anda seberat ${berat}g dengan nilai Rp${totalNilai.toLocaleString('id-ID')} telah melebihi nishab (${NISHAB.emas}g). Zakat emas yang harus dikeluarkan adalah ${(sisaSetelahNishab * 0.025).toFixed(2)}g atau Rp${hasil.zakat.toLocaleString('id-ID', {maximumFractionDigits: 0})}.`;
        } else {
          hasil.keterangan = `Emas Anda masih di bawah nishab (${NISHAB.emas}g setara Rp${hasil.nishab.toLocaleString('id-ID', {maximumFractionDigits: 0})}). Zakat emas belum wajib.`;
        }
        break;
      }

      case 'tabungan': {
        const { jumlah, bulanBekerja } = inputs.tabungan;
        if (!jumlah || !bulanBekerja) return hasil;

        // Untuk tabungan, nishab dihitung dari rata-rata per bulan
        const rataRataBulanan = jumlah / bulanBekerja;
        hasil.nishab = NISHAB.gaji;
        hasil.total = jumlah;
        hasil.wajibZakat = rataRataBulanan >= NISHAB.gaji;

        if (hasil.wajibZakat) {
          hasil.zakat = jumlah * 0.025;
          hasil.persentase = 2.5;
          hasil.keterangan = `Tabungan Anda sebesar Rp${jumlah.toLocaleString('id-ID')} dengan rata-rata Rp${rataRataBulanan.toLocaleString('id-ID', {maximumFractionDigits: 0})} per bulan telah melebihi nishab. Zakat wajib sebesar Rp${hasil.zakat.toLocaleString('id-ID', {maximumFractionDigits: 0})}.`;
        } else {
          hasil.keterangan = `Rata-rata tabungan bulanan Anda masih di bawah nishab (Rp${NISHAB.gaji.toLocaleString('id-ID')}). Zakat belum wajib.`;
        }
        break;
      }

      case 'nilaiBisnis': {
        const { nilai, hutang } = inputs.nilaiBisnis;
        if (nilai === '' && hutang === '') return hasil;

        const hutangAmount = hutang || 0;
        const nilaiAfterHutang = nilai - hutangAmount;
        hasil.nishab = NISHAB.gaji;
        hasil.total = nilaiAfterHutang;
        hasil.wajibZakat = nilaiAfterHutang >= NISHAB.gaji;

        if (hasil.wajibZakat) {
          hasil.zakat = nilaiAfterHutang * 0.025;
          hasil.persentase = 2.5;
          hasil.keterangan = `Nilai bisnis Rp${nilai.toLocaleString('id-ID')} setelah dikurangi hutang Rp${hutangAmount.toLocaleString('id-ID')} menghasilkan jumlah bersih Rp${nilaiAfterHutang.toLocaleString('id-ID')} yang telah melebihi nishab. Zakat wajib sebesar Rp${hasil.zakat.toLocaleString('id-ID', {maximumFractionDigits: 0})}.`;
        } else {
          hasil.keterangan = `Nilai bisnis setelah hutang masih di bawah nishab. Zakat belum wajib.`;
        }
        break;
      }

      case 'pertanian': {
        const { hasil: hasilPanen, tipeHasil } = inputs.pertanian;
        if (!hasilPanen) return hasil;

        // Nishab pertanian: 652.8 kg atau 5 wasaq (1 wasaq = 130.56 kg)
        const nishabPertanian = 652.8;
        hasil.nishab = nishabPertanian;
        hasil.total = hasilPanen;
        hasil.wajibZakat = hasilPanen >= nishabPertanian;

        if (hasil.wajibZakat) {
          // Zakat pertanian 10% jika tanpa irigasi, 5% jika dengan irigasi
          const persentaseZakat = tipeHasil === 'dengan-irigasi' ? 5 : 10;
          hasil.zakat = hasilPanen * (persentaseZakat / 100);
          hasil.persentase = persentaseZakat;
          hasil.keterangan = `Hasil panen ${tipeHasil === 'dengan-irigasi' ? 'dengan irigasi' : 'tanpa irigasi'} sebesar ${hasilPanen}kg telah melebihi nishab (652.8kg). Zakat wajib sebesar ${persentaseZakat}% = ${hasil.zakat.toFixed(2)}kg atau setara Rp${(hasil.zakat * 500000).toLocaleString('id-ID', {maximumFractionDigits: 0})} (estimasi harga Rp500.000/kg).`;
        } else {
          hasil.keterangan = `Hasil panen masih di bawah nishab (652.8kg). Zakat pertanian belum wajib.`;
        }
        break;
      }

      default:
        break;
    }

    return hasil;
  }, [zakatType, inputs]);

  const isCalculated = results.total > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-6 lg:px-16">
      <div className="w-full space-y-8 max-w-6xl mx-auto">
        
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-blue-700 to-blue-800 rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Kalkulator Zakat</h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Hitung jumlah zakat yang harus Anda keluarkan dengan akurat dan sesuai syariat Islam
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Type Selection */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Pilih Jenis Zakat</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { value: 'penghasilan', label: 'Penghasilan' },
                  { value: 'emas', label: 'Emas & Perak' },
                  { value: 'tabungan', label: 'Tabungan' },
                  { value: 'nilaiBisnis', label: 'Nilai Bisnis' },
                  { value: 'pertanian', label: 'Pertanian' }
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setZakatType(type.value);
                      setInputs(prev => ({
                        ...prev,
                        [type.value]: Object.fromEntries(
                          Object.entries(prev[type.value]).map(([k]) => [k, ''])
                        )
                      }));
                    }}
                    className={`p-3 rounded-xl border-2 transition-all font-semibold text-sm ${
                      zakatType === type.value
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Masukkan Data Anda</h2>

              {zakatType === 'penghasilan' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gaji/Penghasilan Bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    value={inputs.penghasilan.bulanan}
                    onChange={(e) => handleInputChange('penghasilan', 'bulanan', e.target.value)}
                    placeholder="Contoh: 5000000"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-2">Nishab: Rp{NISHAB.gaji.toLocaleString('id-ID')}</p>
                </div>
              )}

              {zakatType === 'emas' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Berat Emas (gram)</label>
                    <input
                      type="number"
                      value={inputs.emas.berat}
                      onChange={(e) => handleInputChange('emas', 'berat', e.target.value)}
                      placeholder="Contoh: 100"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-2">Nishab: {NISHAB.emas}g</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Harga Per Gram (Rp)</label>
                    <input
                      type="number"
                      value={inputs.emas.hargaPerGram}
                      onChange={(e) => handleInputChange('emas', 'hargaPerGram', e.target.value)}
                      placeholder="Contoh: 800000"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {zakatType === 'tabungan' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Jumlah Tabungan (Rp)</label>
                    <input
                      type="number"
                      value={inputs.tabungan.jumlah}
                      onChange={(e) => handleInputChange('tabungan', 'jumlah', e.target.value)}
                      placeholder="Contoh: 50000000"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Lama Menabung (bulan)</label>
                    <input
                      type="number"
                      value={inputs.tabungan.bulanBekerja}
                      onChange={(e) => handleInputChange('tabungan', 'bulanBekerja', e.target.value)}
                      placeholder="Contoh: 12"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {zakatType === 'nilaiBisnis' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nilai Aset Bisnis (Rp)</label>
                    <input
                      type="number"
                      value={inputs.nilaiBisnis.nilai}
                      onChange={(e) => handleInputChange('nilaiBisnis', 'nilai', e.target.value)}
                      placeholder="Contoh: 100000000"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Hutang Bisnis (Rp) <span className="text-slate-500 text-xs">- Opsional</span></label>
                    <input
                      type="number"
                      value={inputs.nilaiBisnis.hutang}
                      onChange={(e) => handleInputChange('nilaiBisnis', 'hutang', e.target.value)}
                      placeholder="Contoh: 20000000"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {zakatType === 'pertanian' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Hasil Panen (kg)</label>
                    <input
                      type="number"
                      value={inputs.pertanian.hasil}
                      onChange={(e) => handleInputChange('pertanian', 'hasil', e.target.value)}
                      placeholder="Contoh: 1000"
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-2">Nishab: 652.8kg</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Pertanian</label>
                    <select
                      value={inputs.pertanian.tipeHasil}
                      onChange={(e) => handleInputChange('pertanian', 'tipeHasil', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all"
                    >
                      <option value="tanpa-irigasi">Tanpa Irigasi (Zakat 10%)</option>
                      <option value="dengan-irigasi">Dengan Irigasi (Zakat 5%)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {/* Result Card */}
            <div className={`rounded-2xl shadow-md border-2 p-6 transition-all ${
              isCalculated && results.wajibZakat
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                : isCalculated
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300'
                : 'bg-white border-slate-200'
            }`}>
              <h3 className="text-sm font-bold text-slate-900 mb-4">Hasil Perhitungan</h3>

              {!isCalculated ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm">Masukkan data untuk melihat hasil</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="pb-3 border-b border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">Total Harta</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {zakatType === 'pertanian' 
                        ? `${results.total.toFixed(2)}kg`
                        : `Rp${results.total.toLocaleString('id-ID', {maximumFractionDigits: 0})}`
                      }
                    </p>
                  </div>

                  {results.wajibZakat ? (
                    <>
                      <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-green-300">
                        <p className="text-xs text-slate-600 mb-1">Zakat Wajib</p>
                        <p className="text-2xl font-bold text-green-700">
                          {zakatType === 'pertanian'
                            ? `${results.zakat.toFixed(2)}kg`
                            : `Rp${results.zakat.toLocaleString('id-ID', {maximumFractionDigits: 0})}`
                          }
                        </p>
                        <p className="text-xs text-green-600 mt-1">({results.persentase}%)</p>
                      </div>
                      <div className="bg-green-500 bg-opacity-10 rounded-lg p-3 border border-green-300">
                        <p className="text-xs text-green-900 font-semibold">✓ Status: Wajib Zakat</p>
                        <p className="text-xs text-green-800 mt-1">Anda telah memenuhi syarat nishab</p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-amber-500 bg-opacity-10 rounded-lg p-3 border border-amber-300">
                      <p className="text-xs text-amber-900 font-semibold">Belum Wajib</p>
                      <p className="text-xs text-amber-800 mt-1">Zakat sunnah tetap dianjurkan</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        {isCalculated && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Ringkasan Zakat</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <p className="text-xs text-slate-600 font-semibold mb-2">TOTAL HARTA</p>
                <p className="text-lg font-bold text-blue-900">
                  {zakatType === 'pertanian' 
                    ? `${results.total.toFixed(2)}kg`
                    : `Rp${(results.total / 1000000).toFixed(1)}M`
                  }
                </p>
              </div>

              <div className={`bg-gradient-to-br rounded-xl p-4 border-2 ${
                results.wajibZakat 
                  ? 'from-green-50 to-green-100 border-green-300'
                  : 'from-amber-50 to-amber-100 border-amber-300'
              }`}>
                <p className="text-xs font-semibold mb-2" style={{color: results.wajibZakat ? '#047857' : '#b45309'}}>
                  STATUS
                </p>
                <p className="font-bold" style={{color: results.wajibZakat ? '#047857' : '#b45309'}}>
                  {results.wajibZakat ? 'Wajib' : 'Sunnah'}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                <p className="text-xs text-slate-600 font-semibold mb-2">PERSENTASE</p>
                <p className="text-lg font-bold text-amber-900">{results.persentase}%</p>
              </div>

              {results.wajibZakat && (
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-300">
                  <p className="text-xs text-slate-600 font-semibold mb-2">ZAKAT</p>
                  <p className="text-lg font-bold text-emerald-900">
                    {zakatType === 'pertanian'
                      ? `${results.zakat.toFixed(2)}kg`
                      : `Rp${(results.zakat / 1000000).toFixed(1)}M`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Explanation & Guidelines Section */}
        {isCalculated && (
          <div className="space-y-6">
            {/* Explanation Card */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Penjelasan</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {results.keterangan}
              </p>
            </div>

            {/* Guidelines Card */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Panduan Zakat</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p>• Zakat dikeluarkan saat memenuhi nishab</p>
                <p>• Konsultasikan dengan imam atau lembaga zakat terpercaya</p>
                <p>• Zakat bisa diberikan langsung atau melalui lembaga resmi</p>
                <p>• Niat (suksud) untuk berzakat adalah hal yang sangat penting</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ZakatCalculator;
