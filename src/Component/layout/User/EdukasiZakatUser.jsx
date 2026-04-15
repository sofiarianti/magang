import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

function EducationZakat() {
  const [expandedSection, setExpandedSection] = useState('pengertian');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'pengertian',
      title: 'Pengertian Zakat',
      summary: 'Memahami makna zakat, kedudukannya dalam Islam, dan tujuan sosial-spiritualnya.',
      content: (
        <div className="space-y-6">
          <p className="text-sm leading-7 text-slate-700">
            Secara bahasa, zakat bermakna tumbuh, suci, dan berkembang. Secara istilah,
            zakat adalah bagian tertentu dari harta yang wajib dikeluarkan oleh seorang
            Muslim yang telah memenuhi syarat, untuk disalurkan kepada golongan yang
            berhak menerimanya sesuai ketentuan syariat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-sm font-semibold text-blue-950">Makna Ibadah</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Zakat bukan sekadar kewajiban finansial, tetapi ibadah yang membersihkan
                harta, melatih keikhlasan, dan menumbuhkan rasa tanggung jawab sosial.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h4 className="text-sm font-semibold text-blue-950">Kedudukan</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Zakat adalah salah satu pilar utama dalam Islam. Karena itu, pelaksanaannya
                memiliki posisi yang sangat penting dalam kehidupan seorang Muslim.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h4 className="text-sm font-semibold text-blue-950">Tujuan Zakat</h4>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Membersihkan jiwa dari sifat kikir dan tamak.',
                'Membantu fakir, miskin, dan golongan yang membutuhkan.',
                'Mewujudkan keadilan sosial dalam kehidupan umat.',
                'Menguatkan ukhuwah serta kepedulian antar sesama Muslim.',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-white bg-white px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'jenis-zakat',
      title: 'Jenis-Jenis Zakat',
      summary: 'Mengenal zakat mal dan zakat fitrah beserta contoh harta yang terkena kewajiban zakat.',
      content: (
        <div className="space-y-6">
          <p className="text-sm leading-7 text-slate-700">
            Secara umum, zakat dibagi menjadi dua kelompok utama: zakat mal dan zakat fitrah.
            Keduanya sama-sama wajib, namun memiliki objek, waktu, dan ketentuan yang berbeda.
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <h4 className="text-base font-semibold text-blue-950">Zakat Mal</h4>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Zakat yang dikenakan atas harta tertentu yang telah mencapai nishab dan haul.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  'Emas dan perak',
                  'Uang serta tabungan',
                  'Penghasilan atau profesi',
                  'Perdagangan',
                  'Pertanian',
                  'Ternak',
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h4 className="text-base font-semibold text-blue-950">Zakat Fitrah</h4>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Zakat yang wajib ditunaikan pada akhir Ramadan sebelum salat Idulfitri.
              </p>
              <div className="mt-4 space-y-3">
                {[
                  'Wajib bagi setiap Muslim yang mampu.',
                  'Dikeluarkan dalam bentuk makanan pokok atau nilai yang setara sesuai ketentuan setempat.',
                  'Bertujuan menyucikan diri dan membantu fakir miskin pada hari raya.',
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-semibold text-blue-950">Perbedaan Utama</h4>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Zakat Mal</p>
                <p className="mt-2 leading-6">Dikeluarkan ketika harta mencapai syarat tertentu seperti nishab dan haul.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Zakat Fitrah</p>
                <p className="mt-2 leading-6">Ditunaikan menjelang Idulfitri dan berlaku untuk setiap Muslim yang mampu.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'dalil',
      title: 'Dalil Al-Quran dan Hadits',
      summary: 'Landasan syariat zakat dalam Al-Quran dan hadits sebagai dasar kewajiban bagi umat Islam.',
      content: (
        <div className="space-y-6">
          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <h4 className="text-base font-semibold text-blue-950">Dalil Al-Quran</h4>
            <div className="mt-4 space-y-4">
              {[
                {
                  source: 'QS. At-Taubah (9): 103',
                  text: 'Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka...',
                },
                {
                  source: 'QS. Al-Baqarah (2): 43',
                  text: 'Dan dirikanlah shalat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.',
                },
                {
                  source: 'QS. At-Taubah (9): 60',
                  text: 'Sesungguhnya zakat-zakat itu hanyalah untuk orang-orang fakir, miskin, amil, muallaf, budak, orang berutang, fi sabilillah, dan ibnu sabil.',
                },
              ].map((item) => (
                <div key={item.source} className="rounded-xl border border-blue-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{item.source}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700 italic">"{item.text}"</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h4 className="text-base font-semibold text-blue-950">Dalil Hadits</h4>
            <div className="mt-4 space-y-4">
              {[
                {
                  source: 'Hadits tentang lima pilar Islam',
                  text: 'Islam dibangun atas lima perkara: syahadat, shalat, zakat, puasa Ramadan, dan haji bagi yang mampu.',
                },
                {
                  source: 'Hadits riwayat Muslim',
                  text: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.',
                },
                {
                  source: 'Hadits riwayat Tirmidzi',
                  text: 'Sedekah dapat memadamkan dosa sebagaimana air memadamkan api.',
                },
              ].map((item) => (
                <div key={item.source} className="rounded-xl border border-amber-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{item.source}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700 italic">"{item.text}"</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-semibold text-blue-950">Inti Pemahaman</h4>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Zakat adalah perintah yang jelas dalam syariat Islam.',
                'Zakat berkaitan dengan penyucian jiwa dan harta.',
                'Penyaluran zakat harus tepat kepada golongan yang berhak.',
                'Kewajiban zakat menunjukkan keterikatan antara ibadah dan kepedulian sosial.',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'syarat',
      title: 'Syarat Wajib Zakat',
      summary: 'Mengetahui syarat umum dan syarat harta agar zakat menjadi wajib ditunaikan.',
      content: (
        <div className="space-y-6">
          <p className="text-sm leading-7 text-slate-700">
            Zakat menjadi wajib ketika syarat-syarat tertentu terpenuhi, baik dari sisi orang yang menunaikan
            maupun dari sisi harta yang dimilikinya.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <h4 className="text-base font-semibold text-blue-950">Syarat Umum</h4>
              <div className="mt-4 space-y-3">
                {[
                  'Beragama Islam',
                  'Memiliki harta secara sah',
                  'Memiliki kebebasan mengelola harta',
                  'Telah baligh atau berada dalam tanggungan yang sah menurut ketentuan zakat',
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h4 className="text-base font-semibold text-blue-950">Syarat Harta</h4>
              <div className="mt-4 space-y-3">
                {[
                  'Mencapai nishab',
                  'Melewati haul pada jenis harta tertentu',
                  'Lebih dari kebutuhan pokok',
                  'Tidak habis untuk menutupi kewajiban mendesak',
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-semibold text-blue-950">Tentang Nishab dan Haul</h4>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Nishab</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Batas minimal harta yang menyebabkan zakat menjadi wajib. Nilainya berbeda sesuai jenis harta.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Haul</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Masa kepemilikan selama satu tahun pada jenis harta tertentu sebelum kewajiban zakat dikenakan.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'penerima',
      title: 'Golongan Penerima Zakat',
      summary: 'Mengenal delapan asnaf yang berhak menerima zakat sesuai ketentuan Al-Quran.',
      content: (
        <div className="space-y-6">
          <p className="text-sm leading-7 text-slate-700">
            Penyaluran zakat harus mengikuti ketentuan syariat. Al-Quran menjelaskan delapan golongan
            penerima zakat agar distribusinya tepat sasaran dan memberi manfaat yang nyata.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Fakir', 'Orang yang hampir tidak memiliki harta dan tidak mampu memenuhi kebutuhan pokoknya.'],
              ['Miskin', 'Orang yang memiliki penghasilan, tetapi belum cukup untuk kebutuhan hidup yang layak.'],
              ['Amil', 'Pihak yang bertugas mengelola, mencatat, dan menyalurkan zakat.'],
              ['Muallaf', 'Orang yang dilunakkan hatinya agar semakin dekat kepada Islam.'],
              ['Riqab', 'Pembebasan dari perbudakan atau bentuk keterikatan yang sejenis dalam konteks modern.'],
              ['Gharim', 'Orang yang memiliki utang karena kebutuhan yang dibenarkan dan tidak mampu melunasinya.'],
              ['Fi Sabilillah', 'Pihak yang berjuang di jalan Allah untuk kemaslahatan agama dan umat.'],
              ['Ibnu Sabil', 'Musafir yang kehabisan bekal dalam perjalanan yang dibenarkan.'],
            ].map(([title, desc], index) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-900 text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-950">{title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h4 className="text-sm font-semibold text-blue-950">Prinsip Penyaluran</h4>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Zakat tidak disalurkan sembarangan. Ketepatan sasaran menjadi bagian penting agar zakat
              benar-benar memberi manfaat, mengurangi kesenjangan, dan menjaga amanah syariat.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <div className="w-full px-6 lg:px-16 py-10 lg:py-12 space-y-8">
        <section className="overflow-hidden rounded-3xl border border-blue-900/10 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-[linear-gradient(135deg,_#0f172a_0%,_#1e3a8a_100%)] px-8 py-8 md:px-10 md:py-10 text-white">
            <p className="text-[11px] uppercase tracking-[0.28em] font-semibold text-amber-200">
              Panduan Zakat
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold leading-tight">
              Edukasi Zakat
            </h1>
            <p className="mt-4 max-w-3xl text-sm md:text-base leading-7 text-blue-100">
              Halaman ini disusun untuk membantu Anda memahami zakat secara lebih tertib,
              mulai dari pengertian, dasar hukum, syarat, hingga penyaluran kepada golongan yang berhak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 py-6 md:px-10 bg-slate-50">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Fokus Pembahasan</p>
              <p className="mt-2 text-sm font-semibold text-blue-950">Prinsip Dasar Zakat</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Pendekatan</p>
              <p className="mt-2 text-sm font-semibold text-blue-950">Ringkas, Formal, dan Mudah Dipahami</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Manfaat</p>
              <p className="mt-2 text-sm font-semibold text-blue-950">Membantu Donatur Memahami Kewajiban dan Penyaluran</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-900 text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-blue-950">{section.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{section.summary}</p>
                  </div>
                </div>
                <span className="mt-1 text-slate-400 flex-shrink-0">
                  {expandedSection === section.id ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </span>
              </button>

              {expandedSection === section.id && (
                <div className="border-t border-slate-100 px-6 py-6 bg-white">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-blue-900/10 bg-[linear-gradient(135deg,_#0f172a_0%,_#1e3a8a_100%)] px-8 py-8 md:px-10 md:py-10 text-white shadow-sm">
          <h3 className="text-2xl font-semibold">Penutup</h3>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm leading-7 text-blue-100">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              Memahami zakat dengan baik membantu kita menunaikan ibadah secara benar dan penuh tanggung jawab.
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              Untuk kondisi yang lebih khusus, konsultasi dengan lembaga zakat resmi atau ahli fikih tetap sangat dianjurkan.
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-sm text-amber-100">
            Niat yang tulus, pemahaman yang benar, dan penyaluran yang amanah adalah fondasi utama dalam berzakat.
          </div>
        </section>
      </div>
    </div>
  );
}

export default EducationZakat;
