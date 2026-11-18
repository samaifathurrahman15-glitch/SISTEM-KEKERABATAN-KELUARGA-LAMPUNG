export interface WheelPosition {
  number: number;
  imageLabel: string;
  characterName: string;
  lampungTerm: string;
  angleDeg: number; // Sudut sektor posisi 1..14 pada piringan matriks bawah (0° = jam 12, searah jarum jam)
  generationTier: string;
  tutokhVariants: string;
  explanation: string;
  matrixNotes: string;
  silsilahReference: 'cakak' | 'dibah' | 'keduanya';
  silsilahNote: string;
}

export interface GlossaryEntry {
  term: string;
  meaning: string;
  variants?: string;
}

export interface GlossaryCategory {
  id: string;
  title: string;
  subtitle: string;
  entries: GlossaryEntry[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface QuizScoreRecord {
  id: string;
  studentName: string;
  score: number;
  total: number;
  dateISO: string;
  durationSeconds?: number;
}

export const FALLBACK_EXPLANATION =
  'Silakan pelajari istilah kekerabatan ini bersama guru.';

// Sudut panah biru "PILIH OBJEK" pada roda merah atas saat rotasi 0° (searah jarum jam dari jam 12)
export const TOP_WHEEL_ARROW_OFFSET_DEG = 360 / 14; // ~25.714° (mengarah tepat ke sektor #7 Abang Ipar Ayah)

export const WHEEL_ASSETS = {
  mainWheel: '/assets/aistudio/projek_14_siang_gif__1__d858adad.png',
  bottomMatrix: '/assets/aistudio/bawah_projek_14_siang_4c8f975d.png',
  silsilahDibah: '/assets/aistudio/silsilah_DIBAH_aa0f9d13.jpg',
  silsilahCakak: '/assets/aistudio/silsilah_CAKAK_7ed1e111.jpg',
} as const;

export const WHEEL_POSITIONS: WheelPosition[] = [
  {
    number: 1,
    imageLabel: 'Suami memanggil...',
    characterName: 'Suami (Saya / Pasangan Istri)',
    lampungTerm: 'Sikindua / Sikamdua',
    angleDeg: 231.43,
    generationTier: 'Generasi Inti (Sejajar)',
    tutokhVariants: 'Sikindua, Sikamdua, Saya / Suami',
    explanation:
      'Dalam bagan Silsilah Lampung, posisi Suami atau kepala keluarga inti disebut Sikindua / Sikamdua. Ia memanggil istrinya Enggom, memanggil kedua orang tuanya Bapak/Bak dan Emak, serta menyapa saudara ayahnya sesuai urutan usia seperti Mamak atau Induk Balak.',
    matrixNotes:
      'Pada piringan bawah nomor 1 (arah jam 7:30) terdapat karakter Suami. Saat panah biru "PILIH OBJEK" menunjuk nomor 1, ke-14 jendela balon pada roda merah atas menampilkan panggilan seluruh anggota keluarga kepada Suami.',
    silsilahReference: 'keduanya',
    silsilahNote:
      'Menjadi titik poros tengah (kotak kuning) baik pada bagan Silsilah Cakak (garis ke atas) maupun Silsilah Dibah (garis saudara & keturunan ke bawah).',
  },
  {
    number: 2,
    imageLabel: 'Istri memanggil...',
    characterName: 'Istri (Pasangan Suami)',
    lampungTerm: 'Enggom',
    angleDeg: 257.14,
    generationTier: 'Generasi Inti (Sejajar)',
    tutokhVariants: 'Enggom, Pasangan Suami',
    explanation:
      'Enggom merupakan sebutan bagi istri atau pasangan suami dalam keluarga Lampung. Dalam tata sapaan adat, istri memanggil suaminya Sikindua/Sikamdua, memanggil kedua orang tua suaminya Bapak dan Emak (Mentuha), serta menyesuaikan sapaan dengan keluarga besar suami.',
    matrixNotes:
      'Pada piringan bawah nomor 2 (tepat di bawah garis jam 9) terdapat karakter Istri. Saat panah biru "PILIH OBJEK" menunjuk nomor 2, jendela balon kata menampilkan sapaan ke-14 kerabat terhadap Istri.',
    silsilahReference: 'keduanya',
    silsilahNote:
      'Tercantum sejajar bersama Suami di dalam kotak kuning pada Silsilah Cakak dan Silsilah Dibah sebagai pasangan inti (Enggom).',
  },
  {
    number: 3,
    imageLabel: 'Ayah memanggil...',
    characterName: 'Ayah Kandung',
    lampungTerm: 'Bapak / Bak',
    angleDeg: 282.86,
    generationTier: 'Tingkat Apak Kemaman (+1)',
    tutokhVariants: 'Buya, Apak, Amak, Bak, Bapak, Uwak, Ama',
    explanation:
      'Tutokh hulun tuha ragah atau panggilan kepada orang tua laki-laki dalam masyarakat Lampung adalah Bapak, Bak, Apak, Buya, Ama, atau Uwak. Ayah memanggil anak laki-lakinya Anak Bakas dan menantu perempuannya Mantu.',
    matrixNotes:
      'Pada piringan bawah nomor 3 (tepat di atas garis jam 9) tertera karakter Ayah. Panah biru yang berhenti di nomor 3 menampilkan panggilan seluruh kerabat kepada Ayah Kandung.',
    silsilahReference: 'keduanya',
    silsilahNote:
      'Tertera sebagai poros Ayah Kandung (Bapak / Bak) pada bagian atas Silsilah Dibah dan tingkat pertama di atas Suami pada Silsilah Cakak.',
  },
  {
    number: 4,
    imageLabel: 'Ibu memanggil...',
    characterName: 'Ibu Kandung',
    lampungTerm: 'Emak',
    angleDeg: 308.57,
    generationTier: 'Tingkat Apak Kemaman (+1)',
    tutokhVariants: 'Emak, Induk, Ina, Mak, Umi, Ibu',
    explanation:
      'Tutokh hulun tuha sebai atau panggilan bagi orang tua perempuan adalah Emak, Induk, Ina, Mak, Umi, atau Ibu. Ibu memanggil adik ipar laki-lakinya Lah dan adik ipar perempuannya Pekhading.',
    matrixNotes:
      'Pada piringan bawah nomor 4 (arah jam 10) tertera karakter Ibu. Arahkan panah biru ke nomor 4 untuk melihat sapaan masing-masing anggota keluarga kepada Ibu.',
    silsilahReference: 'keduanya',
    silsilahNote:
      'Tertera pada bagan Silsilah Dibah dan Silsilah Cakak sebagai Ibu / Pasangan Ayah (Emak).',
  },
  {
    number: 5,
    imageLabel: 'Paman memanggil...',
    characterName: 'Paman (Adik Kandung Ayah)',
    lampungTerm: 'Mamak / Kemaman',
    angleDeg: 334.29,
    generationTier: 'Tingkat Apak Kemaman (+1)',
    tutokhVariants: 'Mamak, Kemaman, Inik, Pak Lunik',
    explanation:
      'Mamak atau Kemaman adalah sebutan untuk paman, khususnya adik laki-laki dari ayah maupun ibu (juga disebut Pak Lunik atau Inik). Kepada anak kakaknya (keponakan), paman memanggil dengan sebutan Nakan atau Kemenakan.',
    matrixNotes:
      'Pada piringan bawah nomor 5 tertulis "Adik Kandung Ayah" (arah jam 11), sedangkan pada roda merah atas berlabel nomor 5 "Paman memanggil...".',
    silsilahReference: 'cakak',
    silsilahNote:
      'Pada Silsilah Cakak terlihat di sisi kanan Ayah/Ibu sebagai Adik Kandung Ayah dengan sebutan Mamak.',
  },
  {
    number: 6,
    imageLabel: 'Adik Ipar Ayah memanggil...',
    characterName: 'Adik Ipar Ayah (Pasangan Paman)',
    lampungTerm: 'Ina Lunik / Keminan',
    angleDeg: 0,
    generationTier: 'Tingkat Apak Kemaman (+1)',
    tutokhVariants: 'Ina Lunik, Minan, Keminan, Ibung',
    explanation:
      'Ina Lunik (atau Minan / Keminan / Ibung) adalah sebutan untuk bibi atau istri dari adik kandung ayah (paman). Dalam silsilah keluarga besar, Ina Lunik menyapa keponakan sebagai Nakan dan menyapa kakak iparnya Abang/Puakhi.',
    matrixNotes:
      'Pada piringan bawah nomor 6 (tepat di posisi jam 12 / paling atas) tertulis "Adik Ipar Ayah".',
    silsilahReference: 'cakak',
    silsilahNote:
      'Pada Silsilah Cakak ditunjukkan di kanan bawah tingkat orang tua sebagai pasangan Mamak (Adik Ipar Ayah / Pasangan Paman) dengan sebutan Ina Lunik.',
  },
  {
    number: 7,
    imageLabel: 'Abang Ipar Ayah memanggil...',
    characterName: 'Abang Ipar Ayah (Suami Kakak Ayah)',
    lampungTerm: 'Bapak Balak / Wo',
    angleDeg: 25.71,
    generationTier: 'Tingkat Apak Kemaman (+1)',
    tutokhVariants: 'Bapak Balak, Pak Balak, Wo, Wak',
    explanation:
      'Bapak Balak (atau Wo) adalah panggilan kehormatan untuk kakak laki-laki ayah maupun suami dari kakak perempuan ayah. Istilah "balak" menandakan kedudukan lebih tua di atas orang tua kita.',
    matrixNotes:
      'Pada piringan bawah nomor 7 (arah jam 1) tertulis "Abang Ipar Ayah". Saat roda pada posisi awal (0°), panah biru "PILIH OBJEK" menunjuk langsung ke nomor 7 ini.',
    silsilahReference: 'cakak',
    silsilahNote:
      'Ditunjukkan pada Silsilah Cakak di sisi kiri sebagai Suami dari Kakak Kandung Ayah dengan sebutan Bapak Balak.',
  },
  {
    number: 8,
    imageLabel: 'Kakak Kandung Ayah memanggil...',
    characterName: 'Kakak Kandung Ayah',
    lampungTerm: 'Induk Balak / Mak Wo',
    angleDeg: 51.43,
    generationTier: 'Tingkat Apak Kemaman (+1)',
    tutokhVariants: 'Induk Balak, Mak Wo, Benulung',
    explanation:
      'Induk Balak atau Mak Wo adalah panggilan untuk kakak perempuan dari ayah (maupun kakak perempuan ibu). Saudara laki-laki sekandungnya (ayah dan paman) ia sapa dengan sebutan Mahani.',
    matrixNotes:
      'Pada piringan bawah nomor 8 (arah jam 1:45) tertulis "Kakak Kandung Ayah".',
    silsilahReference: 'cakak',
    silsilahNote:
      'Terlihat jelas pada Silsilah Cakak sebagai Kakak Kandung Ayah dengan sebutan Induk Balak, berpasangan dengan Bapak Balak.',
  },
  {
    number: 9,
    imageLabel: 'Kakek memanggil...',
    characterName: 'Kakek Kandung',
    lampungTerm: 'Tamong / Mekhuwai',
    angleDeg: 77.14,
    generationTier: 'Tingkat Umpu / Appeu (+2)',
    tutokhVariants: 'Tamong, Mekhuwai, Datuk, Sidi, Ateh, Umpu',
    explanation:
      'Dalam adat Lampung, kakek (ayah dari ayah atau ayah dari ibu) disebut Tamong (dialek pesisir), Datuk, atau Sidi. Di beberapa ragam silsilah, kakek dari pihak ayah disebut Mekhuwai/Makhuwai (sapaan timbal balik sesama jenis kelamin), dan kepada cucunya kakek menyapa Umpu atau Tamong.',
    matrixNotes:
      'Pada piringan bawah nomor 9 (tepat di atas garis jam 3) tertulis "Kakek".',
    silsilahReference: 'cakak',
    silsilahNote:
      'Pada Silsilah Cakak jalur ayah kakek tercatat Mekhuwai, sedangkan pada jalur ibu tercatat Tamong.',
  },
  {
    number: 10,
    imageLabel: 'Nenek memanggil...',
    characterName: 'Nenek Kandung',
    lampungTerm: 'Kajong / Enggom',
    angleDeg: 102.86,
    generationTier: 'Tingkat Umpu / Appeu (+2)',
    tutokhVariants: 'Kajong, Kajjong, Ateh, Nenek, Ambai, Siti, Tu',
    explanation:
      'Nenek (ibu dari ayah atau ibu dari ibu) disapa Kajong / Kajjong, Ambai, Ateh, atau Nenek. Kajong juga merupakan panggilan timbal balik antara kakek/nenek dengan cucu yang berlainan jenis kelamin, selain panggilan umum Umpu atau Tuwah.',
    matrixNotes:
      'Pada piringan bawah nomor 10 (tepat di bawah garis jam 3) tertulis "Nenek".',
    silsilahReference: 'cakak',
    silsilahNote:
      'Pada Silsilah Cakak jalur ibu tercatat Kajong, dan pada jalur ayah tercatat Enggom sebagai pasangan Mekhuwai.',
  },
  {
    number: 11,
    imageLabel: 'Buyut Putra memanggil...',
    characterName: 'Buyut Putra (Orang Tua Kakek/Nenek)',
    lampungTerm: 'Tuyuk Bakas',
    angleDeg: 128.57,
    generationTier: 'Tingkat Tuyuk (+3)',
    tutokhVariants: 'Tuyuk Bakas, Tuyuk',
    explanation:
      'Tuyuk Bakas adalah sebutan untuk buyut laki-laki (ayah dari kakek atau nenek). Istilah Tuyuk bersifat timbal balik antara generasi buyut dan cicit (anak dari cucu).',
    matrixNotes:
      'Pada piringan bawah nomor 11 (arah jam 4:15) tertulis "Buyut Putra".',
    silsilahReference: 'cakak',
    silsilahNote:
      'Pada Silsilah Cakak berada satu tingkat di atas Kakek/Nenek dengan keterangan Buyut Pria: Tuyuk Bakas.',
  },
  {
    number: 12,
    imageLabel: 'Buyut Putri memanggil...',
    characterName: 'Buyut Putri (Ibu Kakek/Nenek)',
    lampungTerm: 'Tuyuk Bebai',
    angleDeg: 154.29,
    generationTier: 'Tingkat Tuyuk (+3)',
    tutokhVariants: 'Tuyuk Bebai, Tuyuk',
    explanation:
      'Tuyuk Bebai adalah sebutan untuk buyut perempuan (ibu dari kakek atau nenek). Kata "bebai" berarti perempuan dalam bahasa Lampung, dan kepada cicitnya ia juga memanggil Tuyuk.',
    matrixNotes:
      'Pada piringan bawah nomor 12 (arah jam 5) tertulis "Buyut Putri".',
    silsilahReference: 'cakak',
    silsilahNote:
      'Pada Silsilah Cakak tertulis Buyut Putri / Ibu Kakek: Tuyuk Bebai.',
  },
  {
    number: 13,
    imageLabel: 'Kakek Buyut memanggil...',
    characterName: 'Kakek Buyut (Mbah Buyut Pria)',
    lampungTerm: 'Gekhinung / Canggah',
    angleDeg: 180,
    generationTier: 'Tingkat Gekhinung / Canggah (+4)',
    tutokhVariants: 'Gekhinung, Canggah, Tuyuk',
    explanation:
      'Gekhinung (atau Canggah) adalah sebutan untuk orang tua dari buyut (bapaknya buyut / kakeknya kakek), yaitu empat generasi ke atas dari kita. Panggilan ini berlaku timbal balik ke generasi canggah di bawahnya.',
    matrixNotes:
      'Pada piringan bawah nomor 13 (tepat di posisi jam 6 / paling bawah) tertulis "Kakek Buyut".',
    silsilahReference: 'cakak',
    silsilahNote:
      'Pada puncak bagan Silsilah Cakak tertulis Mbah Buyut Pria: Gekhinung.',
  },
  {
    number: 14,
    imageLabel: 'Nenek Buyut memanggil...',
    characterName: 'Nenek Buyut (Mbah Buyut Putri)',
    lampungTerm: 'Gekhinung / Canggah',
    angleDeg: 205.71,
    generationTier: 'Tingkat Gekhinung / Canggah (+4)',
    tutokhVariants: 'Gekhinung, Canggah, Tuyuk',
    explanation:
      'Gekhinung (atau Canggah) pada posisi ini merujuk kepada nenek buyut perempuan (ibu dari buyut / ibunya neneknya ibu). Posisi ini menempati sektor nomor 14 pada piringan roda kekerabatan.',
    matrixNotes:
      'Pada piringan bawah nomor 14 (arah jam 7) tertulis "Nenek Buyut".',
    silsilahReference: 'cakak',
    silsilahNote:
      'Pada puncak bagan Silsilah Cakak tertulis Mbah Buyut Putri: Gekhinung, sejajar dengan Kakek Buyut.',
  },
];

// Matriks sapaan timbal balik 14x14 (baris = penyapa 1..14, kolom = objek yang dipanggil 1..14)
export const KINSHIP_CALL_MATRIX: Record<number, Record<number, { term: string; note: string }>> = {
  1: {
    1: { term: 'Sikindua (Diri Sendiri)', note: 'Posisi penutur utama (Suami / Saya).' },
    2: { term: 'Enggom', note: 'Panggilan suami kepada istri / pasangan hidup.' },
    3: { term: 'Bapak / Bak', note: 'Tutokh kepada ayah kandung.' },
    4: { term: 'Emak', note: 'Tutokh kepada ibu kandung.' },
    5: { term: 'Mamak / Kemaman', note: 'Panggilan untuk adik laki-laki ayah (paman).' },
    6: { term: 'Ina Lunik / Keminan', note: 'Panggilan untuk istri paman / adik ipar ayah.' },
    7: { term: 'Bapak Balak / Wo', note: 'Panggilan untuk suami kakak perempuan ayah.' },
    8: { term: 'Induk Balak / Mak Wo', note: 'Panggilan untuk kakak perempuan kandung ayah.' },
    9: { term: 'Mekhuwai / Tamong', note: 'Panggilan cucu laki-laki kepada kakek kandung.' },
    10: { term: 'Enggom / Kajong', note: 'Panggilan kepada nenek kandung.' },
    11: { term: 'Tuyuk Bakas', note: 'Panggilan kepada buyut laki-laki.' },
    12: { term: 'Tuyuk Bebai', note: 'Panggilan kepada buyut perempuan.' },
    13: { term: 'Gekhinung', note: 'Panggilan kepada kakek buyut (canggah pria).' },
    14: { term: 'Gekhinung', note: 'Panggilan kepada nenek buyut (canggah wanita).' },
  },
  2: {
    1: { term: 'Sikindua / Sikamdua', note: 'Panggilan istri kepada suaminya.' },
    2: { term: 'Enggom (Diri Sendiri)', note: 'Posisi penutur sebagai Istri.' },
    3: { term: 'Bapak / Mentuha', note: 'Panggilan kepada ayah mertua.' },
    4: { term: 'Emak / Mentuha', note: 'Panggilan kepada ibu mertua.' },
    5: { term: 'Mamak', note: 'Panggilan kepada adik kandung ayah suami.' },
    6: { term: 'Ina Lunik', note: 'Panggilan kepada istri dari adik ayah suami.' },
    7: { term: 'Bapak Balak', note: 'Panggilan kepada suami kakak ayah suami.' },
    8: { term: 'Induk Balak', note: 'Panggilan kepada kakak kandung ayah suami.' },
    9: { term: 'Tamong / Mekhuwai', note: 'Panggilan kepada kakek dari pihak suami.' },
    10: { term: 'Kajong / Enggom', note: 'Panggilan kepada nenek dari pihak suami.' },
    11: { term: 'Tuyuk', note: 'Panggilan kepada buyut putra keluarga.' },
    12: { term: 'Tuyuk', note: 'Panggilan kepada buyut putri keluarga.' },
    13: { term: 'Gekhinung', note: 'Panggilan kepada kakek buyut.' },
    14: { term: 'Gekhinung', note: 'Panggilan kepada nenek buyut.' },
  },
  3: {
    1: { term: 'Anak Bakas / Anak', note: 'Ayah memanggil putra kandungnya.' },
    2: { term: 'Mantu', note: 'Ayah memanggil menantu perempuannya.' },
    3: { term: 'Bapak (Diri Sendiri)', note: 'Posisi penutur sebagai Ayah.' },
    4: { term: 'Enggom', note: 'Ayah memanggil istrinya (Ibu).' },
    5: { term: 'Puakhi / Adek', note: 'Saudara laki-laki memanggil adik laki-laki sekandung.' },
    6: { term: 'Uyang', note: 'Panggilan kepada istri dari adik laki-laki kandung.' },
    7: { term: 'Bunting', note: 'Panggilan kepada suami dari kakak perempuan kandung (abang ipar).' },
    8: { term: 'Nakbai', note: 'Saudara laki-laki memanggil saudara perempuan sekandung.' },
    9: { term: 'Bapak / Bak', note: 'Ayah memanggil ayahnya sendiri (Kakek).' },
    10: { term: 'Emak', note: 'Ayah memanggil ibunya sendiri (Nenek).' },
    11: { term: 'Tamong / Mekhuwai', note: 'Ayah memanggil kakeknya (Buyut Putra).' },
    12: { term: 'Kajong / Enggom', note: 'Ayah memanggil neneknya (Buyut Putri).' },
    13: { term: 'Tuyuk', note: 'Ayah memanggil buyut prianya (Kakek Buyut).' },
    14: { term: 'Tuyuk', note: 'Ayah memanggil buyut putrinya (Nenek Buyut).' },
  },
  4: {
    1: { term: 'Anak', note: 'Ibu memanggil putra kandungnya.' },
    2: { term: 'Mantu', note: 'Ibu memanggil menantu perempuannya.' },
    3: { term: 'Sikindua / Sikamdua', note: 'Ibu memanggil suaminya (Ayah).' },
    4: { term: 'Emak (Diri Sendiri)', note: 'Posisi penutur sebagai Ibu.' },
    5: { term: 'Lah / Adik', note: 'Panggilan istri terhadap adik laki-laki suami.' },
    6: { term: 'Pekhading', note: 'Sebutan terhadap istri pendatang dari adik laki-laki suami.' },
    7: { term: 'Bunting', note: 'Panggilan kepada suami dari kakak perempuan suami.' },
    8: { term: 'Nakbai / Kelepah', note: 'Panggilan kepada kakak perempuan suami.' },
    9: { term: 'Bapak / Mentuha', note: 'Ibu memanggil ayah mertuanya (Kakek).' },
    10: { term: 'Emak / Mentuha', note: 'Ibu memanggil ibu mertuanya (Nenek).' },
    11: { term: 'Tamong', note: 'Ibu memanggil kakek suami (Buyut Putra).' },
    12: { term: 'Kajong', note: 'Ibu memanggil nenek suami (Buyut Putri).' },
    13: { term: 'Tuyuk', note: 'Ibu memanggil kakek buyut.' },
    14: { term: 'Tuyuk', note: 'Ibu memanggil nenek buyut.' },
  },
  5: {
    1: { term: 'Nakan', note: 'Paman memanggil anak dari abangnya (keponakan).' },
    2: { term: 'Mantu', note: 'Paman memanggil istri dari keponakannya.' },
    3: { term: 'Abang / Puakhi', note: 'Adik laki-laki memanggil kakak laki-laki sekandungnya.' },
    4: { term: 'Uyang', note: 'Panggilan terhadap istri dari kakak laki-laki kandung.' },
    5: { term: 'Mamak (Diri Sendiri)', note: 'Posisi penutur sebagai Paman (Adik Kandung Ayah).' },
    6: { term: 'Enggom', note: 'Paman memanggil istrinya sendiri.' },
    7: { term: 'Bunting', note: 'Panggilan kepada suami kakak perempuannya.' },
    8: { term: 'Nakbai', note: 'Panggilan saudara laki-laki kepada kakak perempuannya.' },
    9: { term: 'Bapak', note: 'Paman memanggil ayahnya sendiri (Kakek).' },
    10: { term: 'Emak', note: 'Paman memanggil ibunya sendiri (Nenek).' },
    11: { term: 'Tamong', note: 'Paman memanggil kakeknya (Buyut Putra).' },
    12: { term: 'Kajong', note: 'Paman memanggil neneknya (Buyut Putri).' },
    13: { term: 'Tuyuk', note: 'Paman memanggil buyutnya (Kakek Buyut).' },
    14: { term: 'Tuyuk', note: 'Paman memanggil buyutnya (Nenek Buyut).' },
  },
  6: {
    1: { term: 'Nakan', note: 'Adik ipar ayah (bibi) memanggil keponakan.' },
    2: { term: 'Mantu', note: 'Bibi memanggil menantu keponakannya.' },
    3: { term: 'Abang / Puakhi', note: 'Adik ipar memanggil abang kandung suaminya.' },
    4: { term: 'Pekhading', note: 'Sesama istri pendatang dari saudara laki-laki kandung.' },
    5: { term: 'Sikindua', note: 'Istri memanggil suaminya (Paman).' },
    6: { term: 'Ina Lunik (Diri Sendiri)', note: 'Posisi penutur sebagai Adik Ipar Ayah.' },
    7: { term: 'Bunting', note: 'Panggilan kepada abang ipar.' },
    8: { term: 'Nakbai', note: 'Panggilan kepada kakak perempuan suami.' },
    9: { term: 'Bapak', note: 'Panggilan kepada ayah mertua (Kakek).' },
    10: { term: 'Emak', note: 'Panggilan kepada ibu mertua (Nenek).' },
    11: { term: 'Tamong', note: 'Panggilan kepada kakek suami (Buyut Putra).' },
    12: { term: 'Kajong', note: 'Panggilan kepada nenek suami (Buyut Putri).' },
    13: { term: 'Tuyuk', note: 'Panggilan kepada kakek buyut.' },
    14: { term: 'Tuyuk', note: 'Panggilan kepada nenek buyut.' },
  },
  7: {
    1: { term: 'Nakan', note: 'Abang ipar ayah memanggil keponakan laki-laki.' },
    2: { term: 'Mantu', note: 'Abang ipar ayah memanggil istri keponakan.' },
    3: { term: 'Puakhi / Lakau', note: 'Panggilan kepada saudara laki-laki pihak istri.' },
    4: { term: 'Pekhading', note: 'Panggilan kepada istri saudara laki-laki istri.' },
    5: { term: 'Puakhi / Adik', note: 'Panggilan kepada adik laki-laki pihak istri.' },
    6: { term: 'Pekhading', note: 'Panggilan kepada istri dari adik pihak istri.' },
    7: { term: 'Bapak Balak (Diri Sendiri)', note: 'Posisi penutur sebagai Abang Ipar Ayah.' },
    8: { term: 'Enggom', note: 'Suami memanggil istrinya (Kakak Kandung Ayah).' },
    9: { term: 'Bapak / Mentuha', note: 'Panggilan kepada ayah mertua (Kakek).' },
    10: { term: 'Emak / Mentuha', note: 'Panggilan kepada ibu mertua (Nenek).' },
    11: { term: 'Tamong', note: 'Panggilan kepada kakek dari pihak istri.' },
    12: { term: 'Kajong', note: 'Panggilan kepada nenek dari pihak istri.' },
    13: { term: 'Tuyuk', note: 'Panggilan kepada kakek buyut pihak istri.' },
    14: { term: 'Tuyuk', note: 'Panggilan kepada nenek buyut pihak istri.' },
  },
  8: {
    1: { term: 'Nakan', note: 'Kakak kandung ayah memanggil keponakan.' },
    2: { term: 'Mantu', note: 'Kakak kandung ayah memanggil istri keponakan.' },
    3: { term: 'Mahani', note: 'Saudara perempuan memanggil saudara laki-laki sekandungnya.' },
    4: { term: 'Uyang', note: 'Panggilan kepada istri dari saudara laki-laki kandung.' },
    5: { term: 'Mahani', note: 'Saudara perempuan memanggil adik laki-laki sekandungnya.' },
    6: { term: 'Uyang', note: 'Panggilan kepada istri dari adik laki-laki kandung.' },
    7: { term: 'Sikindua', note: 'Istri memanggil suaminya (Abang Ipar Ayah).' },
    8: { term: 'Induk Balak (Diri Sendiri)', note: 'Posisi penutur sebagai Kakak Kandung Ayah.' },
    9: { term: 'Bapak', note: 'Memanggil ayahnya sendiri (Kakek).' },
    10: { term: 'Emak', note: 'Memanggil ibunya sendiri (Nenek).' },
    11: { term: 'Tamong', note: 'Memanggil kakeknya (Buyut Putra).' },
    12: { term: 'Kajong', note: 'Memanggil neneknya (Buyut Putri).' },
    13: { term: 'Tuyuk', note: 'Memanggil buyut prianya (Kakek Buyut).' },
    14: { term: 'Tuyuk', note: 'Memanggil buyut putrinya (Nenek Buyut).' },
  },
  9: {
    1: { term: 'Umpu Bakas / Tamong', note: 'Kakek memanggil cucu laki-laki (sesama jenis kelamin dapat disebut Tamong).' },
    2: { term: 'Mantu / Kajong', note: 'Kakek memanggil istri cucunya.' },
    3: { term: 'Anak', note: 'Kakek memanggil putra kandungnya (Ayah).' },
    4: { term: 'Mantu', note: 'Kakek memanggil menantu perempuannya (Ibu).' },
    5: { term: 'Anak', note: 'Kakek memanggil putra kandungnya (Paman).' },
    6: { term: 'Mantu', note: 'Kakek memanggil menantu perempuannya (Adik Ipar Ayah).' },
    7: { term: 'Mantu', note: 'Kakek memanggil menantu laki-lakinya (Abang Ipar Ayah).' },
    8: { term: 'Anak', note: 'Kakek memanggil putri kandungnya (Kakak Kandung Ayah).' },
    9: { term: 'Tamong (Diri Sendiri)', note: 'Posisi penutur sebagai Kakek.' },
    10: { term: 'Enggom', note: 'Kakek memanggil istrinya (Nenek).' },
    11: { term: 'Bapak', note: 'Kakek memanggil ayahnya sendiri (Buyut Putra).' },
    12: { term: 'Emak', note: 'Kakek memanggil ibunya sendiri (Buyut Putri).' },
    13: { term: 'Tamong', note: 'Kakek memanggil kakeknya (Kakek Buyut).' },
    14: { term: 'Kajong', note: 'Kakek memanggil neneknya (Nenek Buyut).' },
  },
  10: {
    1: { term: 'Umpu Bakas / Kajong', note: 'Nenek memanggil cucu laki-laki (lain jenis kelamin disebut Kajong).' },
    2: { term: 'Mantu / Tamong', note: 'Nenek memanggil cucu menantu perempuan.' },
    3: { term: 'Anak', note: 'Nenek memanggil putra kandungnya (Ayah).' },
    4: { term: 'Mantu', note: 'Nenek memanggil menantunya (Ibu).' },
    5: { term: 'Anak', note: 'Nenek memanggil putra kandungnya (Paman).' },
    6: { term: 'Mantu', note: 'Nenek memanggil menantunya.' },
    7: { term: 'Mantu', note: 'Nenek memanggil menantunya.' },
    8: { term: 'Anak', note: 'Nenek memanggil putri kandungnya.' },
    9: { term: 'Sikindua / Sikamdua', note: 'Nenek memanggil suaminya (Kakek).' },
    10: { term: 'Kajong (Diri Sendiri)', note: 'Posisi penutur sebagai Nenek.' },
    11: { term: 'Bapak / Mentuha', note: 'Nenek memanggil ayah mertuanya (Buyut Putra).' },
    12: { term: 'Emak / Mentuha', note: 'Nenek memanggil ibu mertuanya (Buyut Putri).' },
    13: { term: 'Tamong', note: 'Nenek memanggil kakek buyut.' },
    14: { term: 'Kajong', note: 'Nenek memanggil nenek buyut.' },
  },
  11: {
    1: { term: 'Tuyuk', note: 'Buyut memanggil cicitnya (panggilan timbal balik).' },
    2: { term: 'Mantu / Tuyuk', note: 'Buyut memanggil istri cicit.' },
    3: { term: 'Umpu / Tamong', note: 'Buyut putra memanggil cucu laki-lakinya (Ayah).' },
    4: { term: 'Mantu / Kajong', note: 'Buyut putra memanggil menantu cucunya.' },
    5: { term: 'Umpu / Tamong', note: 'Buyut putra memanggil cucu laki-lakinya.' },
    6: { term: 'Mantu', note: 'Buyut putra memanggil istri cucu.' },
    7: { term: 'Mantu', note: 'Buyut putra memanggil suami cucu.' },
    8: { term: 'Umpu / Kajong', note: 'Buyut putra memanggil cucu perempuannya.' },
    9: { term: 'Anak', note: 'Buyut putra memanggil anak kandungnya (Kakek).' },
    10: { term: 'Mantu', note: 'Buyut putra memanggil menantunya (Nenek).' },
    11: { term: 'Tuyuk Bakas (Diri Sendiri)', note: 'Posisi penutur sebagai Buyut Putra.' },
    12: { term: 'Enggom', note: 'Buyut putra memanggil istrinya (Buyut Putri).' },
    13: { term: 'Bapak', note: 'Buyut putra memanggil ayahnya (Kakek Buyut).' },
    14: { term: 'Emak', note: 'Buyut putra memanggil ibunya (Nenek Buyut).' },
  },
  12: {
    1: { term: 'Tuyuk', note: 'Buyut putri memanggil cicitnya (timbal balik).' },
    2: { term: 'Mantu / Tuyuk', note: 'Buyut putri memanggil pasangan cicitnya.' },
    3: { term: 'Umpu / Kajong', note: 'Buyut putri memanggil cucu laki-laki (Ayah).' },
    4: { term: 'Mantu', note: 'Buyut putri memanggil pasangan cucunya.' },
    5: { term: 'Umpu / Kajong', note: 'Buyut putri memanggil cucu laki-laki.' },
    6: { term: 'Mantu', note: 'Buyut putri memanggil pasangan cucu.' },
    7: { term: 'Mantu', note: 'Buyut putri memanggil pasangan cucu.' },
    8: { term: 'Umpu / Tamong', note: 'Buyut putri memanggil cucu perempuannya.' },
    9: { term: 'Anak', note: 'Buyut putri memanggil anak kandungnya (Kakek).' },
    10: { term: 'Mantu', note: 'Buyut putri memanggil menantunya (Nenek).' },
    11: { term: 'Sikindua / Sikamdua', note: 'Buyut putri memanggil suaminya (Buyut Putra).' },
    12: { term: 'Tuyuk Bebai (Diri Sendiri)', note: 'Posisi penutur sebagai Buyut Putri.' },
    13: { term: 'Bapak / Mentuha', note: 'Buyut putri memanggil ayah mertuanya (Kakek Buyut).' },
    14: { term: 'Emak / Mentuha', note: 'Buyut putri memanggil ibu mertuanya (Nenek Buyut).' },
  },
  13: {
    1: { term: 'Gekhinung', note: 'Kakek buyut memanggil generasi ke-4 di bawahnya (timbal balik).' },
    2: { term: 'Gekhinung', note: 'Kakek buyut memanggil pasangan generasi ke-4.' },
    3: { term: 'Tuyuk', note: 'Kakek buyut memanggil cicitnya (Ayah).' },
    4: { term: 'Tuyuk', note: 'Kakek buyut memanggil menantu cicit (Ibu).' },
    5: { term: 'Tuyuk', note: 'Kakek buyut memanggil cicitnya (Paman).' },
    6: { term: 'Tuyuk', note: 'Kakek buyut memanggil menantu cicit.' },
    7: { term: 'Tuyuk', note: 'Kakek buyut memanggil menantu cicit.' },
    8: { term: 'Tuyuk', note: 'Kakek buyut memanggil cicit perempuannya.' },
    9: { term: 'Umpu / Tamong', note: 'Kakek buyut memanggil cucu laki-lakinya (Kakek).' },
    10: { term: 'Mantu / Kajong', note: 'Kakek buyut memanggil menantu cucunya (Nenek).' },
    11: { term: 'Anak', note: 'Kakek buyut memanggil anak kandungnya (Buyut Putra).' },
    12: { term: 'Mantu', note: 'Kakek buyut memanggil menantunya (Buyut Putri).' },
    13: { term: 'Gekhinung (Diri Sendiri)', note: 'Posisi penutur sebagai Kakek Buyut.' },
    14: { term: 'Enggom', note: 'Kakek buyut memanggil istrinya (Nenek Buyut).' },
  },
  14: {
    1: { term: 'Gekhinung', note: 'Nenek buyut memanggil generasi ke-4 di bawahnya (timbal balik).' },
    2: { term: 'Gekhinung', note: 'Nenek buyut memanggil pasangan generasi ke-4.' },
    3: { term: 'Tuyuk', note: 'Nenek buyut memanggil cicitnya (Ayah).' },
    4: { term: 'Tuyuk', note: 'Nenek buyut memanggil menantu cicit (Ibu).' },
    5: { term: 'Tuyuk', note: 'Nenek buyut memanggil cicitnya (Paman).' },
    6: { term: 'Tuyuk', note: 'Nenek buyut memanggil menantu cicit.' },
    7: { term: 'Tuyuk', note: 'Nenek buyut memanggil menantu cicit.' },
    8: { term: 'Tuyuk', note: 'Nenek buyut memanggil cicit perempuannya.' },
    9: { term: 'Umpu / Kajong', note: 'Nenek buyut memanggil cucu laki-lakinya (Kakek).' },
    10: { term: 'Mantu / Tamong', note: 'Nenek buyut memanggil menantu cucunya (Nenek).' },
    11: { term: 'Anak', note: 'Nenek buyut memanggil anak kandungnya (Buyut Putra).' },
    12: { term: 'Mantu', note: 'Nenek buyut memanggil menantunya (Buyut Putri).' },
    13: { term: 'Sikindua / Sikamdua', note: 'Nenek buyut memanggil suaminya (Kakek Buyut).' },
    14: { term: 'Gekhinung (Diri Sendiri)', note: 'Posisi penutur sebagai Nenek Buyut.' },
  },
};

export function getKinshipCall(speakerNumber: number, targetNumber: number) {
  const row = KINSHIP_CALL_MATRIX[speakerNumber];
  if (row && row[targetNumber]) {
    return row[targetNumber];
  }
  return {
    term: '-',
    note: FALLBACK_EXPLANATION,
  };
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  {
    id: 'lintas-generasi',
    title: '1. Garis Keturunan Lintas Generasi',
    subtitle: 'Sapaan antargenerasi ke atas (leluhur) maupun ke bawah (keturunan).',
    entries: [
      { term: 'Gekhinung / Canggah', meaning: 'Panggilan terhadap orang tuanya kakek buyut atau nenek buyut (empat tingkat ke atas).' },
      { term: 'Tuyuk', meaning: 'Sebutan timbal balik antara cicit dengan orang tua dari kakek/nenek (buyut).' },
      { term: 'Umpu / Uppu', meaning: 'Sebutan untuk kakek atau nenek, serta dipakai secara timbal balik oleh kakek/nenek kepada cucunya.' },
      { term: 'Kemaman / Mamak', meaning: 'Sebutan untuk paman (saudara laki-laki dari ayah maupun ibu).' },
      { term: 'Keminan / Ibung', meaning: 'Sebutan untuk bibi (saudara perempuan dari ayah maupun ibu).' },
      { term: 'Kemenakan / Nakan', meaning: 'Sebutan untuk keponakan (anak dari kakak atau adik).' },
    ],
  },
  {
    id: 'saudara-sekandung',
    title: '2. Hubungan Saudara Sekandung & Ipar',
    subtitle: 'Sapaan antar-saudara dibedakan menurut jenis kelamin penyapa dan yang disapa.',
    entries: [
      { term: 'Puakhi', meaning: 'Sebutan yang digunakan sesama saudara laki-laki sekandung.' },
      { term: 'Kelepah', meaning: 'Sebutan yang digunakan sesama saudara perempuan sekandung.' },
      { term: 'Mahani / Mehani', meaning: 'Sebutan dari saudara perempuan kepada saudara laki-laki sekandungnya.' },
      { term: 'Nakbai', meaning: 'Sebutan dari saudara laki-laki kepada saudara perempuan sekandungnya.' },
      { term: 'Uyang', meaning: 'Istri dari saudara kandung laki-laki.' },
      { term: 'Bunting', meaning: 'Suami dari saudara kandung perempuan (abang/adik ipar).' },
      { term: 'Pekhading', meaning: 'Sebutan kepada istri pendatang dari saudara laki-laki kandung.' },
      { term: 'Lah', meaning: 'Panggilan terhadap adik laki-laki suami.' },
      { term: 'Lakau', meaning: 'Saudara laki-laki pihak istri atau suami bila suami semanda (mengikuti pihak istri).' },
      { term: 'Bunakbai', meaning: 'Bersaudara karena suaminya kakak-beradik.' },
      { term: 'Tiyuh', meaning: 'Keluarga asal istri metudau (istri mengikuti pihak suami).' },
    ],
  },
  {
    id: 'sepupu-besan',
    title: '3. Hubungan Sepupu, Besan & Mertua',
    subtitle: 'Penyebutan sepupu menurut jalur orang tua serta ikatan perkawinan.',
    entries: [
      { term: 'Kenubi', meaning: 'Hubungan sepupu yang berasal dari ibu yang bersaudara (anak bibi pihak ibu).' },
      { term: 'Benulung / Banulung', meaning: 'Hubungan sepupu yang merupakan anak dari saudara perempuan ayah.' },
      { term: 'Kelama / Kelamo', meaning: 'Sebutan terhadap saudara laki-laki ibu (paman dari pihak ibu) beserta keturunannya.' },
      { term: 'Lebu', meaning: 'Saudara atau keluarga dari nenek (kakeknya saudara laki-laki dari nenek).' },
      { term: 'Sabai / Sada', meaning: 'Sabai: besan sesama laki-laki atau lintas gender; Sada: besan sesama perempuan.' },
      { term: 'Mantu', meaning: 'Menantu (pasangan dari anak kandung).' },
      { term: 'Mentuha', meaning: 'Mertua (orang tua dari pasangan).' },
    ],
  },
  {
    id: 'tutokh',
    title: '4. Tutokh / Ukhauan / Cuwakan (Sapaan Sehari-hari)',
    subtitle: 'Kata sapaan berdasarkan posisi keluarga, dialek, urutan lahir, dan gelar adat (juluk/adok).',
    entries: [
      { term: 'Ayah (Tutokh Hulun Tuha Ragah)', meaning: 'Buya, Apak, Amak, Bak, Bapak, Ama, Akan, Uwak.' },
      { term: 'Ibu (Tutokh Hulun Tuha Sebai)', meaning: 'Emak, Induk, Ina, Mak, Umi, Ibu.' },
      { term: 'Kakak Laki-laki (Puwakhi Ragah)', meaning: 'Abang, Kiyai, Adin, Daing, Udo (tertua di Semaka), Udongah (kedua), atau sesuai juluk.' },
      { term: 'Kakak Perempuan (Puwakhi Bebai)', meaning: 'Ayuk, Atu, Uwo / Wo, Ngah (kedua), Kaka / Kakak, Ses, atau sesuai juluk.' },
      { term: 'Kakek & Nenek', meaning: 'Kakek: Tamong (pesisir), Mekhuwai, Ateh, Datuk, Sidi. Nenek: Kajong/Kajjong, Ambai, Ateh, Siti, Tu.' },
      { term: 'Paman & Bibi (Apak Kemaman)', meaning: 'Kakak ayah/ibu: Bapak Balak / Wo (pria), Induk Balak / Mak Wo (wanita). Adik ayah/ibu: Mamak / Pak Lunik (pria), Minan / Ina Lunik / Ibung (wanita).' },
      { term: 'Keponakan (Anak Kemenakan)', meaning: 'Tangama / Nakan (keponakan laki-laki), Tangina / Nakan (keponakan perempuan).' },
      { term: 'Sapaan Adat Penyimbang', meaning: 'Pun (pimpinan adat pria), Puniakan (anak penyimbang menikah), Batin / Ina Batin (putri sulung kepala adat), Inton (putri kedua), Cikwo (istri Udo), Cikngah (istri Udongah), Kaka (istri Abang).' },
    ],
  },
];

export const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Dalam sistem kekerabatan adat Lampung, apa sebutan yang digunakan sesama saudara laki-laki sekandung?',
    options: ['Puakhi', 'Kelepah', 'Nakbai', 'Mahani'],
    correctIndex: 0,
    explanation: 'Puakhi adalah sebutan sesama saudara laki-laki sekandung, sedangkan sesama saudara perempuan sekandung disebut Kelepah.',
  },
  {
    id: 'q2',
    question: 'Sebutan dari saudara perempuan kepada saudara laki-laki sekandungnya dalam budaya Lampung adalah...',
    options: ['Nakbai', 'Mahani', 'Mamak', 'Uyang'],
    correctIndex: 1,
    explanation: 'Saudara perempuan memanggil saudara laki-laki sekandungnya Mahani (Mehani), sedangkan saudara laki-laki memanggil saudara perempuannya Nakbai.',
  },
  {
    id: 'q3',
    question: 'Pada bagan Roda Pintar dan Silsilah Cakak, apa sebutan untuk adik laki-laki kandung ayah (paman)?',
    options: ['Bapak Balak', 'Mamak / Kemaman', 'Tamong', 'Bunting'],
    correctIndex: 1,
    explanation: 'Adik laki-laki dari ayah maupun ibu dipanggil Mamak, Kemaman, Inik, atau Pak Lunik.',
    imageUrl: WHEEL_ASSETS.silsilahCakak,
    imageCaption: 'Bagan Silsilah Cakak (Garis Keturunan Ke Atas)',
  },
  {
    id: 'q4',
    question: 'Apa sebutan untuk suami dari kakak perempuan ayah (Abang Ipar Ayah) pada bagan Silsilah Cakak?',
    options: ['Bapak Balak', 'Ina Lunik', 'Induk Balak', 'Mekhuwai'],
    correctIndex: 0,
    explanation: 'Suami dari kakak kandung ayah serta kakak laki-laki ayah dipanggil Bapak Balak atau Wo.',
  },
  {
    id: 'q5',
    question: 'Istilah yang digunakan secara timbal balik antara cicit dengan buyut (orang tua dari kakek/nenek) adalah...',
    options: ['Umpu', 'Tuyuk', 'Nakan', 'Sabai'],
    correctIndex: 1,
    explanation: 'Tuyuk merujuk pada hubungan timbal balik antara buyut (Tuyuk Bakas / Tuyuk Bebai) dan cicit.',
  },
  {
    id: 'q6',
    question: 'Pada Silsilah Dibah dan Roda Pintar nomor 1 dan 2, pasangan Suami dan Istri secara berturut-turut disebut...',
    options: ['Sikindua dan Enggom', 'Tamong dan Kajong', 'Mahani dan Nakbai', 'Bapak dan Emak'],
    correctIndex: 0,
    explanation: 'Suami (posisi 1) disebut Sikindua / Sikamdua, sedangkan Istri (posisi 2) disebut Enggom.',
    imageUrl: WHEEL_ASSETS.silsilahDibah,
    imageCaption: 'Bagan Silsilah Dibah (Garis Keluarga Sejajar & Ke Bawah)',
  },
  {
    id: 'q7',
    question: 'Manakah yang merupakan sebutan bagi kakek dalam dialek pesisir Lampung?',
    options: ['Tamong', 'Kajong', 'Kelama', 'Pekhading'],
    correctIndex: 0,
    explanation: 'Kakek dalam dialek pesisir disebut Tamong (atau Datuk, Sidi, Ateh), sedangkan nenek disebut Kajong / Kajjong.',
  },
  {
    id: 'q8',
    question: 'Sebutan untuk hubungan sepupu yang ibunya bersaudara dengan ibu kita (anak bibi dari pihak ibu) adalah...',
    options: ['Kenubi', 'Banulung', 'Lebu', 'Mantu'],
    correctIndex: 0,
    explanation: 'Kenubi adalah sepupu dari ibu yang bersaudara, sedangkan Banulung (Benulung) berasal dari saudara perempuan ayah.',
  },
  {
    id: 'q9',
    question: 'Bagaimana ayah dan ibu memanggil pasangan dari anak kandungnya (menantu)?',
    options: ['Sabai', 'Mantu', 'Mentuha', 'Nakan'],
    correctIndex: 1,
    explanation: 'Mantu berarti menantu, Mentuha berarti mertua, dan Sabai berarti besan.',
  },
  {
    id: 'q10',
    question: 'Tingkat generasi di atas Buyut (orang tuanya kakek buyut / nenek buyut) pada Silsilah Cakak disebut...',
    options: ['Gekhinung', 'Umpu', 'Tanggama', 'Kemaman'],
    correctIndex: 0,
    explanation: 'Gekhinung (atau Canggah) berada satu tingkat di atas Tuyuk (Buyut) pada puncak Silsilah Cakak.',
  },
];
