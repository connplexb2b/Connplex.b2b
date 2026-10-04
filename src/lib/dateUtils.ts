// Indian Standard Time (Asia/Kolkata) & Cinema Operating Day Utilities
// Cinema business day runs from 06:00 AM to 05:59 AM next morning.

/**
 * Returns the current date/time parts in Asia/Kolkata timezone.
 */
export function getISTParts(d: Date = new Date()): {
  year: number;
  month: number; // 1-12
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  // Use Intl.DateTimeFormat with Asia/Kolkata
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(d);
  const getPart = (type: string) => {
    const p = parts.find((x) => x.type === type);
    return p ? parseInt(p.value, 10) : 0;
  };

  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
    hours: getPart('hour'),
    minutes: getPart('minute'),
    seconds: getPart('second'),
  };
}

/**
 * Calculates the cinema business operating date formatted as YYYY-MM-DD.
 * If the current IST time is before 06:00 AM, the business date belongs to yesterday.
 */
export function getIndianBusinessDate(d: Date = new Date()): string {
  const ist = getISTParts(d);

  // If time is before 06:00 AM IST, subtract 1 calendar day
  const effectiveDate = new Date(Date.UTC(ist.year, ist.month - 1, ist.day));
  if (ist.hours < 6) {
    effectiveDate.setUTCDate(effectiveDate.getUTCDate() - 1);
  }

  const y = effectiveDate.getUTCFullYear();
  const m = String(effectiveDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(effectiveDate.getUTCDate()).padStart(2, '0');

  return `${y}-${m}-${day}`;
}

/**
 * Formats a Date object into YYYY-MM-DD strictly within Asia/Kolkata timezone.
 */
export function formatISTDate(d: Date = new Date()): string {
  const ist = getISTParts(d);
  const y = ist.year;
  const m = String(ist.month).padStart(2, '0');
  const day = String(ist.day).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Resolves standard dashboard date presets into start and end dates (YYYY-MM-DD IST).
 */
export function resolveDatePreset(preset?: string | null): { startDate: string; endDate: string } {
  const today = getIndianBusinessDate();
  const [y, m, d] = today.split('-').map(Number);
  const todayUtc = new Date(Date.UTC(y, m - 1, d));

  const subDays = (days: number): string => {
    const res = new Date(todayUtc);
    res.setUTCDate(res.getUTCDate() - days);
    const yr = res.getUTCFullYear();
    const mo = String(res.getUTCMonth() + 1).padStart(2, '0');
    const da = String(res.getUTCDate()).padStart(2, '0');
    return `${yr}-${mo}-${da}`;
  };

  switch (preset) {
    case 'Today':
      return { startDate: today, endDate: today };
    case 'Yesterday': {
      const yesterday = subDays(1);
      return { startDate: yesterday, endDate: yesterday };
    }
    case 'Last 7 Days':
      return { startDate: subDays(6), endDate: today };
    case 'Last 30 Days':
      return { startDate: subDays(29), endDate: today };
    case 'This Month':
    case 'Month-to-Date':
    default: {
      const startOfMonth = `${y}-${String(m).padStart(2, '0')}-01`;
      return { startDate: startOfMonth, endDate: today };
    }
  }
}
