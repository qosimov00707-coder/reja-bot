import { useState } from 'react';
import { trpc } from '../main';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const [selected, setSelected] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState(new Date());
  const { data, refetch } = trpc.tasks.getByDate.useQuery({ date: selected });
  const { data: schedData } = trpc.schedule.get.useQuery();
  const toggleMutation = trpc.tasks.toggle.useMutation({ onSuccess: () => refetch() });

  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1).getDay();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const cells = Array.from({ length: (firstDay === 0 ? 6 : firstDay - 1) + daysInMonth });
  const monthNames = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentyabr','Oktyabr','Noyabr','Dekabr'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Taqvim</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setMonth(new Date(year, m - 1))} className="text-[oklch(0.55_0.01_280)] hover:text-white"><ChevronLeft size={18}/></button>
            <span className="font-semibold text-white">{monthNames[m]} {year}</span>
            <button onClick={() => setMonth(new Date(year, m + 1))} className="text-[oklch(0.55_0.01_280)] hover:text-white"><ChevronRight size={18}/></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Du','Se','Ch','Pa','Ju','Sh','Ya'].map(d => <span key={d} className="text-xs text-[oklch(0.55_0.01_280)]">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((_, i) => {
              const dayNum = i - (firstDay === 0 ? 6 : firstDay - 1) + 1;
              if (dayNum < 1 || dayNum > daysInMonth) return <div key={i} />;
              const dateStr = `${year}-${String(m+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`;
              const isSelected = dateStr === selected;
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              return (
                <button key={i} onClick={() => setSelected(dateStr)}
                  className={`h-8 w-8 rounded-full text-sm mx-auto flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[oklch(0.72_0.18_160)] text-black font-bold' :
                    isToday ? 'border border-[oklch(0.72_0.18_160)] text-[oklch(0.72_0.18_160)]' :
                    'text-[oklch(0.65_0.01_280)] hover:bg-[oklch(0.22_0.014_285)] hover:text-white'
                  }`}>{dayNum}</button>
              );
            })}
          </div>
        </div>

        <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
          <h2 className="font-semibold text-white mb-4">{selected} uchun reja</h2>
          <div className="space-y-3">
            {(data?.vazifalar || []).map(v => {
              const done = (data?.tasks || []).find(t => t.taskId === v.taskId)?.completed || false;
              return (
                <button key={v.taskId} onClick={() => toggleMutation.mutate({ date: selected, taskId: v.taskId, completed: !done })}
                  className="w-full flex items-center gap-3 group">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${done ? 'bg-[oklch(0.72_0.18_160)] border-[oklch(0.72_0.18_160)]' : 'border-[oklch(0.35_0.014_285)]'}`}/>
                  <span>{v.emoji}</span>
                  <span className={`text-sm ${done ? 'line-through text-[oklch(0.55_0.01_280)]' : 'text-white'}`}>{v.nomi}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
