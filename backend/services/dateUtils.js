// Indian Standard Time (Asia/Kolkata) & Cinema Operating Day Utilities for Backend

export function getISTParts(d = new Date()) {
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
  const getPart = (type) => {
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

export function getIndianBusinessDate(d = new Date()) {
  const ist = getISTParts(d);
  const effectiveDate = new Date(Date.UTC(ist.year, ist.month - 1, ist.day));
  if (ist.hours < 6) {
    effectiveDate.setUTCDate(effectiveDate.getUTCDate() - 1);
  }
  const y = effectiveDate.getUTCFullYear();
  const m = String(effectiveDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(effectiveDate.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatISTDate(d = new Date()) {
  const ist = getISTParts(d);
  return `${ist.year}-${String(ist.month).padStart(2, '0')}-${String(ist.day).padStart(2, '0')}`;
}

export function resolveDatePreset(preset) {
  const today = getIndianBusinessDate();
  const [y, m, d] = today.split('-').map(Number);
  const todayUtc = new Date(Date.UTC(y, m - 1, d));

  const subDays = (days) => {
    const res = new Date(todayUtc);
    res.setUTCDate(res.getUTCDate() - days);
    return `${res.getUTCFullYear()}-${String(res.getUTCMonth() + 1).padStart(2, '0')}-${String(res.getUTCDate()).padStart(2, '0')}`;
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
