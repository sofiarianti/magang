import React, { useState } from 'react';

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
            Secara bahasa, zakat bermakna tumbuh, suci, dan berkembang. Secara istilah, zakat adalah bagian tertentu dari harta yang wajib dikeluarkan oleh seorang Muslim yang telah memenuhi syarat.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-sm font-semibold text-slate-900">Makna Ibadah</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Zakat bukan sekadar kewajiban finansial, tetapi ibadah yang membersihkan harta, melatih keikhlasan, dan menumbuhkan rasa tanggung jawab sosial.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-sm font-semibold text-slate-900">Kedudukan</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Zakat adalah salah satu pilar utama dalam Islam. Pelaksanaannya menjaga keseimbangan antara ibadah dan kepedulian kepada sesama.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="text-sm font-semibold text-slate-900">Tujuan Zakat</h4>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                'Membersihkan jiwa dari sifat kikir dan tamak.',
                'Membantu fakir, miskin, dan yang membutuhkan.',
                'Mewujudkan keadilan sosial dalam kehidupan umat.',
                'Menguatkan ukhuwah serta kepedulian antar sesama Muslim.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
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
            Zakat dibagi menjadi dua kelompok utama: zakat mal dan zakat fitrah. Keduanya sama-sama wajib, tetapi memiliki waktu dan ketentuan yang berbeda.
          </p>

          <div className="grid gap-5 xl:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-base font-semibold text-slate-900">Zakat Mal</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Zakat ini dikenakan atas harta tertentu yang mencapai nishab dan haul.
              </p>
              <div className="mt-4 space-y-3">
                {['Emas dan perak', 'Uang serta tabungan', 'Penghasilan atau profesi', 'Perdagangan', 'Pertanian', 'Ternak'].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-base font-semibold text-slate-900">Zakat Fitrah</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ditunaikan pada akhir Ramadan sebagai bentuk penyucian diri dan kepedulian sosial.
              </p>
              <div className="mt-4 space-y-3">
                {['Wajib bagi Muslim yang mampu', 'Dikeluarkan dalam makanan pokok atau nilai setara', 'Bertujuan membantu fakir miskin pada hari raya'].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-semibold text-slate-900">Perbedaan Utama</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Zakat Mal</p>
                <p className="mt-2 leading-6">Dikeluarkan saat harta mencapai syarat nishab dan haul.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Zakat Fitrah</p>
                <p className="mt-2 leading-6">Ditunaikan menjelang Idulfitri dan bersifat universal bagi yang mampu.</p>
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
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="text-base font-semibold text-slate-900">Dalil Al-Quran</h4>
            <div className="mt-4 space-y-4">
              {[
                { source: 'QS. At-Taubah (9): 103', text: 'Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka...' },
                { source: 'QS. Al-Baqarah (2): 43', text: 'Dan dirikanlah shalat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.' },
                { source: 'QS. At-Taubah (9): 60', text: 'Sesungguhnya zakat-zakat itu hanyalah untuk orang-orang fakir, miskin, amil, muallaf, budak, orang berutang, fi sabilillah, dan ibnu sabil.' },
              ].map((item) => (
                <div key={item.source} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.source}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700 italic">"{item.text}"</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="text-base font-semibold text-slate-900">Dalil Hadits</h4>
            <div className="mt-4 space-y-4">
              {[
                { source: 'Hadits tentang lima pilar Islam', text: 'Islam dibangun atas lima perkara: syahadat, shalat, zakat, puasa Ramadan, dan haji bagi yang mampu.' },
                { source: 'Hadits riwayat Muslim', text: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.' },
                { source: 'Hadits riwayat Tirmidzi', text: 'Sedekah dapat memadamkan dosa sebagaimana air memadamkan api.' },
              ].map((item) => (
                <div key={item.source} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.source}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700 italic">"{item.text}"</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-semibold text-slate-900">Inti Pemahaman</h4>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                'Zakat adalah perintah yang jelas dalam syariat Islam.',
                'Zakat berkaitan dengan penyucian jiwa dan harta.',
                'Penyaluran zakat harus tepat kepada golongan yang berhak.',
                'Kewajiban zakat menunjukkan kepedulian sosial dalam beribadah.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'doa',
      title: 'Doa Zakat, Wakaf, dan Infak',
      summary: 'Doa singkat yang bisa dibaca saat menunaikan zakat, wakaf, dan infak.',
      content: (
        <div className="space-y-6">
          {[
            {
              title: 'Doa Zakat',
              arabic: 'اللَّهُمَّ تَقَبَّلْ مِنِّي وَتَقَبَّلْ مِنَّا وَاجْعَلْهُ لَنَا شَاهِدًا وَلاَ جَارًّا',
              latin: 'Allahumma taqabbal minni wa taqabbal minna waj‘alhu lana shahidan wa la jarran.',
              translation: 'Ya Allah, terimalah zakatku dan zakat kami, jadikanlah untuk kami sebagai saksi dan bukan sebagai bala.’',
            },
            {
              title: 'Doa Wakaf',
              arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
              latin: 'Rabbana taqabbal minna innaka antas-sami‘ul-‘alim.',
              translation: 'Ya Tuhan kami, terimalah dari kami, sesungguhnya Engkaulah Yang Maha Mendengar lagi Maha Mengetahui.',
            },
            {
              title: 'Doa Infak',
              arabic: 'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
              latin: 'Allahumma a‘inni ‘ala dhikrika wa shukrika wa husni ‘ibadatik.',
              translation: 'Ya Allah, tolonglah aku untuk selalu mengingat-Mu, bersyukur kepada-Mu, dan beribadah dengan baik kepada-Mu.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-base font-semibold text-slate-900">{item.title}</h4>
              <p className="mt-4 text-sm leading-7 text-slate-700 italic">{item.arabic}</p>
              <p className="mt-3 text-sm text-slate-600"><span className="font-semibold">Latin:</span> {item.latin}</p>
              <p className="mt-2 text-sm text-slate-600"><span className="font-semibold">Terjemahan:</span> {item.translation}</p>
            </div>
          ))}
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
            Zakat menjadi wajib ketika syarat-syarat tertentu terpenuhi, baik dari sisi orang yang menunaikan maupun dari sisi harta yang dimilikinya.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-base font-semibold text-slate-900">Syarat Umum</h4>
              <div className="mt-4 space-y-3">
                {['Beragama Islam', 'Memiliki harta secara sah', 'Memiliki kebebasan mengelola harta', 'Telah baligh atau berada dalam tanggungan yang sah menurut ketentuan zakat'].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-base font-semibold text-slate-900">Syarat Harta</h4>
              <div className="mt-4 space-y-3">
                {['Mencapai nishab', 'Melewati haul pada jenis harta tertentu', 'Lebih dari kebutuhan pokok', 'Tidak habis untuk menutupi kewajiban mendesak'].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h4 className="text-sm font-semibold text-slate-900">Tentang Nishab dan Haul</h4>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Nishab</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Batas minimal harta yang menyebabkan zakat menjadi wajib. Nilainya berbeda sesuai jenis harta.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Haul</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Masa kepemilikan selama satu tahun pada jenis harta tertentu sebelum kewajiban zakat dikenakan.</p>
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
            Penyaluran zakat harus mengikuti ketentuan syariat. Al-Quran menjelaskan delapan golongan penerima zakat agar distribusinya tepat sasaran.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
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
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-900 text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h4 className="text-sm font-semibold text-slate-900">Prinsip Penyaluran</h4>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              Zakat tidak disalurkan sembarangan. Ketepatan sasaran membuat zakat lebih efektif dan amanah.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const activeSection = sections.find((section) => section.id === expandedSection) || sections[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6 p-8 sm:p-10">
              <p className="text-[11px] uppercase tracking-[0.24em] font-semibold text-slate-500">
                Panduan Zakat
              </p>
              <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                Edukasi Zakat untuk Donatur DT Peduli
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                Pelajari zakat dengan struktur informasi yang tertata, mudah dinavigasi, dan nyaman dibaca. Lengkap dengan dalil, syarat, serta doa untuk zakat, wakaf, dan infak.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Fokus</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">Konten terstruktur</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Gaya</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">Bersih dan profesional</p>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] bg-blue-950 p-8 text-white sm:p-10">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-inner">
                <p className="text-sm uppercase tracking-[0.22em] text-amber-300">Ajaran Utama</p>
                <h2 className="mt-4 text-2xl font-semibold">Zakat adalah ibadah dan kepedulian</h2>
                <p className="mt-4 text-sm leading-7 text-slate-200">
                  Menunaikan zakat membersihkan harta, memperkuat empati, dan mendukung kesejahteraan bersama.
                </p>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="font-semibold text-white">Doa</p>
                    <p className="mt-1 text-slate-200">Baca dengan niat ikhlas sebelum memberi.</p>
                  </div>
                  <div className="rounded-3xl bg-amber-500/15 p-4">
                    <p className="font-semibold text-white">Penyaluran</p>
                    <p className="mt-1 text-slate-200">Gunakan jalur resmi agar bantuan tepat sasaran.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Daftar Materi</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Pilih topik yang ingin dipelajari</h2>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">
                  Struktur lebih rapih
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {sections.map((section, index) => {
                  const isActive = section.id === expandedSection;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className={`flex w-full items-start gap-4 rounded-3xl border px-5 py-4 text-left transition ${isActive ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-900'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`text-base font-semibold ${isActive ? 'text-slate-950' : 'text-slate-900'}`}>{section.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-500">{section.summary}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Kenapa penting</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">Struktur membuat materi lebih mudah dipahami, tanpa membuat data tampak padat.</p>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Manfaat</p>
                <p className="mt-3 text-sm leading-6 text-slate-700">Navigasi jelas membantu pembaca mengetahui topik mana yang sedang dibaca dan mempercepat pencarian informasi.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Topik Aktif
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">{activeSection.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{activeSection.summary}</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
                {activeSection.content}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-blue-200 bg-blue-950 px-8 py-8 text-white shadow-sm sm:px-10 sm:py-10">
          <h3 className="text-2xl font-semibold">Penutup</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2 text-sm leading-7 text-slate-200">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              Memahami zakat membantu menunaikan ibadah dengan benar dan penuh tanggung jawab.
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              Untuk kondisi khusus, konsultasi dengan lembaga zakat resmi atau ahli fikih tetap dianjurkan.
            </div>
          </div>
          <div className="mt-5 rounded-3xl border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-sm text-amber-100">
            Niat tulus, pemahaman benar, dan penyaluran amanah adalah fondasi utama dalam berzakat.
          </div>
        </section>
      </div>
    </div>
  );
}

export default EducationZakat;
