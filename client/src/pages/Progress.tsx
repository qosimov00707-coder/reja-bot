import { useState } from 'react';
import { trpc } from '../main';
import { getLast7Days, getLast30Days } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Progress() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const range = period === 'week' ? getLast7Days() : getLast30Days();
  const { data: rangeData } = trpc.tasks.getByRange.useQuery({ startDate: range.start, endDate: range.end });
  const { data: todayData } = trpc.tasks.getByDate.useQuery({ date: new Date().toISOString().split('T')[0] });

  const vazifalar = todayData?.vazifalar || [];
  const tasks = rangeData?.tasks || [];

  // Build daily chart data
  const days: Record<string, { completed: number; total: number }> = {};
  const cur = new Date(range.start);
  while (cur.toISOString().split('T')[0] <= range.end) {
    days[cur.toISOString().split('T')[0]] = { completed: 0, total: vazifalar.length };
    cur.setDate(cur.getDate() + 1);
  }
  tasks.forEach(t => {
    if (t.completed && days[t.date]) days[t.date].completed++;
  });

  const chartData = Object.entries(days).map(([date, d]) => ({
    date: date.slice(5),
    percent: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0,
  }));

  // Per-task stats
  const taskStats = vazifalar.map(v => {
    const completed = tasks.filter(t => t.taskId === v.taskId && t.completed).length;
    const total = Object.keys(days).length;
    return { ...v, completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-[oklch(0.55_0.01_280)] text-sm">Haftalik va oylik natijalar</p>
      </div>

      <div className="flex gap-2">
        {(['week', 'month'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p ? 'bg-[oklch(0.72_0.18_160)] text-black' : 'bg-[oklch(0.13_0.014_285)] text-[oklch(0.65_0.01_280)] hover:text-white border border-[oklch(0.22_0.014_285)]'
            }`}>
            {p === 'week' ? 'Hafta (7 kun)' : 'Oy (30 kun)'}
          </button>
        ))}
      </div>

      <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
        <h2 className="font-semibold text-white mb-4">Kunlik bajarilish foizi</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" tick={{ fill: 'oklch(0.55 0.01 280)', fontSize: 11 }} />
            <YAxis tick={{ fill: 'oklch(0.55 0.01 280)', fontSize: 11 }} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: 'oklch(0.13 0.014 285)', border: '1px solid oklch(0.22 0.014 285)', borderRadius: 8 }} />
            <Bar dataKey="percent" fill="oklch(0.72 0.18 160)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
        <h2 className="font-semibold text-white mb-4">Vazifalar bo'yicha</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[oklch(0.55_0.01_280)]">
                <th className="text-left pb-3">Vazifa</th>
                <th className="text-right pb-3">Bajarilgan</th>
                <th className="text-right pb-3">Jami</th>
                <th className="text-right pb-3">Foiz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[oklch(0.22_0.014_285)]">
              {taskStats.map(t => (
                <tr key={t.taskId}>
                  <td className="py-3 text-white">{t.emoji} {t.nomi}</td>
                  <td className="py-3 text-right text-white">{t.completed}</td>
                  <td className="py-3 text-right text-white">{t.total}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      t.percent >= 70 ? 'bg-[oklch(0.72_0.18_160)] text-black' :
                      t.percent >= 40 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-[oklch(0.22_0.014_285)] text-[oklch(0.55_0.01_280)]'
                    }`}>{t.percent}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
