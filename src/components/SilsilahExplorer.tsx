import React, { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import {
  GLOSSARY_CATEGORIES,
  WHEEL_ASSETS,
  WHEEL_POSITIONS,
  getKinshipCall,
} from '../data/kinshipData';

type AssetKey = 'silsilahCakak' | 'silsilahDibah';

const ASSET_OPTIONS: { key: AssetKey; label: string; caption: string }[] = [
  {
    key: 'silsilahCakak',
    label: 'Silsilah Ke Atas (Cakak)',
    caption:
      'Bagan silsilah keturunan ke atas (Cakak) dari Sikindua/Enggom hingga tingkat Gekhinung (Mbah Buyut).',
  },
  {
    key: 'silsilahDibah',
    label: 'Silsilah Ke Bawah (Dibah)',
    caption:
      'Bagan silsilah keluarga sejajar dan keturunan ke bawah (Dibah): saudara kandung, ipar, anak, menantu, hingga cucu.',
  },
];

export const SilsilahExplorer: React.FC = () => {
  const [speakerNum, setSpeakerNum] = useState<number>(1);
  const [targetNum, setTargetNum] = useState<number>(3);
  const [activeAsset, setActiveAsset] = useState<AssetKey>('silsilahCakak');
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [assetError, setAssetError] = useState<Record<string, boolean>>({});

  const callResult = useMemo(
    () => getKinshipCall(speakerNum, targetNum),
    [speakerNum, targetNum]
  );

  const speakerInfo = WHEEL_POSITIONS.find((p) => p.number === speakerNum);
  const targetInfo = WHEEL_POSITIONS.find((p) => p.number === targetNum);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GLOSSARY_CATEGORIES.filter(
      (cat) => selectedCategory === 'all' || cat.id === selectedCategory
    )
      .map((cat) => ({
        ...cat,
        entries: cat.entries.filter(
          (entry) =>
            q === '' ||
            entry.term.toLowerCase().includes(q) ||
            entry.meaning.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.entries.length > 0);
  }, [searchQuery, selectedCategory]);

  const currentAssetMeta =
    ASSET_OPTIONS.find((a) => a.key === activeAsset) ?? ASSET_OPTIONS[0];

  const handleSwapRoles = () => {
    setSpeakerNum(targetNum);
    setTargetNum(speakerNum);
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Interactive 14x14 Kinship Lookup */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Cek Sapaan Antar Anggota Keluarga
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Pilih siapa yang memanggil dan anggota keluarga yang dituju untuk
            melihat istilah sapaan adat Lampung sesuai piringan matriks roda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
          <div>
            <label
              htmlFor="speaker-select"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Penyapa (Yang Memanggil)
            </label>
            <select
              id="speaker-select"
              value={speakerNum}
              onChange={(e) => setSpeakerNum(Number(e.target.value))}
              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
            >
              {WHEEL_POSITIONS.map((p) => (
                <option key={p.number} value={p.number}>
                  #{p.number} — {p.characterName}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSwapRoles}
            title="Tukar penyapa dan yang dipanggil"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4 shrink-0" />
            <span className="md:hidden">Tukar Peran</span>
          </button>

          <div>
            <label
              htmlFor="target-select"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              Objek (Yang Dipanggil)
            </label>
            <select
              id="target-select"
              value={targetNum}
              onChange={(e) => setTargetNum(Number(e.target.value))}
              className="w-full min-h-[44px] px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
            >
              {WHEEL_POSITIONS.map((p) => (
                <option key={p.number} value={p.number}>
                  #{p.number} — {p.characterName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lookup Output */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500">
              {speakerInfo?.characterName} memanggil {targetInfo?.characterName}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-red-700 mt-1">
              {callResult.term}
            </p>
          </div>
          <p className="text-sm text-slate-700 max-w-xl leading-relaxed">
            {callResult.note}
          </p>
        </div>
      </section>

      {/* Section 2: Original Intact Diagrams Viewer */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Bagan Silsilah Ke Atas (Cakak) &amp; Silsilah Ke Bawah (Dibah)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {currentAssetMeta.caption}
            </p>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setZoomPercent((z) => Math.max(75, z - 25))}
              disabled={zoomPercent <= 75}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700"
              aria-label="Perkecil gambar"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono tabular-nums text-xs font-semibold text-slate-700 w-12 text-center">
              {zoomPercent}%
            </span>
            <button
              type="button"
              onClick={() => setZoomPercent((z) => Math.min(225, z + 25))}
              disabled={zoomPercent >= 225}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700"
              aria-label="Perbesar gambar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoomPercent(100)}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>100%</span>
            </button>
          </div>
        </div>

        {/* Asset Selector Segmented Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl mt-4">
          {ASSET_OPTIONS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveAsset(item.key);
                setZoomPercent(100);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeAsset === item.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Scrollable Viewport keeping 100% original aspect ratio & uncropped */}
        <div className="mt-4 border border-slate-200 rounded-xl bg-slate-50 overflow-auto max-h-[680px] p-4 flex justify-center items-start">
          {!assetError[activeAsset] ? (
            <img
              src={WHEEL_ASSETS[activeAsset]}
              alt={currentAssetMeta.label}
              referrerPolicy="no-referrer"
              onError={() =>
                setAssetError((prev) => ({ ...prev, [activeAsset]: true }))
              }
              style={{
                width: `${zoomPercent}%`,
                maxWidth: zoomPercent === 100 ? '100%' : 'none',
              }}
              className="h-auto object-contain select-none"
            />
          ) : (
            <div className="py-12 px-6 text-center text-sm text-slate-600">
              Gambar {currentAssetMeta.label} gagal dimuat.
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Complete Lampung Kinship Glossary */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Materi Silsilah &amp; Kamus Tutokh Kekerabatan Lampung
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Rangkuman lengkap istilah kekerabatan, panggilan sehari-hari
              (tutokh), dan tingkatan generasi dalam budaya Lampung.
            </p>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari istilah kekerabatan..."
              className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl mt-4">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Kategori
          </button>
          {GLOSSARY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Glossary Content */}
        {filteredCategories.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            Tidak ditemukan istilah yang cocok dengan kata kunci &ldquo;
            {searchQuery}&rdquo;.
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {filteredCategories.map((cat) => (
              <div key={cat.id}>
                <div className="mb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {cat.entries.map((entry) => (
                    <div
                      key={entry.term}
                      className="p-3.5 sm:px-4 grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-1.5 sm:gap-4 text-sm"
                    >
                      <span className="font-semibold text-red-800">
                        {entry.term}
                      </span>
                      <span className="text-slate-700 leading-relaxed">
                        {entry.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
