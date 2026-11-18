import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Compass,
  Layers,
  ZoomIn,
} from 'lucide-react';
import {
  FALLBACK_EXPLANATION,
  KINSHIP_CALL_MATRIX,
  WHEEL_ASSETS,
  WHEEL_POSITIONS,
  WheelPosition,
} from '../data/kinshipData';

interface ResultPanelProps {
  selectedPosition: WheelPosition | null;
  livePosition: WheelPosition;
  isSpinning: boolean;
  onOpenSilsilahTab: () => void;
  onOpenQuizTab: () => void;
  onPreviewSilsilah?: (diagram: 'cakak' | 'dibah') => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  selectedPosition,
  livePosition,
  isSpinning,
  onOpenSilsilahTab,
  onOpenQuizTab,
  onPreviewSilsilah,
}) => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [matrixDirection, setMatrixDirection] = useState<
    'toSelected' | 'fromSelected'
  >('toSelected');

  const activeItem = selectedPosition;
  const explanationText =
    activeItem && activeItem.explanation.trim().length > 0
      ? activeItem.explanation
      : FALLBACK_EXPLANATION;

  const outgoingCallings = activeItem
    ? KINSHIP_CALL_MATRIX[activeItem.number] ?? {}
    : {};

  return (
    <aside
      aria-label="Panel Hasil Putaran dan Informasi Istilah"
      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col gap-5"
    >
      {/* Header strip */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Hasil Putaran Roda
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isSpinning
              ? `Panah melewati objek #${livePosition.number} (${livePosition.characterName})...`
              : activeItem
                ? 'Roda berhenti. Istilah kekerabatan siap dipelajari.'
                : 'Putar roda untuk memilih objek kekerabatan.'}
          </p>
        </div>
        {activeItem && (
          <div className="text-right shrink-0">
            <span className="text-xs text-slate-500 block">Nomor Objek</span>
            <span className="font-mono tabular-nums text-2xl font-bold text-red-700">
              {String(activeItem.number).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Empty / Initial State */}
      {!activeItem ? (
        <div className="py-6 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <Compass className="w-6 h-6" />
          </div>
          <div className="max-w-sm">
            <p className="text-sm font-semibold text-slate-800">
              Belum Ada Objek Terpilih
            </p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Tekan tombol <span className="font-semibold">PUTAR KANAN</span>,{' '}
              <span className="font-semibold">PUTAR KIRI</span>,{' '}
              <span className="font-semibold">PUTAR OTOMATIS</span>, atau
              gunakan <span className="font-semibold">PUTAR MANUAL</span> lalu
              hentikan roda. Perhatikan objek yang ditunjuk panah biru{' '}
              <span className="font-semibold">PILIH OBJEK</span>.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Selected Term Summary */}
          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                <span>Objek #{activeItem.number} di piringan bawah</span>
                <span aria-hidden="true">·</span>
                <span>{activeItem.generationTier}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {activeItem.lampungTerm}
              </h3>
              <p className="text-sm font-medium text-red-700 mt-1">
                Balon roda atas: &ldquo;{activeItem.imageLabel}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 gap-3 text-sm">
              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  Karakter Anggota Keluarga Terkait
                </span>
                <span className="font-semibold text-slate-900 mt-0.5 block">
                  {activeItem.characterName}
                </span>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  Penjelasan Istilah Kekerabatan
                </span>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  {explanationText}
                </p>
              </div>
            </div>
          </div>

          {/* Primary Learning Action Button: PELAJARI ISTILAH */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setShowDetail((prev) => !prev)}
              aria-expanded={showDetail}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>PELAJARI ISTILAH</span>
              {showDetail ? (
                <ChevronUp className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenSilsilahTab}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Silsilah &amp; Kamus</span>
            </button>
          </div>

          {/* Expanded Deep-Dive Learning Info */}
          {showDetail && (
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Variasi Tutokh / Ukhauan / Cuwakan
                </h4>
                <p className="text-sm text-slate-700 mt-1">
                  {activeItem.tutokhVariants}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Keterangan Posisi pada Roda 2 Lapis
                </h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {activeItem.matrixNotes}
                </p>
              </div>

              {/* Supplementary Silsilah Context (Pelengkap Keterangan Roda Pintar) */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">
                    Pelengkap Keterangan: Bagan Silsilah
                  </h4>
                  <span className="text-[11px] font-semibold text-red-700">
                    {activeItem.silsilahReference === 'cakak'
                      ? 'Silsilah Cakak'
                      : activeItem.silsilahReference === 'dibah'
                        ? 'Silsilah Dibah'
                        : 'Silsilah Cakak & Dibah'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeItem.silsilahNote}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(activeItem.silsilahReference === 'cakak' ||
                    activeItem.silsilahReference === 'keduanya') && (
                    <button
                      type="button"
                      onClick={() =>
                        onPreviewSilsilah
                          ? onPreviewSilsilah('cakak')
                          : onOpenSilsilahTab()
                      }
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800"
                    >
                      <img
                        src={WHEEL_ASSETS.silsilahCakak}
                        alt="Pratinjau Silsilah Cakak"
                        className="w-8 h-5 object-contain rounded border border-slate-200 bg-white"
                      />
                      <span>Buka Silsilah Cakak</span>
                      <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  )}
                  {(activeItem.silsilahReference === 'dibah' ||
                    activeItem.silsilahReference === 'keduanya') && (
                    <button
                      type="button"
                      onClick={() =>
                        onPreviewSilsilah
                          ? onPreviewSilsilah('dibah')
                          : onOpenSilsilahTab()
                      }
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800"
                    >
                      <img
                        src={WHEEL_ASSETS.silsilahDibah}
                        alt="Pratinjau Silsilah Dibah"
                        className="w-8 h-5 object-contain rounded border border-slate-200 bg-white"
                      />
                      <span>Buka Silsilah Dibah</span>
                      <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Dual-direction 14-window reading */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-slate-900">
                    {matrixDirection === 'toSelected'
                      ? `Terbaca di 14 Jendela Roda (Memanggil ${activeItem.characterName})`
                      : `Sapaan dari ${activeItem.characterName} ke Kerabat Lain`}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg mb-2.5">
                  <button
                    type="button"
                    onClick={() => setMatrixDirection('toSelected')}
                    className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${
                      matrixDirection === 'toSelected'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Jendela Roda Atas
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatrixDirection('fromSelected')}
                    className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${
                      matrixDirection === 'fromSelected'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Balik Arah Sapaan
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {WHEEL_POSITIONS.filter(
                    (other) => other.number !== activeItem.number
                  ).map((other) => {
                    const relation =
                      matrixDirection === 'toSelected'
                        ? KINSHIP_CALL_MATRIX[other.number]?.[activeItem.number]
                        : outgoingCallings[other.number];
                    return (
                      <div
                        key={other.number}
                        className="px-3.5 py-2.5 flex items-start justify-between gap-3 text-xs sm:text-sm"
                      >
                        <div className="text-slate-600">
                          <span className="font-mono tabular-nums text-slate-400 mr-1.5">
                            #{other.number}
                          </span>
                          <span>
                            {matrixDirection === 'toSelected'
                              ? other.imageLabel
                              : `Kepada ${other.characterName}`}
                          </span>
                        </div>
                        <span className="font-semibold text-red-700 text-right shrink-0">
                          {relation ? relation.term : '-'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Classroom Quiz Prompt Footer */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          Sudah paham istilah kekerabatan?
        </span>
        <button
          type="button"
          onClick={onOpenQuizTab}
          className="text-xs font-semibold text-sky-700 hover:text-sky-800 hover:underline whitespace-nowrap shrink-0"
        >
          Uji Pemahaman di Mode Kuis &rarr;
        </button>
      </div>
    </aside>
  );
};
