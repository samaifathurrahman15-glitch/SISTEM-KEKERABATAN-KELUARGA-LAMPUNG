import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import {
  playCorrectSfx,
  playVictorySfx,
  playWrongSfx,
} from '../utils/quizSfx';

interface WordSearchGameProps {
  sfxEnabled: boolean;
}

interface KinshipWordEntry {
  word: string;
  meaning: string;
}

type OrientationLabel = 'Mendatar' | 'Menurun' | 'Diagonal';

interface PlacedWord extends KinshipWordEntry {
  orientation: OrientationLabel;
  cells: Array<{ r: number; c: number }>;
  colorIndex: number;
}

interface CellCoord {
  r: number;
  c: number;
}

const GRID_SIZE = 13;
const TARGET_WORD_COUNT = 15;

const FILLER_ALPHABET = 'AAABCCDEEEFGGHIIIJKKLLMMNNNOOOPPRRSSTTUUWY';

const FOUND_HIGHLIGHT_CLASSES = [
  'bg-red-100 border-red-300 text-red-900',
  'bg-amber-100 border-amber-300 text-amber-900',
  'bg-emerald-100 border-emerald-300 text-emerald-900',
  'bg-sky-100 border-sky-300 text-sky-900',
  'bg-orange-100 border-orange-300 text-orange-900',
] as const;

const LAMPUNG_KINSHIP_WORD_POOL: KinshipWordEntry[] = [
  {
    word: 'SIKINDUA',
    meaning: 'Sebutan untuk suami atau diri sendiri dalam bagan silsilah.',
  },
  {
    word: 'ENGGOM',
    meaning: 'Sebutan untuk istri atau pasangan suami.',
  },
  {
    word: 'BAPAK',
    meaning: 'Panggilan kepada ayah kandung.',
  },
  {
    word: 'EMAK',
    meaning: 'Panggilan kepada ibu kandung.',
  },
  {
    word: 'TAMONG',
    meaning: 'Sebutan bagi kakek dalam dialek pesisir Lampung.',
  },
  {
    word: 'KAJONG',
    meaning: 'Sebutan bagi nenek dalam dialek pesisir Lampung.',
  },
  {
    word: 'TUYUK',
    meaning: 'Sebutan timbal balik antara buyut dan cicit.',
  },
  {
    word: 'GEKHINUNG',
    meaning: 'Leluhur tingkat keempat di atas buyut pada puncak Silsilah Cakak.',
  },
  {
    word: 'MAMAK',
    meaning: 'Panggilan untuk paman (adik laki-laki ayah atau ibu).',
  },
  {
    word: 'KEMAMAN',
    meaning: 'Sebutan untuk paman atau saudara laki-laki orang tua.',
  },
  {
    word: 'MINAN',
    meaning: 'Panggilan untuk bibi (adik perempuan dari ayah atau ibu).',
  },
  {
    word: 'PUAKHI',
    meaning: 'Sebutan yang digunakan sesama saudara laki-laki sekandung.',
  },
  {
    word: 'KELEPAH',
    meaning: 'Sebutan yang digunakan sesama saudara perempuan sekandung.',
  },
  {
    word: 'MAHANI',
    meaning: 'Sebutan saudari perempuan kepada saudara laki-laki sekandungnya.',
  },
  {
    word: 'NAKBAI',
    meaning: 'Sebutan saudara laki-laki kepada saudari perempuan sekandungnya.',
  },
  {
    word: 'UYANG',
    meaning: 'Sebutan untuk istri dari saudara kandung laki-laki.',
  },
  {
    word: 'BUNTING',
    meaning: 'Sebutan untuk suami dari saudara kandung perempuan (ipar).',
  },
  {
    word: 'PEKHADING',
    meaning: 'Sesama istri pendatang dari saudara laki-laki sekandung.',
  },
  {
    word: 'NAKAN',
    meaning: 'Panggilan untuk keponakan (anak dari kakak atau adik).',
  },
  {
    word: 'UMPU',
    meaning: 'Sebutan untuk cucu sekaligus kakek/nenek secara timbal balik.',
  },
  {
    word: 'MANTU',
    meaning: 'Sebutan untuk menantu (pasangan dari anak kandung).',
  },
  {
    word: 'MENTUHA',
    meaning: 'Sebutan untuk mertua (orang tua dari pasangan).',
  },
  {
    word: 'KENUBI',
    meaning: 'Hubungan sepupu yang ibunya bersaudara dengan ibu kita.',
  },
  {
    word: 'BANULUNG',
    meaning: 'Hubungan sepupu dari anak saudara perempuan ayah.',
  },
  {
    word: 'KELAMA',
    meaning: 'Sebutan untuk saudara laki-laki ibu beserta keturunannya.',
  },
  {
    word: 'SABAI',
    meaning: 'Sebutan untuk besan sesama laki-laki atau lintas gender.',
  },
  {
    word: 'KIYAI',
    meaning: 'Sapaan hormat untuk kakak laki-laki dalam keluarga Lampung.',
  },
  {
    word: 'LAKAU',
    meaning: 'Saudara laki-laki pihak istri atau suami dalam adat semanda.',
  },
  {
    word: 'LEBU',
    meaning: 'Sebutan untuk saudara atau keluarga besar dari pihak nenek.',
  },
  {
    word: 'INDUK',
    meaning: 'Tutur sapaan hormat kepada ibu atau kakak perempuan ayah/ibu.',
  },
];

const DIRECTIONS: Array<{
  dr: number;
  dc: number;
  label: OrientationLabel;
}> = [
  { dr: 0, dc: 1, label: 'Mendatar' },
  { dr: 1, dc: 0, label: 'Menurun' },
  { dr: 1, dc: 1, label: 'Diagonal' },
  { dr: -1, dc: 1, label: 'Diagonal' },
];

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateWordSearchPuzzle(): {
  grid: string[][];
  placedWords: PlacedWord[];
} {
  for (let boardAttempt = 0; boardAttempt < 30; boardAttempt += 1) {
    const picked = shuffleArray(LAMPUNG_KINSHIP_WORD_POOL).slice(
      0,
      TARGET_WORD_COUNT
    );
    // Urutkan dari kata terpanjang agar penempatan silang berjalan mulus
    const orderedWords = [...picked].sort(
      (a, b) => b.word.length - a.word.length
    );

    // Pastikan setiap sesi memiliki kombinasi seimbang: mendatar, menurun, dan diagonal
    const orientationQuota: OrientationLabel[] = shuffleArray([
      'Mendatar',
      'Mendatar',
      'Mendatar',
      'Mendatar',
      'Menurun',
      'Menurun',
      'Menurun',
      'Menurun',
      'Diagonal',
      'Diagonal',
      'Diagonal',
      'Diagonal',
      'Mendatar',
      'Menurun',
      'Diagonal',
    ]);

    const board: (string | null)[][] = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => null)
    );
    const placed: PlacedWord[] = [];
    let allPlaced = true;

    for (let wIdx = 0; wIdx < orderedWords.length; wIdx += 1) {
      const entry = orderedWords[wIdx];
      const preferredLabel = orientationQuota[wIdx];
      const preferredDirs = shuffleArray(
        DIRECTIONS.filter((d) => d.label === preferredLabel)
      );
      const fallbackDirs = shuffleArray(
        DIRECTIONS.filter((d) => d.label !== preferredLabel)
      );
      const dirCandidates = [...preferredDirs, ...fallbackDirs];

      let placedThis = false;

      for (const dir of dirCandidates) {
        if (placedThis) break;

        // Kumpulkan semua titik awal valid untuk arah ini, lalu acak
        const positions: Array<{ r: number; c: number; overlaps: number }> = [];
        for (let r = 0; r < GRID_SIZE; r += 1) {
          for (let c = 0; c < GRID_SIZE; c += 1) {
            const endR = r + (entry.word.length - 1) * dir.dr;
            const endC = c + (entry.word.length - 1) * dir.dc;
            if (
              endR < 0 ||
              endR >= GRID_SIZE ||
              endC < 0 ||
              endC >= GRID_SIZE
            ) {
              continue;
            }

            let fits = true;
            let overlaps = 0;
            for (let k = 0; k < entry.word.length; k += 1) {
              const nr = r + k * dir.dr;
              const nc = c + k * dir.dc;
              const existing = board[nr][nc];
              if (existing !== null && existing !== entry.word[k]) {
                fits = false;
                break;
              }
              if (existing === entry.word[k]) {
                overlaps += 1;
              }
            }

            if (fits) {
              positions.push({ r, c, overlaps });
            }
          }
        }

        if (positions.length > 0) {
          // Prioritaskan sedikit persilangan huruf atau posisi acak yang rapi
          const shuffledPos = shuffleArray(positions).sort(
            (a, b) => b.overlaps - a.overlaps
          );
          const pickRange = Math.min(shuffledPos.length, 6);
          const chosen =
            shuffledPos[Math.floor(Math.random() * pickRange)];

          const cells: Array<{ r: number; c: number }> = [];
          for (let k = 0; k < entry.word.length; k += 1) {
            const nr = chosen.r + k * dir.dr;
            const nc = chosen.c + k * dir.dc;
            board[nr][nc] = entry.word[k];
            cells.push({ r: nr, c: nc });
          }

          placed.push({
            ...entry,
            orientation: dir.label,
            cells,
            colorIndex: wIdx % FOUND_HIGHLIGHT_CLASSES.length,
          });
          placedThis = true;
        }
      }

      if (!placedThis) {
        allPlaced = false;
        break;
      }
    }

    if (allPlaced && placed.length === TARGET_WORD_COUNT) {
      const finalGrid = board.map((row) =>
        row.map(
          (cell) =>
            cell ??
            FILLER_ALPHABET[Math.floor(Math.random() * FILLER_ALPHABET.length)]
        )
      );
      return {
        grid: finalGrid,
        placedWords: [...placed].sort((a, b) =>
          a.word.localeCompare(b.word, 'id')
        ),
      };
    }
  }

  // Fallback deterministik yang sangat aman jika seluruh percobaan acak padat
  const fallbackWords = LAMPUNG_KINSHIP_WORD_POOL.slice(0, TARGET_WORD_COUNT);
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array.from(
      { length: GRID_SIZE },
      () =>
        FILLER_ALPHABET[Math.floor(Math.random() * FILLER_ALPHABET.length)]
    )
  );
  const placedWords: PlacedWord[] = [];
  fallbackWords.forEach((entry, idx) => {
    const row = idx % GRID_SIZE;
    const cells: CellCoord[] = [];
    for (let k = 0; k < entry.word.length && k < GRID_SIZE; k += 1) {
      grid[row][k] = entry.word[k];
      cells.push({ r: row, c: k });
    }
    placedWords.push({
      ...entry,
      orientation: 'Mendatar',
      cells,
      colorIndex: idx % FOUND_HIGHLIGHT_CLASSES.length,
    });
  });

  return { grid, placedWords };
}

/**
 * Menghitung garis lurus (mendatar, menurun, atau diagonal 45°) dari titik awal ke titik kursor/akhir.
 */
function getSnappedLineCells(start: CellCoord, current: CellCoord): CellCoord[] {
  const dr = current.r - start.r;
  const dc = current.c - start.c;

  if (dr === 0 && dc === 0) {
    return [start];
  }

  const absR = Math.abs(dr);
  const absC = Math.abs(dc);
  let stepR = 0;
  let stepC = 0;
  let steps = 0;

  // Snap ke salah satu dari 8 arah mata angin berdasarkan rasio jarak
  if (absR === 0 || absC / absR > 2.2) {
    stepR = 0;
    stepC = dc > 0 ? 1 : -1;
    steps = absC;
  } else if (absC === 0 || absR / absC > 2.2) {
    stepR = dr > 0 ? 1 : -1;
    stepC = 0;
    steps = absR;
  } else {
    stepR = dr > 0 ? 1 : -1;
    stepC = dc > 0 ? 1 : -1;
    steps = Math.max(absR, absC);
  }

  const line: CellCoord[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const r = start.r + i * stepR;
    const c = start.c + i * stepC;
    if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      line.push({ r, c });
    }
  }
  return line;
}

function cellKey(r: number, c: number): string {
  return `${r},${c}`;
}

export const WordSearchGame: React.FC<WordSearchGameProps> = ({
  sfxEnabled,
}) => {
  const [puzzle, setPuzzle] = useState(generateWordSearchPuzzle);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [dragStart, setDragStart] = useState<CellCoord | null>(null);
  const [dragEnd, setDragEnd] = useState<CellCoord | null>(null);
  const [tapAnchor, setTapAnchor] = useState<CellCoord | null>(null);
  const [hintCellKey, setHintCellKey] = useState<string | null>(null);
  const [hintMessage, setHintMessage] = useState<string>('');
  const [lastFoundEntry, setLastFoundEntry] =
    useState<KinshipWordEntry | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string>('');
  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const foundCellStyleMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of puzzle.placedWords) {
      if (!foundWords.includes(item.word)) continue;
      const cls = FOUND_HIGHLIGHT_CLASSES[item.colorIndex];
      for (const cell of item.cells) {
        const key = cellKey(cell.r, cell.c);
        if (!map.has(key)) {
          map.set(key, cls);
        }
      }
    }
    return map;
  }, [puzzle.placedWords, foundWords]);

  const activeSelectionCells = useMemo(() => {
    if (dragStart && dragEnd) {
      return getSnappedLineCells(dragStart, dragEnd);
    }
    if (tapAnchor) {
      return [tapAnchor];
    }
    return [];
  }, [dragStart, dragEnd, tapAnchor]);

  const activeSelectionSet = useMemo(() => {
    const set = new Set<string>();
    for (const cell of activeSelectionCells) {
      set.add(cellKey(cell.r, cell.c));
    }
    return set;
  }, [activeSelectionCells]);

  const activePreviewWord = useMemo(() => {
    if (activeSelectionCells.length === 0) return '';
    return activeSelectionCells
      .map((cell) => puzzle.grid[cell.r][cell.c])
      .join('');
  }, [activeSelectionCells, puzzle.grid]);

  const verifySelectedLine = useCallback(
    (cells: CellCoord[]) => {
      if (cells.length < 2) return false;

      const forwardText = cells.map((c) => puzzle.grid[c.r][c.c]).join('');
      const reverseText = forwardText.split('').reverse().join('');

      const matched = puzzle.placedWords.find(
        (item) =>
          !foundWords.includes(item.word) &&
          (item.word === forwardText || item.word === reverseText)
      );

      if (matched) {
        const nextFound = [...foundWords, matched.word];
        setFoundWords(nextFound);
        setLastFoundEntry({ word: matched.word, meaning: matched.meaning });
        setStatusFeedback(
          `Ditemukan: ${matched.word} (${matched.orientation})`
        );
        setHintCellKey(null);
        setHintMessage('');

        if (sfxEnabled) {
          if (nextFound.length === puzzle.placedWords.length) {
            playVictorySfx();
          } else {
            playCorrectSfx();
          }
        }
        return true;
      }

      if (cells.length >= 3) {
        setStatusFeedback(
          `Rangkaian "${forwardText}" bukan kata misteri yang tersisa.`
        );
        if (sfxEnabled) {
          playWrongSfx();
        }
      }
      return false;
    },
    [foundWords, puzzle.grid, puzzle.placedWords, sfxEnabled]
  );

  const handleRestartPuzzle = () => {
    setPuzzle(generateWordSearchPuzzle());
    setFoundWords([]);
    setDragStart(null);
    setDragEnd(null);
    setTapAnchor(null);
    setHintCellKey(null);
    setHintMessage('');
    setLastFoundEntry(null);
    setStatusFeedback('');
  };

  const handleHint = () => {
    const remaining = puzzle.placedWords.filter(
      (item) => !foundWords.includes(item.word)
    );
    if (remaining.length === 0) return;

    const target = remaining[0];
    const firstCell = target.cells[0];
    setHintCellKey(cellKey(firstCell.r, firstCell.c));
    setHintMessage(
      `Petunjuk: Kata "${target.word}" dimulai dari huruf "${target.word[0]}" pada baris ${firstCell.r + 1}, kolom ${firstCell.c + 1} (${target.orientation}).`
    );
  };

  const getCellFromPointerEvent = (
    clientX: number,
    clientY: number
  ): CellCoord | null => {
    const el = document.elementFromPoint(clientX, clientY);
    if (!el) return null;
    const btn = el.closest('[data-ws-row]') as HTMLElement | null;
    if (!btn) return null;
    const r = Number(btn.dataset.wsRow);
    const c = Number(btn.dataset.wsCol);
    if (Number.isNaN(r) || Number.isNaN(c)) return null;
    return { r, c };
  };

  const handleCellPointerDown = (
    e: React.PointerEvent<HTMLButtonElement>,
    r: number,
    c: number
  ) => {
    e.preventDefault();
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragStart({ r, c });
    setDragEnd({ r, c });
  };

  const handleGridPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    const hovered = getCellFromPointerEvent(e.clientX, e.clientY);
    if (hovered && (hovered.r !== dragEnd?.r || hovered.c !== dragEnd?.c)) {
      setDragEnd(hovered);
    }
  };

  const finishPointerSelection = () => {
    if (!dragStart) return;
    const end = dragEnd ?? dragStart;

    // Jika hanya satu ketukan (tap/klik tunggal tanpa seret)
    if (end.r === dragStart.r && end.c === dragStart.c) {
      if (!tapAnchor) {
        setTapAnchor(dragStart);
        setStatusFeedback(
          'Huruf awal dipilih. Klik huruf akhir kata secara mendatar, menurun, atau diagonal.'
        );
      } else if (tapAnchor.r === dragStart.r && tapAnchor.c === dragStart.c) {
        setTapAnchor(null);
        setStatusFeedback('');
      } else {
        const line = getSnappedLineCells(tapAnchor, dragStart);
        verifySelectedLine(line);
        setTapAnchor(null);
      }
    } else {
      const line = getSnappedLineCells(dragStart, end);
      verifySelectedLine(line);
      setTapAnchor(null);
    }

    setDragStart(null);
    setDragEnd(null);
  };

  const allFound = foundWords.length === puzzle.placedWords.length;

  return (
    <div className="space-y-5">
      {/* Header Kata Misteri */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span className="font-semibold text-red-700">
              Permainan Kata Misteri
            </span>
            <span aria-hidden="true">·</span>
            <span>Mendatar, Menurun &amp; Diagonal</span>
            <span aria-hidden="true">·</span>
            <span>Tanpa Batas Waktu</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Temukan 15 Istilah Silsilah &amp; Kekerabatan Lampung
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Seret kursor dari huruf pertama ke huruf terakhir, atau klik huruf
            awal lalu klik huruf akhir kata.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50 font-mono tabular-nums text-xs sm:text-sm font-bold text-slate-900">
            Ditemukan: {foundWords.length} / {puzzle.placedWords.length}
          </div>
          <button
            type="button"
            onClick={handleHint}
            disabled={allFound}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-xs sm:text-sm font-semibold text-amber-900 transition-colors whitespace-nowrap shrink-0"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Petunjuk</span>
          </button>
          <button
            type="button"
            onClick={handleRestartPuzzle}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Acak 15 Kata Baru</span>
          </button>
        </div>
      </div>

      {/* Pengumuman Selesai Semua Kata */}
      {allFound && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-emerald-950">
                Selamat! Seluruh 15 Kata Misteri Berhasil Ditemukan!
              </h4>
              <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
                Kamu telah mengenali istilah sebutan silsilah dan kekerabatan
                masyarakat Lampung secara mendatar, menurun, maupun diagonal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestartPuzzle}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Main Lagi (Acak Baru)</span>
          </button>
        </div>
      )}

      {/* Kotak Petunjuk atau Makna Kata yang Baru Ditemukan */}
      {(hintMessage || lastFoundEntry || statusFeedback) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(hintMessage || statusFeedback) && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Info: </span>
              {hintMessage || statusFeedback}
            </div>
          )}
          {lastFoundEntry && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs sm:text-sm text-emerald-950">
              <span className="font-bold">{lastFoundEntry.word}: </span>
              <span>{lastFoundEntry.meaning}</span>
            </div>
          )}
        </div>
      )}

      {/* Papan Grid Huruf & Daftar 15 Kata Target */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_340px] gap-6 items-start">
        {/* Papan Grid Pencarian Kata */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
            <span>Papan Huruf ({GRID_SIZE} × {GRID_SIZE})</span>
            <span className="font-mono tabular-nums font-semibold text-slate-800 min-h-[18px]">
              {activePreviewWord
                ? `Pilihan: ${activePreviewWord}`
                : 'Pilih huruf pada papan'}
            </span>
          </div>

          <div
            ref={gridContainerRef}
            onPointerMove={handleGridPointerMove}
            onPointerUp={finishPointerSelection}
            onPointerCancel={() => {
              setDragStart(null);
              setDragEnd(null);
            }}
            onPointerLeave={() => {
              if (dragStart) {
                finishPointerSelection();
              }
            }}
            className="select-none touch-none grid gap-1 sm:gap-1.5 mx-auto max-w-[580px]"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {puzzle.grid.map((row, rIdx) =>
              row.map((letter, cIdx) => {
                const key = cellKey(rIdx, cIdx);
                const isSelected = activeSelectionSet.has(key);
                const foundClass = foundCellStyleMap.get(key);
                const isHint = hintCellKey === key;

                let cellStyle =
                  'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100';
                if (foundClass) {
                  cellStyle = foundClass;
                }
                if (isHint && !isSelected) {
                  cellStyle =
                    'bg-amber-200 border-amber-500 text-amber-950 ring-2 ring-amber-400';
                }
                if (isSelected) {
                  cellStyle =
                    'bg-red-700 border-red-800 text-white shadow-sm scale-[1.03]';
                }

                return (
                  <button
                    key={key}
                    type="button"
                    data-ws-row={rIdx}
                    data-ws-col={cIdx}
                    onPointerDown={(e) => handleCellPointerDown(e, rIdx, cIdx)}
                    aria-label={`Huruf ${letter} baris ${rIdx + 1} kolom ${cIdx + 1}`}
                    className={`aspect-square w-full rounded-md sm:rounded-lg border font-bold text-xs sm:text-base md:text-lg flex items-center justify-center transition-transform duration-100 cursor-pointer select-none ${cellStyle}`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Daftar 15 Kata Misteri */}
        <aside className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                Daftar 15 Kata Misteri
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik kata yang sudah ditemukan untuk melihat artinya.
              </p>
            </div>
            <span className="font-mono tabular-nums text-xs font-bold text-red-700">
              {foundWords.length}/15
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {puzzle.placedWords.map((item) => {
              const isFound = foundWords.includes(item.word);
              return (
                <button
                  key={item.word}
                  type="button"
                  onClick={() => {
                    if (isFound) {
                      setLastFoundEntry({
                        word: item.word,
                        meaning: item.meaning,
                      });
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl border transition-colors flex items-center justify-between gap-2 ${
                    isFound
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800 cursor-default'
                  }`}
                >
                  <div className="min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-bold tracking-wide ${
                        isFound ? 'line-through text-emerald-800' : ''
                      }`}
                    >
                      {item.word}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Arah: {item.orientation}
                    </p>
                  </div>

                  {isFound ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <span className="font-mono tabular-nums text-[11px] text-slate-400 shrink-0">
                      {item.word.length} huruf
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};
