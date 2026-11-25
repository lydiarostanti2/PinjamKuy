import React from 'react';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
}) => {
  const iconDim = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none shrink-0 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconDim} shrink-0`}
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="11" fill="#2563EB" />
        <path
          d="M20 7.5C14.7533 7.5 10.5 11.7533 10.5 17C10.5 23.625 20 32.5 20 32.5C20 32.5 29.5 23.625 29.5 17C29.5 11.7533 25.2467 7.5 20 7.5Z"
          fill="white"
          fillOpacity="0.18"
        />
        <path
          d="M14.5 12.5V27.5M14.5 20L23.5 12.5M18 17.1L25.5 27.5"
          stroke="white"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="27.5" cy="12.5" r="4" fill="#F97316" stroke="#2563EB" strokeWidth="1.5" />
      </svg>
      {showWordmark && (
        <span className={`${textSize} font-extrabold tracking-tight text-slate-900 whitespace-nowrap`}>
          Pinjam<span className="text-blue-600">Kuy</span>
        </span>
      )}
    </div>
  );
};
