import React from "react";

interface ChannelIconProps {
  className?: string;
}

export function IosWhatsAppIcon({ className = "w-full h-full" }: ChannelIconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <defs>
        <linearGradient id="iosWaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2DD664" />
          <stop offset="100%" stopColor="#1EBE5D" />
        </linearGradient>
        <filter id="iosWaShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#iosWaGrad)" />
      <path
        d="M50 0C25 0 4 18 0 42c6-14 26-24 50-24s44 10 50 24C96 18 75 0 50 0z"
        fill="#FFFFFF"
        opacity="0.12"
      />
      <g filter="url(#iosWaShadow)">
        <path
          fill="#FFFFFF"
          d="M50 19C32.9 19 19 32.9 19 50c0 5.9 1.7 11.5 4.6 16.2L19.5 80.5l14.7-3.9C38.6 79.3 44.1 81 50 81c17.1 0 31-13.9 31-31S67.1 19 50 19zm17.9 43.4c-.7 2.1-3.7 3.8-6 4.3-1.6.3-3.7.6-10.6-2.3-8.9-3.7-14.6-12.7-15.1-13.3-.4-.6-3.6-4.8-3.6-9.2s2.3-6.5 3.1-7.4c.8-.9 1.8-.9 2.4-.9.6 0 1.2 0 1.7.03.5.03 1.3-.2 2 1.5.7 1.8 2.5 6.2 2.8 6.7.2.4.4.1.1.6-.1.2-.3.5-.5.8-.3.4-.7.8-1 1.1-.3.3-.7.7-.3 1.3.4.6 1.7 2.8 3.6 4.5 2.5 2.2 4.6 2.9 5.3 3.2.6.3 1 .3 1.4-.2.4-.4 1.6-1.9 2.1-2.6.4-.7.9-.5 1.5-.3.6.2 3.8 1.8 4.5 2.1.7.3 1.1.5 1.3.8.1.3.1 1.6-.6 3.7z"
        />
      </g>
    </svg>
  );
}

export function IosMessagesIcon({ className = "w-full h-full" }: ChannelIconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <defs>
        <linearGradient id="iosMsgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3EE86B" />
          <stop offset="100%" stopColor="#28CD41" />
        </linearGradient>
        <filter id="iosMsgShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.18" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#iosMsgGrad)" />
      <path
        d="M50 0C25 0 4 18 0 42c6-14 26-24 50-24s44 10 50 24C96 18 75 0 50 0z"
        fill="#FFFFFF"
        opacity="0.12"
      />
      <g filter="url(#iosMsgShadow)">
        <path
          fill="#FFFFFF"
          d="M50 24c-17.67 0-32 11.64-32 26 0 8.27 4.75 15.61 12.18 20.25-.45 3.32-1.92 8.35-5.48 12.25 5.75-.66 11.23-3.26 14.74-5.65 3.36.74 6.9 1.15 10.56 1.15 17.67 0 32-11.64 32-26s-14.33-26-32-26z"
        />
      </g>
    </svg>
  );
}

export function IosMailIcon({ className = "w-full h-full" }: ChannelIconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <defs>
        <linearGradient id="iosMailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2997FF" />
          <stop offset="100%" stopColor="#0066E0" />
        </linearGradient>
        <filter id="iosMailShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.22" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#iosMailGrad)" />
      <path
        d="M50 0C25 0 4 18 0 42c6-14 26-24 50-24s44 10 50 24C96 18 75 0 50 0z"
        fill="#FFFFFF"
        opacity="0.12"
      />
      <g filter="url(#iosMailShadow)">
        <rect x="19" y="28" width="62" height="44" rx="7" fill="#FFFFFF" />
        <path
          d="M20 32L50 53L80 32"
          stroke="#0066E0"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M21 70L40 51"
          stroke="#0066E0"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path
          d="M79 70L60 51"
          stroke="#0066E0"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.25"
        />
      </g>
    </svg>
  );
}
