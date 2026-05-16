import { trpc } from '../main';
import { getLast30Days } from '../lib/utils';

export default function Monthly() {
  const range = getLast30Days();
  const { data: rangeData } = trpc.tasks.getByRange.useQuery({ startDate: range.start, endDate: range.end });
  const { data: todayData } = trpc.tasks.getByDate.useQuery({ date: new Date().toISOString().split('T')[0] });
  const vazifalar = todayData?.vazifalar || [];
  const tasks = rangeData?.tasks || [];

  const taskStats = vazifalar.map(v => {
    const completed = tasks.filter(t => t.taskId === v.taskId && t.completed).length;
    const total = 30;
    return { ...v, completed, total, percent: Math.round((completed / total) * 100) };
  });
  const totalCompleted = taskStats.reduce((s, t) => s + t.completed, 0);
  const totalPossible = taskStats.reduce((s, t) => s + t.total, 0);
  const avgPercent = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">📅 O'tgan Oy</h1>
        <p className="text-[oklch(0.55_0.01_280)] text-sm">{range.start} — {range.end}</p>
      </div>
      <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
        <h2 className="font-semibold text-white mb-4">Vazifalar Statistikasi</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-[oklch(0.55_0.01_280)]"><th className="text-left pb-3">Vazifa</th><th className="text-right pb-3">Bajarilgan</th><th className="text-right pb-3">Jami</th><th className="text-right pb-3">Foiz</th></tr></thead>
          <tbody className="divide-y divide-[oklch(0.22_0.014_285)]">
            {taskStats.map(t => (
              <tr key={t.taskId}>
                <td className="py-3 text-white">{t.emoji} {t.nomi}</td>
                <td className="py-3 text-right text-white">{t.completed}</td>
                <td className="py-3 text-right text-white">{t.total}</td>
                <td className="py-3 text-right"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.percent >= 70 ? 'bg-[oklch(0.72_0.18_160)] text-black' : 'bg-[oklch(0.22_0.014_285)] text-[oklch(0.55_0.01_280)]'}`}>{t.percent}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
        <h2 className="font-semibold text-white mb-4">Umumiy Natija</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-[oklch(0.55_0.01_280)] text-sm mb-1">O'rtacha Bajarilish</p><p className="text-2xl font-bold text-[oklch(0.72_0.18_160)]">{avgPercent}%</p></div>
          <div><p className="text-[oklch(0.55_0.01_280)] text-sm mb-1">Jami Vazifalar</p><p className="text-2xl font-bold text-white">{vazifalar.length}</p></div>
          <div><p className="text-[oklch(0.55_0.01_280)] text-sm mb-1">Kunlar Soni</p><p className="text-2xl font-bold text-white">30</p></div>
        </div>
      </div>
    </div>
  );
}
