import { useState } from 'react';
import { trpc } from '../main';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function Schedule() {
  const { data, refetch } = trpc.schedule.get.useQuery();
  const createMutation = trpc.schedule.create.useMutation({ onSuccess: () => { refetch(); setForm({ vaqt: '', ish: '' }); } });
  const deleteMutation = trpc.schedule.delete.useMutation({ onSuccess: () => refetch() });
  const [form, setForm] = useState({ vaqt: '', ish: '' });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Kunlik tartib</h1>
      <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
        <h2 className="font-semibold text-white mb-4">Yangi qo'shish</h2>
        <div className="flex gap-3">
          <input type="time" value={form.vaqt} onChange={e => setForm(f => ({...f, vaqt: e.target.value}))}
            className="bg-[oklch(0.22_0.014_285)] text-white rounded-lg px-3 py-2 text-sm border border-[oklch(0.30_0.014_285)] focus:outline-none focus:border-[oklch(0.72_0.18_160)]" />
          <input placeholder="Faoliyat nomi..." value={form.ish} onChange={e => setForm(f => ({...f, ish: e.target.value}))}
            className="flex-1 bg-[oklch(0.22_0.014_285)] text-white rounded-lg px-3 py-2 text-sm border border-[oklch(0.30_0.014_285)] focus:outline-none focus:border-[oklch(0.72_0.18_160)] placeholder-[oklch(0.45_0.01_280)]" />
          <button onClick={() => form.vaqt && form.ish && createMutation.mutate(form)}
            className="bg-[oklch(0.72_0.18_160)] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1">
            <Plus size={16}/> Qo'sh
          </button>
        </div>
      </div>
      <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
        <h2 className="font-semibold text-white mb-4">🕐 Reja</h2>
        <div className="space-y-3">
          {(data?.schedule || []).map((s: any) => (
            <div key={s.id} className="flex items-center gap-3 group">
              <span className="text-[oklch(0.55_0.01_280)] text-sm w-20 shrink-0">{s.endVaqt ? `${s.vaqt}-${s.endVaqt}` : s.vaqt}</span>
              <div className="w-2 h-2 rounded-full bg-[oklch(0.72_0.18_160)] shrink-0"/>
              <span className="flex-1 text-white text-sm">{s.ish}</span>
              <button onClick={() => deleteMutation.mutate({ id: s.id })} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all">
                <Trash2 size={14}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
