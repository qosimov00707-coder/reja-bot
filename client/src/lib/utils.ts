export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function format(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

export function getWeekRange(offsetWeeks = 0) {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff + offsetWeeks * 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}

export function getMonthRange(offsetMonths = 0) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
  const start = d.toISOString().split('T')[0];
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
  return { start, end };
}

export function getLast30Days() {
  const end = new Date().toISOString().split('T')[0];
  const d = new Date();
  d.setDate(d.getDate() - 29);
  const start = d.toISOString().split('T')[0];
  return { start, end };
}

export function getLast7Days() {
  const end = new Date().toISOString().split('T')[0];
  const d = new Date();
  d.setDate(d.getDate() - 6);
  const start = d.toISOString().split('T')[0];
  return { start, end };
}
