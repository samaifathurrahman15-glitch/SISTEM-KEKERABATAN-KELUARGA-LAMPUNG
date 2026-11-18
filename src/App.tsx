import { useCallback, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { ResultPanel } from './components/ResultPanel';
import { QuizMode } from './components/QuizMode';
import { SilsilahExplorer } from './components/SilsilahExplorer';
import { WheelStage } from './components/WheelStage';
import {
  TapisBorderStrip,
  TapisDivider,
} from './components/TapisOrnament';
import {
  WHEEL_ASSETS,
  WHEEL_POSITIONS,
  WheelPosition,
} from './data/kinshipData';

type WorkspaceTab = 'wheel' | 'silsilah' | 'quiz';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('wheel');
  const [selectedPosition, setSelectedPosition] =
    useState<WheelPosition | null>(null);
  // Pada sudut awal 0°, panah biru "PILIH OBJEK" menunjuk posisi #7 (Abang Ipar Ayah)
  const [livePosition, setLivePosition] = useState<WheelPosition>(
    WHEEL_POSITIONS[6]
  );
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [previewDiagram, setPreviewDiagram] = useState<'cakak' | 'dibah' | null>(
    null
  );

  const handleWheelStop = useCallback((position: WheelPosition) => {
    setSelectedPosition(position);
    setLivePosition(position);
    setIsSpinning(false);
  }, []);

  const handleWheelReset = useCallback(() => {
    setSelectedPosition(null);
    setLivePosition(WHEEL_POSITIONS[6]);
    setIsSpinning(false);
  }, []);

  const handleAngleChange = useCallback((pos: WheelPosition) => {
    setLivePosition(pos);
    setIsSpinning(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation Bar (3-zone contract) + Tapis Lampung accent trim */}
      <header className="bg-white border-b border-slate-200">
        <TapisBorderStrip />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('wheel')}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            Roda Pintar Lampung
          </button>

          {/* Zone 2: Single-line Navigation Links */}
          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => setActiveTab('wheel')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'wheel'
                  ? 'border-red-700 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Roda Putar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('silsilah')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'silsilah'
                  ? 'border-red-700 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Silsilah &amp; Kamus
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'quiz'
                  ? 'border-red-700 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Kuis &amp; Mode Guru
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="shrink-0">
            {activeTab === 'quiz' ? (
              <button
                type="button"
                onClick={() => setActiveTab('wheel')}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                Kembali ke Roda
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                Mulai Kuis
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav Row */}
        <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('wheel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 ${
              activeTab === 'wheel'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Roda Putar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('silsilah')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 ${
              activeTab === 'silsilah'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Silsilah &amp; Kamus
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 ${
              activeTab === 'quiz'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Kuis &amp; Mode Guru
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Application Hero Header (4A) with original kinship emblem & Tapis divider */}
        <section className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-4 sm:gap-6 pb-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 mb-2">
                <span>Media Pembelajaran Interaktif</span>
                <span aria-hidden="true">·</span>
                <span className="text-red-800 font-semibold">
                  SMP Negeri 2 Limau Tanggamus
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                <span className="block">RODA PINTAR BUDAYA :</span>
                <span className="block">SISTEM KEKERABATAN KELUARGA LAMPUNG</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
                &ldquo;Belajar Mengenal Sebutan Kekerabatan Adat Lampung dengan
                Cara Menyenangkan&rdquo;
              </p>
            </div>

            <div className="shrink-0">
              <img
                src="/assets/aistudio/Desain_tanpa_judul_28f83c4d.png"
                alt="Ilustrasi Silsilah Keluarga Adat Lampung"
                className="w-20 sm:w-28 lg:w-36 h-auto object-contain select-none"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <TapisDivider />
        </section>

        {/* Active Workspace View */}
        {activeTab === 'wheel' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.9fr)] gap-6 items-start">
              <WheelStage
                selectedPosition={selectedPosition}
                onWheelStop={handleWheelStop}
                onWheelReset={handleWheelReset}
                onAngleChange={handleAngleChange}
              />
              <ResultPanel
                selectedPosition={selectedPosition}
                livePosition={livePosition}
                isSpinning={isSpinning}
                onOpenSilsilahTab={() => setActiveTab('silsilah')}
                onOpenQuizTab={() => setActiveTab('quiz')}
                onPreviewSilsilah={(diagram) => setPreviewDiagram(diagram)}
              />
            </div>

            {/* Supplementary Visual References: Silsilah Cakak & Silsilah Dibah */}
            <section
              aria-label="Pelengkap Keterangan Roda Pintar: Silsilah Cakak dan Silsilah Dibah"
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Pelengkap Keterangan Roda Pintar: Bagan Silsilah Cakak &amp;
                    Silsilah Dibah
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Bagan tambahan untuk memperjelas silsilah keturunan ke atas
                    (Cakak) serta garis keluarga sejajar dan ke bawah (Dibah)
                    yang digunakan pada Roda Pintar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('silsilah')}
                  className="text-xs sm:text-sm font-semibold text-red-700 hover:text-red-800 hover:underline whitespace-nowrap shrink-0 self-start sm:self-center"
                >
                  Buka Kamus Lengkap &rarr;
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        Silsilah Cakak (Garis Keturunan Ke Atas)
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Menunjukkan urutan dari Sikindua &amp; Enggom ke Ayah/Ibu,
                        Paman/Bibi, Kakek/Nenek, Buyut, hingga Gekhinung.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewDiagram('cakak')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewDiagram('cakak')}
                    className="w-full rounded-lg overflow-hidden border border-slate-200 bg-white p-2 hover:border-slate-300 transition-colors text-left"
                  >
                    <img
                      src={WHEEL_ASSETS.silsilahCakak}
                      alt="Bagan Pelengkap Silsilah Cakak Budaya Kekerabatan Keluarga Lampung"
                      className="w-full h-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        Silsilah Dibah (Garis Sejajar &amp; Ke Bawah)
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Menunjukkan istilah saudara kandung, ipar (Puakhi,
                        Nakbai, Uyang, Bunting), anak kandung, menantu, hingga
                        cucu (Umpu).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewDiagram('dibah')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Perbesar</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewDiagram('dibah')}
                    className="w-full rounded-lg overflow-hidden border border-slate-200 bg-white p-2 hover:border-slate-300 transition-colors text-left"
                  >
                    <img
                      src={WHEEL_ASSETS.silsilahDibah}
                      alt="Bagan Pelengkap Silsilah Dibah Budaya Kekerabatan Keluarga Lampung"
                      className="w-full h-auto object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'silsilah' && <SilsilahExplorer />}

        {activeTab === 'quiz' && <QuizMode />}
      </main>

      {/* Lightbox Modal for Supplementary Silsilah Diagrams */}
      {previewDiagram && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            previewDiagram === 'cakak'
              ? 'Bagan Silsilah Cakak'
              : 'Bagan Silsilah Dibah'
          }
          className="fixed inset-0 z-50 bg-slate-950/75 p-4 sm:p-6 flex items-center justify-center"
          onClick={() => setPreviewDiagram(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {previewDiagram === 'cakak'
                    ? 'Pelengkap Keterangan: Silsilah Cakak (Ke Atas)'
                    : 'Pelengkap Keterangan: Silsilah Dibah (Sejajar & Ke Bawah)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Gambar asli ditampilkan utuh sesuai rasio aslinya.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDiagram(null)}
                aria-label="Tutup pratinjau bagan"
                className="w-9 h-9 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-auto bg-slate-50 flex justify-center">
              <img
                src={
                  previewDiagram === 'cakak'
                    ? WHEEL_ASSETS.silsilahCakak
                    : WHEEL_ASSETS.silsilahDibah
                }
                alt={
                  previewDiagram === 'cakak'
                    ? 'Bagan Silsilah Cakak'
                    : 'Bagan Silsilah Dibah'
                }
                className="w-full h-auto object-contain bg-white rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Quiet Footer framed with Tapis Lampung woven trim */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            SMP Negeri 2 Limau Tanggamus · Media Pembelajaran Interaktif Budaya
            Lampung
          </span>
          <span>Aset ilustrasi asli Roda Pintar &amp; Silsilah Kekerabatan</span>
        </div>
        <TapisBorderStrip />
      </footer>
    </div>
  );
}
