import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Compass,
  Hand,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  TOP_WHEEL_ARROW_OFFSET_DEG,
  WHEEL_ASSETS,
  WHEEL_POSITIONS,
  WheelPosition,
} from '../data/kinshipData';

export type SpinStatus = 'idle' | 'cw' | 'ccw' | 'auto' | 'stopping' | 'manual';

interface WheelStageProps {
  selectedPosition: WheelPosition | null;
  onWheelStop: (position: WheelPosition, angle: number) => void;
  onWheelReset: () => void;
  onAngleChange?: (livePosition: WheelPosition, angle: number) => void;
}

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Menghitung posisi objek (1..14) pada piringan bawah yang sedang ditunjuk oleh
 * panah biru "PILIH OBJEK" pada piringan merah atas.
 */
export function findSelectedPositionByArrow(
  wheelAngleDeg: number
): WheelPosition {
  const arrowWorldAngle = normalizeDeg(
    TOP_WHEEL_ARROW_OFFSET_DEG + wheelAngleDeg
  );
  let best = WHEEL_POSITIONS[0];
  let bestDist = 360;

  for (const pos of WHEEL_POSITIONS) {
    const diff = Math.abs(pos.angleDeg - arrowWorldAngle);
    const circularDist = Math.min(diff, 360 - diff);
    if (circularDist < bestDist) {
      bestDist = circularDist;
      best = pos;
    }
  }
  return best;
}

export const WheelStage: React.FC<WheelStageProps> = ({
  selectedPosition,
  onWheelStop,
  onWheelReset,
  onAngleChange,
}) => {
  const [angle, setAngle] = useState<number>(0);
  const [spinStatus, setSpinStatus] = useState<SpinStatus>('idle');
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [topImageError, setTopImageError] = useState<boolean>(false);
  const [bottomImageError, setBottomImageError] = useState<boolean>(false);

  const wheelWrapperRef = useRef<HTMLDivElement | null>(null);
  const angleRef = useRef<number>(0);
  const velocityRef = useRef<number>(0); // deg per second
  const statusRef = useRef<SpinStatus>('idle');
  const targetAngleRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Pointer drag tracking refs
  const dragLastPointerAngleRef = useRef<number>(0);
  const dragLastTimestampRef = useRef<number>(0);
  const dragVelocityRef = useRef<number>(0);

  const syncStatus = useCallback((next: SpinStatus) => {
    statusRef.current = next;
    setSpinStatus(next);
  }, []);

  const stopAnimationLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimeRef.current = null;
  }, []);

  const emitStop = useCallback(
    (finalAngle: number) => {
      const landed = findSelectedPositionByArrow(finalAngle);
      onWheelStop(landed, finalAngle);
    },
    [onWheelStop]
  );

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      const mode = statusRef.current;

      if (targetAngleRef.current !== null) {
        const diff = targetAngleRef.current - angleRef.current;
        if (Math.abs(diff) < 0.25) {
          angleRef.current = targetAngleRef.current;
          targetAngleRef.current = null;
          velocityRef.current = 0;
          setAngle(angleRef.current);
          syncStatus('idle');
          stopAnimationLoop();
          emitStop(angleRef.current);
          return;
        }
        angleRef.current += diff * Math.min(1, dt * 8.5);
        setAngle(angleRef.current);
        onAngleChange?.(
          findSelectedPositionByArrow(angleRef.current),
          angleRef.current
        );
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (mode === 'cw') {
        const maxSpeed = 480;
        velocityRef.current = Math.min(
          maxSpeed,
          velocityRef.current + 650 * dt
        );
      } else if (mode === 'ccw') {
        const maxSpeed = -480;
        velocityRef.current = Math.max(
          maxSpeed,
          velocityRef.current - 650 * dt
        );
      } else if (mode === 'stopping' || mode === 'auto') {
        const damping = Math.pow(0.28, dt);
        velocityRef.current *= damping;

        if (Math.abs(velocityRef.current) < 6) {
          velocityRef.current = 0;
          syncStatus('idle');
          stopAnimationLoop();
          emitStop(angleRef.current);
          return;
        }
      } else if (mode === 'idle') {
        stopAnimationLoop();
        return;
      }

      if (mode !== 'manual') {
        angleRef.current += velocityRef.current * dt;
        setAngle(angleRef.current);
        onAngleChange?.(
          findSelectedPositionByArrow(angleRef.current),
          angleRef.current
        );
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [emitStop, onAngleChange, stopAnimationLoop, syncStatus]);

  useEffect(() => {
    return () => {
      stopAnimationLoop();
    };
  }, [stopAnimationLoop]);

  // 1. PUTAR KANAN
  const handleSpinRight = () => {
    setIsManualMode(false);
    targetAngleRef.current = null;
    if (velocityRef.current < 80) velocityRef.current = 120;
    syncStatus('cw');
    startLoop();
  };

  // 2. PUTAR KIRI
  const handleSpinLeft = () => {
    setIsManualMode(false);
    targetAngleRef.current = null;
    if (velocityRef.current > -80) velocityRef.current = -120;
    syncStatus('ccw');
    startLoop();
  };

  // 3. BERHENTI (gradual realistic deceleration)
  const handleStop = () => {
    targetAngleRef.current = null;
    if (
      statusRef.current === 'cw' ||
      statusRef.current === 'ccw' ||
      statusRef.current === 'auto' ||
      Math.abs(velocityRef.current) >= 6
    ) {
      syncStatus('stopping');
      startLoop();
    } else {
      syncStatus('idle');
      emitStop(angleRef.current);
    }
  };

  // 4. PUTAR OTOMATIS
  const handleAutoSpin = () => {
    setIsManualMode(false);
    targetAngleRef.current = null;
    const randomSpeed = 880 + Math.random() * 520;
    velocityRef.current = randomSpeed;
    syncStatus('auto');
    startLoop();
  };

  // 5. RESET
  const handleReset = () => {
    stopAnimationLoop();
    setIsManualMode(false);
    setIsDragging(false);
    targetAngleRef.current = null;
    velocityRef.current = 0;

    const currentMod = normalizeDeg(angleRef.current);
    const nearestZero =
      currentMod > 180
        ? angleRef.current + (360 - currentMod)
        : angleRef.current - currentMod;

    if (Math.abs(currentMod) < 1) {
      angleRef.current = 0;
      setAngle(0);
      syncStatus('idle');
      onWheelReset();
      return;
    }

    let startTs: number | null = null;
    const duration = 450;
    const baseAngle = angleRef.current;
    const delta = nearestZero - baseAngle;

    const resetStep = (ts: number) => {
      if (startTs === null) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      angleRef.current = baseAngle + delta * eased;
      setAngle(angleRef.current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(resetStep);
      } else {
        angleRef.current = 0;
        setAngle(0);
        syncStatus('idle');
        rafRef.current = null;
        onWheelReset();
      }
    };
    syncStatus('stopping');
    rafRef.current = requestAnimationFrame(resetStep);
  };

  // 6. MODE MANUAL toggle
  const handleToggleManual = () => {
    targetAngleRef.current = null;
    if (!isManualMode) {
      stopAnimationLoop();
      velocityRef.current = 0;
      syncStatus('idle');
      setIsManualMode(true);
    } else {
      setIsManualMode(false);
    }
  };

  // Quick-select a numbered object (1..14) on the bottom disc so blue arrow lands on it
  const handleJumpToPosition = (pos: WheelPosition) => {
    setIsManualMode(false);
    velocityRef.current = 0;
    const desiredMod = normalizeDeg(pos.angleDeg - TOP_WHEEL_ARROW_OFFSET_DEG);
    const currentMod = normalizeDeg(angleRef.current);
    let delta = desiredMod - currentMod;
    if (delta < 0) delta += 360;
    if (delta < 30) delta += 360;
    targetAngleRef.current = angleRef.current + delta;
    syncStatus('auto');
    startLoop();
  };

  // Pointer helpers aligned to the exact geometric center of both discs (49.02%, 48.96%)
  const getPointerAngleFromCenter = (clientX: number, clientY: number) => {
    const el = wheelWrapperRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.4902;
    const cy = rect.top + rect.height * 0.4896;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isManualMode && statusRef.current !== 'idle') return;
    if (!isManualMode) {
      setIsManualMode(true);
    }

    stopAnimationLoop();
    targetAngleRef.current = null;
    velocityRef.current = 0;
    dragVelocityRef.current = 0;
    syncStatus('manual');
    setIsDragging(true);

    e.currentTarget.setPointerCapture(e.pointerId);
    dragLastPointerAngleRef.current = getPointerAngleFromCenter(
      e.clientX,
      e.clientY
    );
    dragLastTimestampRef.current = performance.now();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const now = performance.now();
    const pointerAngle = getPointerAngleFromCenter(e.clientX, e.clientY);

    let delta = pointerAngle - dragLastPointerAngleRef.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    const dt = Math.max((now - dragLastTimestampRef.current) / 1000, 0.004);
    dragVelocityRef.current = Math.max(-1100, Math.min(1100, delta / dt));

    angleRef.current += delta;
    setAngle(angleRef.current);
    onAngleChange?.(
      findSelectedPositionByArrow(angleRef.current),
      angleRef.current
    );

    dragLastPointerAngleRef.current = pointerAngle;
    dragLastTimestampRef.current = now;
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore if capture already released
    }

    const releaseVel = dragVelocityRef.current;
    if (Math.abs(releaseVel) > 35) {
      velocityRef.current = releaseVel;
      syncStatus('stopping');
      startLoop();
    } else {
      velocityRef.current = 0;
      syncStatus('idle');
      emitStop(angleRef.current);
    }
  };

  const livePosition = findSelectedPositionByArrow(angle);
  const arrowWorldAngle = normalizeDeg(TOP_WHEEL_ARROW_OFFSET_DEG + angle);
  const isSpinning =
    spinStatus === 'cw' ||
    spinStatus === 'ccw' ||
    spinStatus === 'auto' ||
    spinStatus === 'stopping';

  return (
    <section
      aria-label="Area Roda Berputar"
      className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col items-center"
    >
      {/* Top Status & Arrow Indicator Readout (clean unboxed text above the wheel, zero overlap) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-100 text-xs sm:text-sm text-slate-600">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-slate-900 whitespace-nowrap">
            Panah &ldquo;PILIH OBJEK&rdquo;:
          </span>
          <span className="font-mono tabular-nums font-bold text-red-700 shrink-0">
            #{livePosition.number}
          </span>
          <span aria-hidden="true">·</span>
          <span className="truncate font-medium text-slate-800">
            {livePosition.characterName}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono tabular-nums text-xs text-slate-500">
            Rotasi: {Math.round(normalizeDeg(angle))}°
          </span>
          <button
            type="button"
            onClick={() => setIsZoomed((z) => !z)}
            aria-pressed={isZoomed}
            title={
              isZoomed
                ? 'Kembalikan ukuran roda'
                : 'Perbesar roda untuk membaca tulisan di jendela balon'
            }
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 whitespace-nowrap shrink-0"
          >
            {isZoomed ? (
              <>
                <ZoomOut className="w-3.5 h-3.5" />
                <span>Ukuran Asli</span>
              </>
            ) : (
              <>
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Perbesar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Non-overlapping Directional Indicator Header ABOVE the wheel */}
      <div className="w-full flex items-center justify-center gap-2.5 py-1.5 px-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-slate-700 mb-2">
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-amber-300 text-sky-800 shrink-0"
          aria-hidden="true"
        >
          <Compass
            className="w-3.5 h-3.5 transition-transform duration-75"
            style={{ transform: `rotate(${arrowWorldAngle}deg)` }}
          />
        </span>
        <span className="text-center">
          Amati ujung panah biru{' '}
          <strong className="text-sky-900">PILIH OBJEK</strong> pada roda merah
          atas menuju karakter{' '}
          <strong className="text-red-800">
            #{livePosition.number} ({livePosition.characterName})
          </strong>{' '}
          di piringan bawah
        </span>
      </div>

      {/* Dual-Layer Concentric Wheel Container:
          Layer 1 (Bottom, stationary): bawah_projek_14_siang_4c8f975d.png
          Layer 2 (Top, rotating): projek_14_siang_gif__1__d858adad.png
          Both images remain 100% intact with original colors, graphics, and proportions. */}
      <div
        className={`w-full flex justify-center py-1 px-1 ${
          isZoomed ? 'overflow-auto max-h-[620px]' : 'overflow-visible'
        }`}
      >
        <div
          ref={wheelWrapperRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrCancel}
          onPointerCancel={handlePointerUpOrCancel}
          role="application"
          aria-label="Roda Pintar Dua Lapis Budaya Kekerabatan Keluarga Lampung. Lapisan atas berputar di atas piringan matriks bawah. Seret untuk memutar secara manual atau gunakan tombol kendali."
          className={`relative aspect-square select-none touch-none transition-all duration-200 ${
            isZoomed
              ? 'w-[740px] sm:w-[820px] shrink-0'
              : 'w-full max-w-[350px] sm:max-w-[480px] lg:max-w-[560px]'
          } ${
            isManualMode
              ? isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-pointer'
          }`}
        >
          {/* LAYER BAWAH (Piringan Matriks Kekerabatan 14 Sektor - Diam) */}
          {!bottomImageError ? (
            <img
              src={WHEEL_ASSETS.bottomMatrix}
              alt="Piringan Bawah Matriks 14 Posisi Kekerabatan Lampung"
              draggable={false}
              referrerPolicy="no-referrer"
              onError={() => setBottomImageError(true)}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0"
            />
          ) : (
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 bg-slate-100 flex items-center justify-center p-6 text-center z-0">
              <p className="text-sm font-semibold text-slate-700">
                Piringan bawah tidak dapat dimuat.
              </p>
            </div>
          )}

          {/* LAYER ATAS (Roda Merah Berjendela Balon Kata & Panah PILIH OBJEK - Berputar) */}
          <div
            className="absolute inset-0 w-full h-full will-change-transform z-10 pointer-events-none"
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '49.02% 48.96%',
              clipPath: 'circle(37.4% at 49.02% 48.96%)',
            }}
          >
            {!topImageError ? (
              <img
                src={WHEEL_ASSETS.mainWheel}
                alt="Roda Pintar Merah SMP Negeri 2 Limau Tanggamus dengan 14 Jendela Sapaan"
                draggable={false}
                referrerPolicy="no-referrer"
                onError={() => setTopImageError(true)}
                className="w-full h-full object-contain pointer-events-none select-none"
              />
            ) : (
              <div className="w-full h-full rounded-full border-2 border-dashed border-red-300 bg-red-50/90 flex flex-col items-center justify-center p-6 text-center">
                <p className="font-semibold text-slate-800">
                  Gambar Roda Merah tidak dapat dimuat
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mode Manual Helper Caption */}
      <p className="text-xs text-slate-500 mt-2 text-center">
        {isManualMode
          ? 'Putar Manual aktif: seret roda merah dengan tetikus atau sentuhan jari, lalu lepaskan.'
          : 'Putar roda merah di atas piringan bawah, lalu baca istilah kekerabatan di dalam 14 jendela balon.'}
      </p>

      {/* 6 Required Interactive Controls */}
      <div className="w-full mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={handleSpinRight}
          className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
            spinStatus === 'cw'
              ? 'bg-red-800 text-white'
              : 'bg-red-700 hover:bg-red-800 text-white'
          }`}
        >
          <RotateCw className="w-4 h-4 shrink-0" />
          <span>PUTAR KANAN</span>
        </button>

        <button
          type="button"
          onClick={handleSpinLeft}
          className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
            spinStatus === 'ccw'
              ? 'bg-red-800 text-white'
              : 'bg-red-700 hover:bg-red-800 text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span>PUTAR KIRI</span>
        </button>

        <button
          type="button"
          onClick={handleStop}
          className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
            spinStatus === 'stopping'
              ? 'bg-amber-600 text-white border-amber-600'
              : isSpinning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-500'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
          }`}
        >
          <Pause className="w-4 h-4 shrink-0" />
          <span>BERHENTI</span>
        </button>

        <button
          type="button"
          onClick={handleAutoSpin}
          className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
            spinStatus === 'auto'
              ? 'bg-sky-700 text-white border-sky-700'
              : 'bg-sky-600 hover:bg-sky-700 text-white border-sky-600'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>PUTAR OTOMATIS</span>
        </button>

        <button
          type="button"
          onClick={handleToggleManual}
          aria-pressed={isManualMode}
          className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 ${
            isManualMode
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
          }`}
        >
          <Hand className="w-4 h-4 shrink-0" />
          <span>PUTAR MANUAL</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          title="Kembalikan roda ke posisi awal"
          className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors whitespace-nowrap shrink-0 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
        >
          <Play className="w-4 h-4 rotate-180 shrink-0" />
          <span>ATUR ULANG</span>
        </button>
      </div>

      {/* Quick Classroom Selector (1-14) to aim PILIH OBJEK arrow at any character */}
      <div className="w-full mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-slate-600">
            Arahkan panah &ldquo;PILIH OBJEK&rdquo; ke nomor objek:
          </span>
          <span className="text-xs font-mono tabular-nums text-slate-400">
            1–14
          </span>
        </div>
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
          {WHEEL_POSITIONS.map((pos) => {
            const isActive = selectedPosition?.number === pos.number;
            return (
              <button
                key={pos.number}
                type="button"
                onClick={() => handleJumpToPosition(pos)}
                title={`${pos.number}. ${pos.characterName}`}
                className={`h-9 rounded-md font-mono tabular-nums text-xs font-semibold border transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-700 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {pos.number}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
