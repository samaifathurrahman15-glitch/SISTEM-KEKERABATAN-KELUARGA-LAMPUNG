import React from 'react';
import {
  BookOpen,
  Compass,
  Info,
  Layers,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { TapisDivider } from './TapisOrnament';

const DEVELOPER_IDENTITY = [
  {
    label: 'Nama Pembuat',
    value: 'Samai Fathurrahman, S.Pd., Gr. / Gimbakh Bahasa',
  },
  {
    label: 'Peran / Jabatan',
    value: 'Pengembang Media Pembelajaran',
  },
  {
    label: 'Asal Sekolah / Instansi',
    value: 'SMP Negeri 2 Limau Tanggamus',
  },
  {
    label: 'Mata Pelajaran',
    value:
      'Muatan Lokal (Mulok) Bahasa dan Budaya Lampung / Ilmu Pengetahuan Sosial (IPS)',
  },
  {
    label: 'Sasaran Pengguna',
    value: 'Masyarakat Umum',
  },
  {
    label: 'Tahun Pembuatan',
    value: '2026',
  },
  {
    label: 'Email',
    value: 'samaifathurrahman15@guru.smp.belajar.id',
    isEmail: true,
  },
] as const;

const APP_FUNCTIONS = [
  {
    title: 'Sarana Visualisasi dan Eksplorasi Materi Budaya',
    description:
      'Menyajikan materi sistem kekerabatan Lampung secara ringkas, visual, dan terstruktur sehingga konsep adat yang kompleks menjadi lebih mudah dipahami oleh peserta didik.',
  },
  {
    title: 'Media Pembelajaran Interaktif Berbasis Permainan',
    description:
      'Menggunakan mekanisme putaran roda (spinning wheel) untuk menciptakan suasana belajar yang dinamis, mengurangi kejenuhan, dan memicu rasa ingin tahu peserta didik terhadap topik yang terpilih secara acak.',
  },
  {
    title: 'Penguatan Pemahaman Tata Krama dan Sapaan Adat (Tutur)',
    description:
      'Membantu peserta didik mengenali serta mempraktikkan penggunaan istilah panggilan kekerabatan dalam keluarga Lampung (seperti Abah/Ayah, Umi/Induk, Kiyai/Puakhi, Pun, Atu, Tamong, Kajong, Kemaman, Minan) sesuai dengan kedudukan dan garis keturunannya.',
  },
  {
    title: 'Instrumen Evaluasi dan Latihan Mandiri',
    description:
      'Berfungsi sebagai alat ukur pemahaman peserta didik melalui fitur kuis atau tantangan pertanyaan yang muncul pada setiap segmen roda, baik digunakan untuk evaluasi individu maupun kompetisi kelompok di kelas.',
  },
  {
    title: 'Upaya Pelestarian Kearifan Lokal Lampung',
    description:
      'Menanamkan rasa bangga, cinta budaya daerah, serta kesadaran untuk menjaga nilai-nilai persaudaraan (muakhi) dan falsafah hidup Piil Pesenggiri di tengah perkembangan teknologi digital.',
  },
] as const;

const MATERIAL_COVERAGE = [
  {
    title: 'Struktur Kekerabatan dan Garis Keturunan',
    description:
      'Penjelasan mengenai sistem patrilineal (garis keturunan ayah), konsep keluarga inti dan keluarga besar, serta struktur Marga atau Buay.',
  },
  {
    title: 'Dua Masyarakat Adat Lampung',
    description:
      'Pengenalan karakteristik sistem kekerabatan dan adat istiadat pada masyarakat Lampung Pepadun dan Lampung Saibatin.',
  },
  {
    title: 'Sistem Panggilan Keluarga (Tutur)',
    description:
      'Panduan panggilan hormat kepada orang tua, saudara kandung, kerabat pihak ayah (kelama), dan kerabat pihak ibu (kemaman/lebu).',
  },
  {
    title: 'Nilai Falsafah Piil Pesenggiri dalam Kekerabatan',
    description:
      'Penerapan unsur Juluk Adok (gelar adat), Nemui Nyimah (ramah menerima tamu), Nengah Nyappur (bergaul dan bermusyawarah), serta Sakai Sambayan (gotong royong) dalam kehidupan bermasyarakat.',
  },
  {
    title: 'Zona Kuis & Tantangan Interaktif',
    description:
      'Soal-soal studi kasus dan tebak istilah kekerabatan untuk menguji ketepatan pemahaman pengguna setelah memutar roda.',
  },
] as const;

const MATERIAL_SOURCES = [
  'Akhyar, dkk. 2005. LKS Bahasa Lampung untuk SLTP Kelas 3. Depok: Arya Duta, hlm. 10–12.',
  'Mustika, Suri Laili, Azzahra Aulia Maharani, dan Andhika Satria Hanapi. t.t. Nalom Bubahasa Lampung (untuk SMP/MTs Kelas IX). Sidoarjo: Masmedia, hlm. 69–74.',
  'Warsiyem. 2014. Hanggum Nihan Bebahasa Lampung Kelas IX. Bandar Lampung: Gunung Pesagi, hlm. 73–80.',
  'Wawancara dengan Masyarakat Pekon Kedaloman, Kecamatan Gunung Alip dan Pekon Padang Ratu, Kecamatan Limau, Kabupaten Tanggamus, 2026.',
] as const;

export const AboutApp: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Gambaran Umum Aplikasi */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-red-700">
              Tentang Aplikasi
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              Roda Pintar Sistem Budaya Kekerabatan Lampung
            </h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          <strong>Roda Pintar Sistem Budaya Kekerabatan Lampung</strong> adalah
          media pembelajaran interaktif berbasis digital yang dirancang untuk
          mempermudah peserta didik dalam mengenal, memahami, dan melestarikan
          nilai-nilai sistem kekerabatan masyarakat adat Lampung melalui
          pendekatan gamifikasi (<em>game-based learning</em>).
        </p>
      </section>

      {/* A. Identitas Pengembang */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5">
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100">
          <UserCheck className="w-5 h-5 text-red-700 shrink-0" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            A. Identitas Pengembang
          </h3>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          {DEVELOPER_IDENTITY.map((item) => (
            <div
              key={item.label}
              className="pb-3 border-b border-slate-100 last:border-b-0 md:last:border-b"
            >
              <dt className="text-xs font-semibold text-slate-500">
                {item.label}
              </dt>
              <dd className="text-slate-900 font-medium mt-1">
                {'isEmail' in item && item.isEmail ? (
                  <a
                    href={`mailto:${item.value}`}
                    className="text-red-700 hover:text-red-800 hover:underline break-all"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className={item.label === 'Tahun Pembuatan' ? 'font-mono tabular-nums' : ''}>
                    {item.value}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* B. Fungsi dan Tujuan Aplikasi */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5">
        <div className="space-y-1.5 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-red-700 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              B. Fungsi dan Tujuan Aplikasi
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Aplikasi media pembelajaran ini dikembangkan dengan beberapa fungsi
            utama untuk mendukung proses belajar mengajar di kelas maupun secara
            mandiri:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {APP_FUNCTIONS.map((item, idx) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5"
            >
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                <span className="font-mono tabular-nums text-red-700 mr-2">
                  0{idx + 1}.
                </span>
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* C. Cakupan Materi dan Fitur Utama Roda Pintar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-5">
        <div className="space-y-1.5 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-red-700 shrink-0" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              C. Cakupan Materi dan Fitur Utama Roda Pintar
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Setiap segmen pada Roda Pintar memuat subtopik penting dalam sistem
            budaya kekerabatan masyarakat Lampung, meliputi:
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {MATERIAL_COVERAGE.map((topic, idx) => (
            <div key={topic.title} className="py-3.5 first:pt-0 last:pb-0">
              <h4 className="text-sm sm:text-base font-semibold text-slate-900">
                <span className="font-mono tabular-nums text-red-700 mr-2">
                  {idx + 1}.
                </span>
                {topic.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* D. Sumber Materi */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-red-700 shrink-0" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            D. Sumber Materi
          </h3>
        </div>

        <ol className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {MATERIAL_SOURCES.map((source, idx) => (
            <li key={source} className="flex items-start gap-3">
              <span className="font-mono tabular-nums text-xs font-bold text-red-700 mt-0.5 shrink-0">
                {idx + 1}.
              </span>
              <span>{source}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* E. Ketentuan Penggunaan dan Hak Cipta */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-red-700 shrink-0" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            E. Ketentuan Penggunaan dan Hak Cipta
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
          Perangkat lunak ini dikembangkan secara khusus untuk mendukung kegiatan
          pendidikan, pembelajaran, dan pelestarian budaya daerah. Dilarang
          keras memperjualbelikan, menggandakan, mendistribusikan ulang, atau
          memanfaatkan perangkat lunak ini untuk keperluan komersial dalam
          bentuk apa pun tanpa izin tertulis dari pengembang.
        </p>

        <TapisDivider />

        <p className="text-xs sm:text-sm font-semibold text-slate-900 text-center">
          © 2026 Samai Fathurrahman, S.Pd., Gr. — Hak Cipta Dilindungi
          Undang-Undang.
        </p>
      </section>
    </div>
  );
};
