import type { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function base({ size = 18, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  };
}

export function IconHome(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
      <path d="M8 14h2M14 14h2M8 17h2" />
    </svg>
  );
}

export function IconCompass(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m14.8 9.2-1.6 4-4 1.6 1.6-4Z" />
    </svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 3C19.5 15.4 12 20 12 20Z" />
    </svg>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M16.5 20v-1.5a3.5 3.5 0 0 0-3.5-3.5H7a3.5 3.5 0 0 0-3.5 3.5V20" />
      <circle cx="10" cy="8" r="3.2" />
      <path d="M20.5 20v-1.4a3.5 3.5 0 0 0-2.6-3.4M16.2 5.2a3.2 3.2 0 0 1 0 5.6" />
    </svg>
  );
}

export function IconChefHat(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 13.5a4 4 0 1 1 .6-7.9 4.4 4.4 0 0 1 8.4-1.2 3.9 3.9 0 0 1 3 7.6" />
      <path d="M6 13.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5.5" />
      <path d="M9.5 15.5v2M14.5 15.5v2" />
    </svg>
  );
}

export function IconFlame(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21c3.6 0 6-2.4 6-5.6 0-2.3-1.3-4-2.8-5.4-.9-.9-1.7-1.9-2-3.4-.7 1.4-1.3 2.2-2.3 3.2C9 11.4 6 12.8 6 15.4 6 18.6 8.4 21 12 21Z" />
      <path d="M12 21c-1.6 0-2.6-1.1-2.6-2.5 0-1.4 1.4-2 2.6-3.5 1 1.3 2.6 2.1 2.6 3.5 0 1.4-1 2.5-2.6 2.5Z" />
    </svg>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 11a8 8 0 0 0-14-4.6L4 8.5" />
      <path d="M4 5v4h4" />
      <path d="M4 13a8 8 0 0 0 14 4.6l2-2.1" />
      <path d="M20 19v-4h-4" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      <path d="M12 14.5v2" />
    </svg>
  );
}

export function IconUnlock(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 6.8-1.2" />
      <path d="M12 14.5v2" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m10 8.8 5 3.2-5 3.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconVideo(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="6" width="12" height="12" rx="2.5" />
      <path d="m15.5 10.5 4.2-2.4a.6.6 0 0 1 .9.5v6.8a.6.6 0 0 1-.9.5l-4.2-2.4Z" />
    </svg>
  );
}

export function IconExternal(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 4h6v6" />
      <path d="m20 4-9 9" />
      <path d="M18 14.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4.5" />
    </svg>
  );
}

export function IconBasket(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 9h14l-1.4 9a2 2 0 0 1-2 1.7H8.4a2 2 0 0 1-2-1.7Z" />
      <path d="m8.5 9 2-4.5M15.5 9l-2-4.5M9.5 13v3M14.5 13v3" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconMinus(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4.5 20.5 19h-17Z" />
      <path d="M12 9.5v4M12 16.5h.01" />
    </svg>
  );
}

export function IconSparkles(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m12 4 1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7Z" />
      <path d="m18.5 16 .8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z" />
    </svg>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 7h15M9 7V4.8A.8.8 0 0 1 9.8 4h4.4a.8.8 0 0 1 .8.8V7" />
      <path d="M6.5 7 7.4 19a1.2 1.2 0 0 0 1.2 1.1h6.8a1.2 1.2 0 0 0 1.2-1.1L17.5 7" />
      <path d="M10.5 11v5M13.5 11v5" />
    </svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function IconCopy(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 6.5V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h1.5" />
    </svg>
  );
}

export function IconWifi(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 9.5a12 12 0 0 1 16 0" />
      <path d="M7 13a8 8 0 0 1 10 0" />
      <path d="M10 16.4a3.2 3.2 0 0 1 4 0" />
      <path d="M12 20h.01" />
    </svg>
  );
}

export function IconWifiOff(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m3 3 18 18" />
      <path d="M8.5 14.4a5.5 5.5 0 0 1 7 0" />
      <path d="M5 10.5a11 11 0 0 1 4.2-2.6" />
      <path d="M14.8 7.9A11 11 0 0 1 19 10.5" />
      <path d="M12 20h.01" />
    </svg>
  );
}

export function IconUtensils(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 3v7a2.5 2.5 0 0 0 5 0V3M9.5 12.5V21" />
      <path d="M16.5 3c-1.4 1.4-1.6 3.4-1.6 5.2 0 1.3.7 2.3 2 2.3s2-1 2-2.3C18.9 6.4 18 4.2 16.5 3ZM17 21v-9.5" />
    </svg>
  );
}

export function IconBook(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21Z" />
      <path d="M4 5.5v15M8 7h8M8 11h6" />
    </svg>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
