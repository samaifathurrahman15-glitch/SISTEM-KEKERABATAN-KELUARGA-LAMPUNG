import React, { useEffect, useRef, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Edit3,
  ImagePlus,
  Medal,
  Plus,
  RotateCcw,
  Timer,
  Trash2,
  Trophy,
  Upload,
  Users,
  X,
  XCircle,
  ZoomIn,
} from 'lucide-react';
import {
  DEFAULT_QUIZ_QUESTIONS,
  QuizQuestion,
  QuizScoreRecord,
  WHEEL_ASSETS,
} from '../data/kinshipData';

const QUIZ_STORAGE_KEY = 'roda_pintar_lampung_quiz_bank_v1';
const SCORE_STORAGE_KEY = 'roda_pintar_lampung_quiz_scores_v1';
const TIMER_STORAGE_KEY = 'roda_pintar_lampung_quiz_timer_v1';

const TIMER_OPTIONS = [
  { value: 15, label: '15 Detik (Cepat)' },
  { value: 30, label: '30 Detik (Standar)' },
  { value: 45, label: '45 Detik' },
  { value: 60, label: '60 Detik' },
  { value: 0, label: 'Tanpa Batas Waktu' },
] as const;

function loadTimerSetting(): number {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    if (raw !== null) {
      const parsed = Number(raw);
      if ([0, 15, 30, 45, 60].includes(parsed)) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return 30;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

const PRESET_QUIZ_IMAGES = [
  {
    label: 'Silsilah Ke Atas (Cakak)',
    url: WHEEL_ASSETS.silsilahCakak,
    caption: 'Bagan Silsilah Cakak (Garis Keturunan Ke Atas)',
  },
  {
    label: 'Silsilah Ke Bawah (Dibah)',
    url: WHEEL_ASSETS.silsilahDibah,
    caption: 'Bagan Silsilah Dibah (Garis Sejajar & Ke Bawah)',
  },
  {
    label: 'Roda Merah Atas',
    url: WHEEL_ASSETS.mainWheel,
    caption: 'Roda Pintar Merah SMPN 2 Limau Tanggamus',
  },
  {
    label: 'Piringan Matriks Bawah',
    url: WHEEL_ASSETS.bottomMatrix,
    caption: 'Piringan Bawah 14 Karakter & Kata Sapaan',
  },
] as const;

function loadQuestionsFromStorage(): QuizQuestion[] {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return DEFAULT_QUIZ_QUESTIONS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback to default
  }
  return DEFAULT_QUIZ_QUESTIONS;
}

function loadScoresFromStorage(): QuizScoreRecord[] {
  try {
    const raw = localStorage.getItem(SCORE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is QuizScoreRecord =>
          Boolean(item) &&
          typeof item.id === 'string' &&
          typeof item.studentName === 'string' &&
          typeof item.score === 'number' &&
          typeof item.total === 'number' &&
          typeof item.dateISO === 'string'
      );
    }
  } catch {
    // ignore storage errors
  }
  return [];
}

function getScorePercentage(score: number, total: number): number {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

function formatDurationSeconds(seconds?: number): string {
  if (typeof seconds !== 'number' || Number.isNaN(seconds) || seconds < 0) {
    return '';
  }
  if (seconds < 60) {
    return `${seconds} dtk`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${String(secs).padStart(2, '0')}d`;
}

function sortScoresForLeaderboard(
  records: QuizScoreRecord[]
): QuizScoreRecord[] {
  return [...records].sort((a, b) => {
    const pctDiff =
      getScorePercentage(b.score, b.total) -
      getScorePercentage(a.score, a.total);
    if (pctDiff !== 0) return pctDiff;

    const scoreDiff = b.score - a.score;
    if (scoreDiff !== 0) return scoreDiff;

    const aTime =
      typeof a.durationSeconds === 'number'
        ? a.durationSeconds
        : Number.POSITIVE_INFINITY;
    const bTime =
      typeof b.durationSeconds === 'number'
        ? b.durationSeconds
        : Number.POSITIVE_INFINITY;
    if (aTime !== bTime) return aTime - bTime;

    return new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
  });
}

/**
 * Mengoptimalkan gambar unggahan guru agar tetap tajam di layar namun hemat ruang penyimpanan peramban.
 */
function compressImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        reject(new Error('Data gambar kosong.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak didukung.'));
      img.onload = () => {
        const maxDim = 960;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Gunakan PNG bila ukuran asli kecil/transparan, atau JPEG 0.84 agar muat di localStorage
        const isPng = file.type === 'image/png';
        const output = isPng
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', 0.84);

        // Jika PNG hasil masih besar (>450KB), konversi ke JPEG dengan latar putih
        if (isPng && output.length > 480_000) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.84));
          return;
        }
        resolve(output);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export const QuizMode: React.FC = () => {
  const [subMode, setSubMode] = useState<'play' | 'teacher'>('play');
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    loadQuestionsFromStorage
  );
  const [scoreHistory, setScoreHistory] = useState<QuizScoreRecord[]>(
    loadScoresFromStorage
  );

  // Student quiz state
  const [studentName, setStudentName] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const [timerDuration, setTimerDuration] = useState<number>(loadTimerSetting);
  const [timeLeft, setTimeLeft] = useState<number>(loadTimerSetting);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [latestScoreId, setLatestScoreId] = useState<string | null>(null);
  const [boardView, setBoardView] = useState<'ranking' | 'recent'>('ranking');
  const [confirmClearScores, setConfirmClearScores] = useState<boolean>(false);
  const [zoomedQuizImage, setZoomedQuizImage] = useState<{
    url: string;
    caption?: string;
  } | null>(null);

  // Teacher editor state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftQuestion, setDraftQuestion] = useState<string>('');
  const [draftOptions, setDraftOptions] = useState<
    [string, string, string, string]
  >(['', '', '', '']);
  const [draftCorrect, setDraftCorrect] = useState<number>(0);
  const [draftExplanation, setDraftExplanation] = useState<string>('');
  const [draftImageUrl, setDraftImageUrl] = useState<string>('');
  const [draftImageCaption, setDraftImageCaption] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [isDragOverImage, setIsDragOverImage] = useState<boolean>(false);
  const [draftImageError, setDraftImageError] = useState<boolean>(false);
  const [quizImageError, setQuizImageError] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(questions));
    } catch {
      setFormError(
        'Penyimpanan peramban penuh. Gunakan gambar berukuran lebih kecil atau hapus beberapa gambar lama.'
      );
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(scoreHistory));
    } catch {
      // ignore quota errors
    }
  }, [scoreHistory]);

  useEffect(() => {
    try {
      localStorage.setItem(TIMER_STORAGE_KEY, String(timerDuration));
    } catch {
      // ignore quota errors
    }
  }, [timerDuration]);

  const activeQuestion = questions[currentIndex] ?? null;

  // Timer hitung mundur per soal di Mode Kuis Siswa
  useEffect(() => {
    if (
      subMode !== 'play' ||
      quizFinished ||
      !activeQuestion ||
      selectedOption !== null ||
      isTimedOut ||
      timerDuration <= 0
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [
    subMode,
    quizFinished,
    activeQuestion,
    selectedOption,
    isTimedOut,
    timerDuration,
    currentIndex,
  ]);

  // Tandai waktu habis secara bersih saat hitungan mencapai 0
  useEffect(() => {
    if (
      subMode === 'play' &&
      !quizFinished &&
      activeQuestion &&
      selectedOption === null &&
      timerDuration > 0 &&
      timeLeft === 0
    ) {
      setIsTimedOut(true);
    }
  }, [
    subMode,
    quizFinished,
    activeQuestion,
    selectedOption,
    timerDuration,
    timeLeft,
  ]);

  // Pencatat total waktu pengerjaan satu sesi kuis siswa
  useEffect(() => {
    if (subMode !== 'play' || quizFinished || !activeQuestion) {
      return;
    }

    const timerId = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [subMode, quizFinished, activeQuestion]);

  const handleSelectAnswer = (optionIndex: number) => {
    if (selectedOption !== null || isTimedOut || !activeQuestion) return;
    setSelectedOption(optionIndex);
    if (optionIndex === activeQuestion.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNextQuestion = () => {
    setQuizImageError(false);
    setIsTimedOut(false);
    setTimeLeft(timerDuration);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      const record: QuizScoreRecord = {
        id: `score_${Date.now()}`,
        studentName: studentName.trim() || 'Peserta Didik',
        score: correctCount,
        total: questions.length,
        dateISO: new Date().toISOString(),
        durationSeconds: elapsedSeconds,
      };
      setScoreHistory((prev) => [record, ...prev].slice(0, 30));
      setLatestScoreId(record.id);
      setConfirmClearScores(false);
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsTimedOut(false);
    setTimeLeft(timerDuration);
    setCorrectCount(0);
    setElapsedSeconds(0);
    setLatestScoreId(null);
    setQuizImageError(false);
    setQuizFinished(false);
  };

  const handleChangeTimerDuration = (seconds: number) => {
    setTimerDuration(seconds);
    setTimeLeft(seconds);
    setIsTimedOut(false);
    setSelectedOption(null);
    setCurrentIndex(0);
    setCorrectCount(0);
    setElapsedSeconds(0);
    setLatestScoreId(null);
    setQuizFinished(false);
  };

  const resetTeacherForm = () => {
    setEditingId(null);
    setDraftQuestion('');
    setDraftOptions(['', '', '', '']);
    setDraftCorrect(0);
    setDraftExplanation('');
    setDraftImageUrl('');
    setDraftImageCaption('');
    setDraftImageError(false);
    setFormError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditQuestion = (q: QuizQuestion) => {
    setEditingId(q.id);
    setDraftQuestion(q.question);
    setDraftOptions([...q.options] as [string, string, string, string]);
    setDraftCorrect(q.correctIndex);
    setDraftExplanation(q.explanation);
    setDraftImageUrl(q.imageUrl ?? '');
    setDraftImageCaption(q.imageCaption ?? '');
    setDraftImageError(false);
    setFormError('');
    setFormSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) {
      setFormError('Minimal harus tersisa 1 soal di dalam bank kuis.');
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (editingId === id) {
      resetTeacherForm();
    }
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsTimedOut(false);
    setTimeLeft(timerDuration);
    setCorrectCount(0);
    setElapsedSeconds(0);
    setLatestScoreId(null);
    setQuizFinished(false);
    setFormSuccess('Soal berhasil dihapus.');
  };

  const processUploadedImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Pilih berkas gambar yang valid (PNG, JPG, WEBP, atau GIF).');
      return;
    }

    setFormError('');
    setDraftImageError(false);
    setIsProcessingImage(true);
    try {
      const optimized = await compressImageFileToDataUrl(file);
      setDraftImageUrl(optimized);
      if (!draftImageCaption.trim()) {
        setDraftImageCaption(file.name.replace(/\.[^.]+$/, ''));
      }
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Gagal memproses gambar.'
      );
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processUploadedImageFile(file);
  };

  const handleImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverImage(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processUploadedImageFile(file);
  };

  const handleClearDraftImage = () => {
    setDraftImageUrl('');
    setDraftImageCaption('');
    setDraftImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!draftQuestion.trim()) {
      setFormError('Teks pertanyaan wajib diisi.');
      return;
    }

    const trimmedOptions = draftOptions.map((opt) => opt.trim()) as [
      string,
      string,
      string,
      string,
    ];
    if (trimmedOptions.some((opt) => opt.length === 0)) {
      setFormError('Seluruh 4 pilihan jawaban (A, B, C, D) wajib diisi.');
      return;
    }

    const cleanImageUrl = draftImageUrl.trim();
    const cleanImageCaption = draftImageCaption.trim();

    const payload: QuizQuestion = {
      id: editingId ?? `q_${Date.now()}`,
      question: draftQuestion.trim(),
      options: trimmedOptions,
      correctIndex: draftCorrect,
      explanation:
        draftExplanation.trim() ||
        'Silakan pelajari istilah kekerabatan ini bersama guru.',
      ...(cleanImageUrl ? { imageUrl: cleanImageUrl } : {}),
      ...(cleanImageUrl && cleanImageCaption
        ? { imageCaption: cleanImageCaption }
        : {}),
    };

    if (editingId) {
      setQuestions((prev) =>
        prev.map((item) => (item.id === editingId ? payload : item))
      );
      setFormSuccess('Perubahan soal berhasil disimpan.');
    } else {
      setQuestions((prev) => [...prev, payload]);
      setFormSuccess('Soal baru berhasil ditambahkan ke kuis.');
    }

    resetTeacherForm();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsTimedOut(false);
    setTimeLeft(timerDuration);
    setCorrectCount(0);
    setElapsedSeconds(0);
    setLatestScoreId(null);
    setQuizFinished(false);
  };

  const handleRestoreDefaults = () => {
    setQuestions(DEFAULT_QUIZ_QUESTIONS);
    resetTeacherForm();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsTimedOut(false);
    setTimeLeft(timerDuration);
    setCorrectCount(0);
    setElapsedSeconds(0);
    setLatestScoreId(null);
    setQuizFinished(false);
    setFormSuccess('Bank soal dikembalikan ke daftar bawaan.');
  };

  const percentage = getScorePercentage(correctCount, questions.length);
  const rankedScores = sortScoresForLeaderboard(scoreHistory);
  const latestRankIndex = latestScoreId
    ? rankedScores.findIndex((item) => item.id === latestScoreId)
    : -1;
  const highestPct =
    rankedScores.length > 0
      ? getScorePercentage(rankedScores[0].score, rankedScores[0].total)
      : 0;
  const averagePct =
    scoreHistory.length > 0
      ? Math.round(
          scoreHistory.reduce(
            (sum, item) => sum + getScorePercentage(item.score, item.total),
            0
          ) / scoreHistory.length
        )
      : 0;
  const displayedSidebarScores =
    boardView === 'ranking' ? rankedScores : scoreHistory;

  return (
    <div className="space-y-6">
      {/* Sub-mode switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Kuis Budaya Kekerabatan Lampung
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Uji pemahaman peserta didik atau kelola pertanyaan beserta gambar
            pendukung melalui Mode Guru.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setSubMode('play')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
              subMode === 'play'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mode Kuis Siswa
          </button>
          <button
            type="button"
            onClick={() => setSubMode('teacher')}
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
              subMode === 'teacher'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kelola Soal (Mode Guru)
          </button>
        </div>
      </div>

      {subMode === 'play' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
          {/* Main Quiz Card */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
            {questions.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-600">
                Belum ada soal kuis. Tambahkan soal melalui Mode Guru.
              </div>
            ) : quizFinished ? (
              <div className="py-2 space-y-6">
                <div className="py-4 text-center max-w-lg mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                    <Trophy className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      Hasil Kuis · {studentName.trim() || 'Peserta Didik'}
                    </p>
                    <h3 className="text-3xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                      {correctCount} / {questions.length} ({percentage}%)
                    </h3>
                    <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono tabular-nums">
                        <Timer className="w-3.5 h-3.5 text-red-700" />
                        <span>
                          Waktu: {formatDurationSeconds(elapsedSeconds)}
                        </span>
                      </span>
                      {latestRankIndex >= 0 && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-mono tabular-nums">
                          <Medal className="w-3.5 h-3.5 text-amber-700" />
                          <span>
                            Peringkat #{latestRankIndex + 1} dari{' '}
                            {rankedScores.length}
                          </span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-3">
                      {percentage >= 80
                        ? 'Sangat baik! Pemahaman istilah kekerabatan adat Lampung sudah dikuasai dengan baik.'
                        : percentage >= 60
                          ? 'Cukup baik. Pelajari kembali beberapa istilah pada Roda Pintar dan Bagan Silsilah.'
                          : 'Terus berlatih mengenal sebutan kekerabatan adat Lampung bersama guru dan Roda Pintar.'}
                    </p>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleRestartQuiz}
                      className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Ulangi Kuis</span>
                    </button>
                  </div>
                </div>

                {/* Papan Skor Kelas Sederhana Setelah Sesi Selesai */}
                {rankedScores.length > 0 && (
                  <div className="border-t border-slate-200 pt-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-red-700" />
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">
                          Papan Skor Kuis Kelas
                        </h4>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Diurutkan berdasarkan nilai tertinggi &amp; kecepatan
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                      {rankedScores.slice(0, 10).map((item, rankIdx) => {
                        const pct = getScorePercentage(item.score, item.total);
                        const isLatest = item.id === latestScoreId;
                        const durationText = formatDurationSeconds(
                          item.durationSeconds
                        );
                        const rankBadgeStyle =
                          rankIdx === 0
                            ? 'bg-amber-100 border-amber-300 text-amber-800'
                            : rankIdx === 1
                              ? 'bg-slate-200 border-slate-300 text-slate-800'
                              : rankIdx === 2
                                ? 'bg-orange-100 border-orange-300 text-orange-800'
                                : 'bg-slate-50 border-slate-200 text-slate-600';

                        return (
                          <div
                            key={item.id}
                            className={`px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm ${
                              isLatest ? 'bg-amber-50/80' : 'bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`w-7 h-7 rounded-md border font-mono tabular-nums text-xs font-bold flex items-center justify-center shrink-0 ${rankBadgeStyle}`}
                              >
                                {rankIdx + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-slate-900 truncate">
                                    {item.studentName}
                                  </span>
                                  {isLatest && (
                                    <span className="px-1.5 py-0.5 rounded bg-red-700 text-white text-[10px] font-bold whitespace-nowrap">
                                      Sesi Anda
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500">
                                  {new Date(item.dateISO).toLocaleDateString(
                                    'id-ID',
                                    {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                  {durationText ? ` · ${durationText}` : ''}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono tabular-nums font-bold text-slate-900">
                                {pct}%
                              </span>
                              <p className="text-[11px] text-slate-500 font-mono tabular-nums">
                                {item.score}/{item.total} benar
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : activeQuestion ? (
              <div className="space-y-5">
                {/* Student name, progress & live countdown timer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <span className="font-semibold text-slate-900 font-mono tabular-nums">
                      Soal {currentIndex + 1} dari {questions.length}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      Skor Sementara: {correctCount}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {timerDuration > 0 && (
                      <div
                        aria-live="polite"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-mono tabular-nums font-bold shrink-0 ${
                          isTimedOut
                            ? 'bg-red-50 border-red-300 text-red-700'
                            : timeLeft <= 5 && selectedOption === null
                              ? 'bg-red-50 border-red-300 text-red-700'
                              : timeLeft <= 10 && selectedOption === null
                                ? 'bg-amber-50 border-amber-300 text-amber-800'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>
                          {isTimedOut
                            ? 'Waktu Habis (0 dtk)'
                            : selectedOption !== null
                              ? `Terjawab (${String(timeLeft).padStart(2, '0')} dtk)`
                              : `${String(timeLeft).padStart(2, '0')} detik`}
                        </span>
                      </div>
                    )}

                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Nama peserta didik (opsional)"
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-700 sm:w-52"
                    />
                  </div>
                </div>

                {/* Progress Bar + Timer Countdown Bar */}
                <div className="space-y-2">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-700 transition-transform duration-300 origin-left"
                      style={{
                        transform: `scaleX(${(currentIndex + 1) / questions.length})`,
                      }}
                    />
                  </div>

                  {timerDuration > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap shrink-0">
                        Batas waktu soal:
                      </span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 origin-left ${
                            isTimedOut || timeLeft <= 5
                              ? 'bg-red-600'
                              : timeLeft <= 10
                                ? 'bg-amber-500'
                                : 'bg-sky-600'
                          }`}
                          style={{
                            width: `${Math.max(0, Math.min(100, (timeLeft / timerDuration) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Question */}
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
                  {activeQuestion.question}
                </h3>

                {/* Optional Question Image for Students */}
                {activeQuestion.imageUrl && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                    <div className="flex justify-center">
                      {!quizImageError ? (
                        <button
                          type="button"
                          onClick={() =>
                            setZoomedQuizImage({
                              url: activeQuestion.imageUrl!,
                              caption: activeQuestion.imageCaption,
                            })
                          }
                          className="group relative rounded-lg overflow-hidden bg-white border border-slate-200 p-2 hover:border-slate-300 transition-colors"
                          title="Klik untuk memperbesar gambar soal"
                        >
                          <img
                            src={activeQuestion.imageUrl}
                            alt={
                              activeQuestion.imageCaption ||
                              `Gambar pendukung soal ${currentIndex + 1}`
                            }
                            onError={() => setQuizImageError(true)}
                            className="max-h-64 w-auto object-contain mx-auto"
                            referrerPolicy="no-referrer"
                          />
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-600 group-hover:text-red-700">
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>Klik untuk memperbesar gambar</span>
                          </span>
                        </button>
                      ) : (
                        <p className="text-xs text-red-700 py-4 text-center">
                          Gambar pendukung soal tidak dapat dimuat.
                        </p>
                      )}
                    </div>
                    {activeQuestion.imageCaption && !quizImageError && (
                      <p className="text-xs text-slate-600 text-center">
                        {activeQuestion.imageCaption}
                      </p>
                    )}
                  </div>
                )}

                {/* Options */}
                <div className="grid grid-cols-1 gap-2.5">
                  {activeQuestion.options.map((optionText, idx) => {
                    const isAnswered = selectedOption !== null || isTimedOut;
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === activeQuestion.correctIndex;

                    let buttonStyle =
                      'border-slate-200 bg-white hover:bg-slate-50 text-slate-800';
                    if (isAnswered) {
                      if (isCorrect) {
                        buttonStyle =
                          'border-emerald-600 bg-emerald-50 text-emerald-950';
                      } else if (isSelected && !isCorrect) {
                        buttonStyle = 'border-red-600 bg-red-50 text-red-950';
                      } else {
                        buttonStyle =
                          'border-slate-200 bg-slate-50 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm sm:text-base font-medium transition-colors flex items-center justify-between gap-3 min-h-[48px] ${buttonStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono tabular-nums text-xs font-bold w-6 h-6 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700">
                            {OPTION_LETTERS[idx]}
                          </span>
                          <span>{optionText}</span>
                        </div>

                        {isAnswered && isCorrect && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Benar</span>
                          </span>
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 shrink-0">
                            <XCircle className="w-4 h-4" />
                            <span>Salah</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Feedback & Next */}
                {(selectedOption !== null || isTimedOut) && (
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-sm">
                      <p
                        className={`font-semibold flex items-center gap-1.5 ${
                          selectedOption === activeQuestion.correctIndex
                            ? 'text-emerald-700'
                            : 'text-red-700'
                        }`}
                      >
                        {isTimedOut ? (
                          <>
                            <Clock className="w-4 h-4 shrink-0" />
                            <span>
                              Waktu habis! Jawaban yang benar:{' '}
                              {
                                activeQuestion.options[
                                  activeQuestion.correctIndex
                                ]
                              }
                            </span>
                          </>
                        ) : selectedOption === activeQuestion.correctIndex ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>Jawaban Anda Benar!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 shrink-0" />
                            <span>
                              Kurang tepat. Jawaban benar:{' '}
                              {
                                activeQuestion.options[
                                  activeQuestion.correctIndex
                                ]
                              }
                            </span>
                          </>
                        )}
                      </p>
                      <p className="text-slate-600 mt-1">
                        {activeQuestion.explanation}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="py-2.5 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
                    >
                      {currentIndex + 1 < questions.length
                        ? 'Soal Berikutnya'
                        : 'Selesaikan Kuis'}
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </section>

          {/* Papan Skor & Riwayat Nilai Siswa (LocalStorage) */}
          <aside className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                <h3 className="text-base font-semibold text-slate-900">
                  Papan Skor Kelas
                </h3>
              </div>

              {scoreHistory.length > 0 &&
                (confirmClearScores ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setScoreHistory([]);
                        setLatestScoreId(null);
                        setConfirmClearScores(false);
                      }}
                      className="px-2 py-1 rounded bg-red-700 hover:bg-red-800 text-white text-[11px] font-semibold whitespace-nowrap"
                    >
                      Ya, Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClearScores(false)}
                      className="px-2 py-1 rounded border border-slate-200 text-slate-600 hover:text-slate-900 text-[11px] font-semibold whitespace-nowrap"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClearScores(true)}
                    className="text-xs font-medium text-slate-500 hover:text-red-700 whitespace-nowrap"
                  >
                    Hapus Riwayat
                  </button>
                ))}
            </div>

            {scoreHistory.length > 0 && (
              <>
                {/* Ringkasan Statistik Kelas */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-center">
                    <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>Sesi</span>
                    </p>
                    <p className="font-mono tabular-nums text-sm font-bold text-slate-900 mt-0.5">
                      {scoreHistory.length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-center">
                    <p className="text-[11px] text-slate-500">Tertinggi</p>
                    <p className="font-mono tabular-nums text-sm font-bold text-emerald-700 mt-0.5">
                      {highestPct}%
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-center">
                    <p className="text-[11px] text-slate-500">Rata-rata</p>
                    <p className="font-mono tabular-nums text-sm font-bold text-slate-900 mt-0.5">
                      {averagePct}%
                    </p>
                  </div>
                </div>

                {/* Toggle Peringkat vs Riwayat Terbaru */}
                <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-100">
                  <button
                    type="button"
                    onClick={() => setBoardView('ranking')}
                    className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${
                      boardView === 'ranking'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Peringkat Nilai
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoardView('recent')}
                    className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-colors ${
                      boardView === 'recent'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Riwayat Terbaru
                  </button>
                </div>
              </>
            )}

            {scoreHistory.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center leading-relaxed">
                Belum ada skor tersimpan. Selesaikan satu sesi kuis untuk masuk
                ke papan skor kelas.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto pr-1">
                {displayedSidebarScores.map((item, idx) => {
                  const pct = getScorePercentage(item.score, item.total);
                  const isLatest = item.id === latestScoreId;
                  const durationText = formatDurationSeconds(
                    item.durationSeconds
                  );
                  const rankBadgeStyle =
                    boardView === 'ranking'
                      ? idx === 0
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : idx === 1
                          ? 'bg-slate-200 border-slate-300 text-slate-800'
                          : idx === 2
                            ? 'bg-orange-100 border-orange-300 text-orange-800'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                      : 'bg-slate-50 border-slate-200 text-slate-500';

                  return (
                    <div
                      key={item.id}
                      className={`py-2.5 px-2 -mx-2 rounded-lg flex items-center justify-between gap-2.5 text-xs sm:text-sm ${
                        isLatest ? 'bg-amber-50/80' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-md border font-mono tabular-nums text-[11px] font-bold flex items-center justify-center shrink-0 ${rankBadgeStyle}`}
                        >
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-slate-800 truncate">
                              {item.studentName}
                            </p>
                            {isLatest && (
                              <span className="px-1.5 py-0.5 rounded bg-red-700 text-white text-[10px] font-bold shrink-0">
                                Baru
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {new Date(item.dateISO).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {durationText ? ` · ${durationText}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {item.score}/{item.total}
                        </span>
                        <p className="text-[11px] font-mono tabular-nums text-slate-500">
                          {pct}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      ) : (
        /* Teacher Editor Mode */
        <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-6 items-start">
          {/* Add/Edit Form */}
          <form
            ref={formRef}
            onSubmit={handleSaveQuestion}
            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Ubah Soal Kuis' : 'Tambah Soal Baru'}
              </h3>
              {editingId && (
                <button
                  type="button"
                  onClick={resetTeacherForm}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  Batal Ubah
                </button>
              )}
            </div>

            {formError && (
              <p className="text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}
            {formSuccess && (
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {formSuccess}
              </p>
            )}

            <div>
              <label
                htmlFor="q-text"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Pertanyaan
              </label>
              <textarea
                id="q-text"
                rows={3}
                value={draftQuestion}
                onChange={(e) => setDraftQuestion(e.target.value)}
                placeholder="Tulis pertanyaan tentang kekerabatan adat Lampung..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            {/* Menu Penambahan Gambar Soal (Mode Guru) */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverImage(true);
              }}
              onDragLeave={() => setIsDragOverImage(false)}
              onDrop={handleImageDrop}
              className={`rounded-xl border p-3.5 space-y-3 transition-colors ${
                isDragOverImage
                  ? 'border-red-500 bg-red-50/70'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ImagePlus className="w-4 h-4 text-red-700" />
                  <span>Gambar Pendukung Soal (Opsional)</span>
                </span>
                {draftImageUrl && (
                  <button
                    type="button"
                    onClick={handleClearDraftImage}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:text-red-800"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hapus Gambar</span>
                  </button>
                )}
              </div>

              {/* Unggah dari Perangkat atau Seret & Lepas */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  id="q-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="q-image-upload"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-800 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-red-700" />
                  <span>
                    {isProcessingImage
                      ? 'Memproses gambar...'
                      : 'Unggah Gambar dari Perangkat'}
                  </span>
                </label>
                <span className="text-[11px] text-slate-500">
                  atau seret berkas gambar ke kotak ini
                </span>
              </div>

              {/* Pilih Cepat Gambar Media Pembelajaran Bawaan */}
              <div>
                <span className="block text-[11px] font-medium text-slate-600 mb-1.5">
                  Atau pilih dari gambar Silsilah &amp; Roda Pintar:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESET_QUIZ_IMAGES.map((preset) => {
                    const isPicked = draftImageUrl === preset.url;
                    return (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          setDraftImageError(false);
                          setDraftImageUrl(preset.url);
                          setDraftImageCaption(preset.caption);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-semibold transition-colors truncate ${
                          isPicked
                            ? 'bg-red-700 text-white border-red-700'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Atau URL Gambar Eksternal */}
              <div>
                <label
                  htmlFor="q-image-url"
                  className="block text-[11px] font-medium text-slate-600 mb-1"
                >
                  Atau masukkan tautan alamat gambar:
                </label>
                <input
                  id="q-image-url"
                  type="url"
                  value={
                    draftImageUrl.startsWith('data:') ? '' : draftImageUrl
                  }
                  onChange={(e) => {
                    setDraftImageError(false);
                    setDraftImageUrl(e.target.value);
                  }}
                  placeholder="https://contoh.com/gambar-adat-lampung.jpg"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>

              {/* Pratinjau & Keterangan Gambar */}
              {draftImageUrl && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="rounded-lg border border-slate-200 bg-white p-2 flex justify-center">
                    {!draftImageError ? (
                      <img
                        src={draftImageUrl}
                        alt="Pratinjau gambar soal"
                        onError={() => setDraftImageError(true)}
                        className="max-h-36 w-auto object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <p className="text-xs text-red-700 py-3 text-center">
                        Gambar tidak dapat dimuat. Periksa kembali tautan atau
                        unggah berkas gambar lain.
                      </p>
                    )}
                  </div>
                  <input
                    type="text"
                    value={draftImageCaption}
                    onChange={(e) => setDraftImageCaption(e.target.value)}
                    placeholder="Keterangan / petunjuk gambar untuk siswa (opsional)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <span className="block text-xs font-semibold text-slate-700">
                Pilihan Jawaban &amp; Tandai Jawaban Benar
              </span>
              {OPTION_LETTERS.map((letter, idx) => (
                <div key={letter} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct-option"
                    checked={draftCorrect === idx}
                    onChange={() => setDraftCorrect(idx)}
                    aria-label={`Tandai pilihan ${letter} sebagai jawaban benar`}
                    className="w-4 h-4 accent-red-700 shrink-0"
                  />
                  <span className="font-mono text-xs font-bold text-slate-500 w-4">
                    {letter}
                  </span>
                  <input
                    type="text"
                    value={draftOptions[idx]}
                    onChange={(e) => {
                      const next = [...draftOptions] as [
                        string,
                        string,
                        string,
                        string,
                      ];
                      next[idx] = e.target.value;
                      setDraftOptions(next);
                    }}
                    placeholder={`Pilihan ${letter}`}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
                  />
                </div>
              ))}
            </div>

            <div>
              <label
                htmlFor="q-exp"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Penjelasan Jawaban (Opsional)
              </label>
              <textarea
                id="q-exp"
                rows={2}
                value={draftExplanation}
                onChange={(e) => setDraftExplanation(e.target.value)}
                placeholder="Penjelasan singkat saat peserta didik menjawab..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessingImage}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>
                {editingId ? 'Simpan Perubahan Soal' : 'Tambahkan Soal'}
              </span>
            </button>
          </form>

          {/* Existing Question Bank List + Timer Setting */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Soal Kuis ({questions.length} Soal)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Perubahan dan gambar soal tersimpan otomatis di peramban guru.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="quiz-timer-select"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 whitespace-nowrap"
                  >
                    <Clock className="w-3.5 h-3.5 text-red-700" />
                    <span>Waktu per Soal:</span>
                  </label>
                  <select
                    id="quiz-timer-select"
                    value={timerDuration}
                    onChange={(e) =>
                      handleChangeTimerDuration(Number(e.target.value))
                    }
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-700"
                  >
                    {TIMER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Kembalikan Soal Bawaan</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {q.imageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setZoomedQuizImage({
                            url: q.imageUrl!,
                            caption: q.imageCaption,
                          })
                        }
                        title="Klik untuk memperbesar gambar soal"
                        className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 hover:border-slate-300 p-0.5 transition-colors"
                      >
                        <img
                          src={q.imageUrl}
                          alt={q.imageCaption || `Gambar soal ${idx + 1}`}
                          className="w-14 h-14 object-contain rounded"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    )}
                    <div className="space-y-1.5 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        <span className="font-mono tabular-nums text-red-700 mr-2">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        {q.question}
                      </p>
                      <p className="text-xs text-slate-600">
                        Jawaban benar:{' '}
                        <span className="font-semibold text-emerald-700">
                          {OPTION_LETTERS[q.correctIndex]}.{' '}
                          {q.options[q.correctIndex]}
                        </span>
                      </p>
                      {q.imageUrl && (
                        <p className="text-[11px] font-medium text-sky-700">
                          Dilengkapi gambar
                          {q.imageCaption ? `: ${q.imageCaption}` : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditQuestion(q)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Ubah</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-xs font-semibold text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Lightbox Modal untuk Memperbesar Gambar Soal di Mode Siswa */}
      {zoomedQuizImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau Gambar Soal Kuis"
          className="fixed inset-0 z-50 bg-slate-950/75 p-4 sm:p-6 flex items-center justify-center"
          onClick={() => setZoomedQuizImage(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-slate-900 truncate">
                {zoomedQuizImage.caption || 'Gambar Pendukung Soal Kuis'}
              </p>
              <button
                type="button"
                onClick={() => setZoomedQuizImage(null)}
                aria-label="Tutup pratinjau gambar"
                className="w-9 h-9 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 overflow-auto bg-slate-50 flex justify-center">
              <img
                src={zoomedQuizImage.url}
                alt={zoomedQuizImage.caption || 'Gambar pendukung soal kuis'}
                className="w-full h-auto max-h-[75vh] object-contain bg-white rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
