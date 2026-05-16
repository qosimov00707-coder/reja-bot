import { trpc } from '../main';
import { format } from '../lib/utils';

function PrayerCard({ label, time, icon }: { label: string; time: string; icon: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="flex items-center gap-2 text-[oklch(0.65_0.01_280)] text-sm">
        <span>{icon}</span>{label}
      </span>
      <span className="font-semibold text-white text-sm">{time}</span>
    </div>
  );
}

export default function Today() {
  const today = new Date().toISOString().split('T')[0];
  const { data, isLoading, refetch } = trpc.tasks.getByDate.useQuery({ date: today });
  const { data: streakData } = trpc.tasks.getStreak.useQuery();
  const { data: prayerData } = trpc.prayerTimes.getToday.useQuery();
  const { data: scheduleData } = trpc.schedule.get.useQuery();
  const toggleMutation = trpc.tasks.toggle.useMutation({ onSuccess: () => refetch() });

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[oklch(0.72_0.18_160)]" />
    </div>
  );

  const vazifalar = data?.vazifalar || [];
  const completions = data?.tasks || [];
  const completedCount = completions.filter(t => t.completed).length;
  const total = vazifalar.length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const nextPrayer = prayerData?.timings ? Object.entries(prayerData.timings)
    .filter(([k]) => ['Fajr','Dhuhr','Asr','Maghrib','Isha'].includes(k))
    .map(([k, v]) => ({ name: k, time: v as string }))
    .find(p => {
      const [h, m] = p.time.split(':').map(Number);
      const now = new Date();
      return h > now.getHours() || (h === now.getHours() && m > now.getMinutes());
    }) : null;

  const prayerNames: Record<string, string> = {
    Fajr: 'Bomdod', Dhuhr: 'Peshin', Asr: 'Asr', Maghrib: 'Shom', Isha: 'Xufton'
  };

  const isCompleted = (taskId: string) => completions.find(t => t.taskId === taskId)?.completed || false;

  const handleToggle = (taskId: string) => {
    toggleMutation.mutate({ date: today, taskId, completed: !isCompleted(taskId) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Bugungi vazifalar</h1>
        <p className="text-[oklch(0.55_0.01_280)] text-sm">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[oklch(0.55_0.01_280)] text-sm">Bajarildi</p>
            <div className="w-10 h-10 rounded-full bg-[oklch(0.72_0.18_160/0.15)] flex items-center justify-center text-xl">🎯</div>
          </div>
          <p className="text-3xl font-bold text-white">{completedCount}<span className="text-[oklch(0.55_0.01_280)] text-lg font-normal">/{total}</span></p>
          <div className="mt-3 h-1.5 bg-[oklch(0.22_0.014_285)] rounded-full">
            <div className="h-full bg-[oklch(0.72_0.18_160)] rounded-full transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[oklch(0.55_0.01_280)] text-sm">Streak</p>
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-xl">🔥</div>
          </div>
          <p className="text-3xl font-bold text-white">{streakData?.streak || 0} <span className="text-[oklch(0.55_0.01_280)] text-lg font-normal">kun</span></p>
          <p className="text-xs text-[oklch(0.55_0.01_280)] mt-3">Ketma-ket bajarilgan kunlar</p>
        </div>

        <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[oklch(0.55_0.01_280)] text-sm">Keyingi namoz</p>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-xl">🕐</div>
          </div>
          {nextPrayer ? (
            <>
              <p className="text-2xl font-bold text-white">{prayerNames[nextPrayer.name] || nextPrayer.name} {nextPrayer.time}</p>
              {prayerData?.hijri && (
                <p className="text-xs text-[oklch(0.55_0.01_280)] mt-2">{prayerData.hijri.date} {prayerData.hijri.month.en}</p>
              )}
            </>
          ) : <p className="text-[oklch(0.55_0.01_280)]">—</p>}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
        <h2 className="font-semibold text-white mb-4">Checklist</h2>
        <div className="space-y-3">
          {vazifalar.map((v) => {
            const done = isCompleted(v.taskId);
            return (
              <button
                key={v.taskId}
                onClick={() => handleToggle(v.taskId)}
                className="w-full flex items-center gap-3 group"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  done ? 'bg-[oklch(0.72_0.18_160)] border-[oklch(0.72_0.18_160)]' : 'border-[oklch(0.35_0.014_285)] group-hover:border-[oklch(0.72_0.18_160)]'
                }`}>
                  {done && <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5"/><path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M10 3L5 8.5 2 5.5" fill="none"/></svg>}
                </div>
                <span className="text-lg">{v.emoji}</span>
                <span className={`text-sm font-medium transition-colors ${done ? 'text-[oklch(0.55_0.01_280)] line-through' : 'text-white'}`}>
                  {v.nomi}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule */}
      {scheduleData?.schedule && scheduleData.schedule.length > 0 && (
        <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
          <h2 className="font-semibold text-white mb-4">🕐 Kunlik tartib</h2>
          <div className="space-y-3">
            {scheduleData.schedule.map((s: any) => (
              <div key={s.id} className="flex items-center gap-4">
                <span className="text-[oklch(0.55_0.01_280)] text-sm w-16 shrink-0">
                  {s.endVaqt ? `${s.vaqt}-${s.endVaqt}` : s.vaqt}
                </span>
                <div className="w-2 h-2 rounded-full bg-[oklch(0.72_0.18_160)] shrink-0" />
                <span className="text-sm text-white">{s.ish}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prayer Times */}
      {prayerData?.timings && (
        <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
          <h2 className="font-semibold text-white mb-4">🕌 Namoz vaqtlari</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { key: 'Fajr', label: 'Bomdod', icon: '🌅' },
              { key: 'Sunrise', label: 'Quyosh', icon: '☀️' },
              { key: 'Dhuhr', label: 'Peshin', icon: '🌞' },
              { key: 'Asr', label: 'Asr', icon: '🌤' },
              { key: 'Maghrib', label: 'Shom', icon: '🌇' },
              { key: 'Isha', label: 'Xufton', icon: '🌙' },
            ].map(({ key, label, icon }) => (
              <div key={key} className="flex items-center gap-2 py-2">
                <span>{icon}</span>
                <div>
                  <p className="text-xs text-[oklch(0.55_0.01_280)]">{label}</p>
                  <p className="text-sm font-semibold text-white">{(prayerData.timings as any)[key]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
