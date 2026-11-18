import React, { useId } from 'react';

interface TapisStripProps {
  className?: string;
}

/**
 * Ornamen pita tenun Tapis Lampung sederhana dan elegan
 * (motif belah ketupat & pucuk rebung benang emas di atas dasar merah marun).
 */
export const TapisBorderStrip: React.FC<TapisStripProps> = ({
  className = '',
}) => {
  const patternId = useId();

  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden select-none leading-none ${className}`}
    >
      <svg
        className="w-full h-3 block"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            width="48"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            {/* Latar merah marun khas Tapis */}
            <rect width="48" height="12" fill="#7F1D1D" />
            {/* Garis tepi benang emas atas & bawah */}
            <line
              x1="0"
              y1="1"
              x2="48"
              y2="1"
              stroke="#F59E0B"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="11"
              x2="48"
              y2="11"
              stroke="#F59E0B"
              strokeWidth="1"
            />
            {/* Motif Pucuk Rebung & Belah Ketupat geometris */}
            <polygon
              points="12,2 18,6 12,10 6,6"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="1.1"
            />
            <polygon points="12,4.2 14.4,6 12,7.8 9.6,6" fill="#FDE68A" />
            <polygon
              points="36,2 42,6 36,10 30,6"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="1.1"
            />
            <polygon points="36,4.2 38.4,6 36,7.8 33.6,6" fill="#FDE68A" />
            {/* Titik pemisah silang */}
            <path
              d="M22,4 L26,8 M26,4 L22,8 M0,6 L3,6 M45,6 L48,6"
              stroke="#D97706"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="12" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};

/**
 * Ornamen pembatas horizontal Tapis Lampung dengan simbol tajuk belah ketupat di tengah.
 */
export const TapisDivider: React.FC<TapisStripProps> = ({
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center gap-3 w-full select-none ${className}`}
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/70 to-red-800/40" />
      <svg
        width="76"
        height="18"
        viewBox="0 0 76 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M2 9H22M54 9H74"
          stroke="#B45309"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <polygon
          points="28,9 33,4 38,9 33,14"
          stroke="#991B1B"
          strokeWidth="1.2"
          fill="#FEF3C7"
        />
        <polygon
          points="38,9 43,4 48,9 43,14"
          stroke="#991B1B"
          strokeWidth="1.2"
          fill="#FEF3C7"
        />
        <polygon
          points="38,2.5 44.5,9 38,15.5 31.5,9"
          stroke="#D97706"
          strokeWidth="1.4"
          fill="#991B1B"
        />
        <polygon points="38,5.8 41.2,9 38,12.2 34.8,9" fill="#FDE68A" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400/70 to-red-800/40" />
    </div>
  );
};

/**
 * Ornamen sudut Tapis & Mahkota Siger minimalis untuk latar tajuk halaman.
 */
export const TapisHeroMotif: React.FC<TapisStripProps> = ({
  className = '',
}) => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
    >
      {/* Siluet geometris Siger berlekuk simetris */}
      <path
        d="M20 82 L40 48 L56 64 L74 30 L90 14 L106 30 L124 64 L140 48 L160 82 Z"
        stroke="#B45309"
        strokeWidth="1.6"
        fill="#FEF3C7"
        fillOpacity="0.45"
        strokeLinejoin="round"
      />
      <path
        d="M36 78 L50 56 L64 69 L79 39 L90 26 L101 39 L116 69 L130 56 L144 78"
        stroke="#991B1B"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* Deretan belah ketupat Tapis di dasar Siger */}
      <line
        x1="12"
        y1="88"
        x2="168"
        y2="88"
        stroke="#991B1B"
        strokeWidth="1.5"
      />
      <line
        x1="22"
        y1="96"
        x2="158"
        y2="96"
        stroke="#D97706"
        strokeWidth="1.2"
      />
      {[42, 66, 90, 114, 138].map((cx) => (
        <g key={cx}>
          <polygon
            points={`${cx},82 ${cx + 6},88 ${cx},94 ${cx - 6},88`}
            fill="#991B1B"
            stroke="#F59E0B"
            strokeWidth="1.1"
          />
          <circle cx={cx} cy={88} r="1.6" fill="#FDE68A" />
        </g>
      ))}
    </svg>
  );
};
