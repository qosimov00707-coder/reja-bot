import { useState } from 'react';
import { trpc } from '../main';
import { Plus, Trash2 } from 'lucide-react';

export default function Mosques() {
  const { data: mosques, refetch } = trpc.mosques.list.useQuery();
  const createMutation = trpc.mosques.create.useMutation({ onSuccess: () => { refetch(); setForm({ name: '', address: '', city: 'Tashkent', notes: '' }); } });
  const deleteMutation = trpc.mosques.delete.useMutation({ onSuccess: () => refetch() });
  const [form, setForm] = useState({ name: '', address: '', city: 'Tashkent', notes: '' });
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Masjidlar</h1>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 bg-[oklch(0.72_0.18_160)] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
          <Plus size={16}/> Yangi Masjid
        </button>
      </div>

      {showForm && (
        <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)] space-y-3">
          <h2 className="font-semibold text-white">Masjid qo'shish</h2>
          <input placeholder="Masjid nomi *" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
            className="w-full bg-[oklch(0.22_0.014_285)] text-white rounded-lg px-3 py-2 text-sm border border-[oklch(0.30_0.014_285)] focus:outline-none focus:border-[oklch(0.72_0.18_160)] placeholder-[oklch(0.45_0.01_280)]"/>
          <input placeholder="Manzil" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))}
            className="w-full bg-[oklch(0.22_0.014_285)] text-white rounded-lg px-3 py-2 text-sm border border-[oklch(0.30_0.014_285)] focus:outline-none focus:border-[oklch(0.72_0.18_160)] placeholder-[oklch(0.45_0.01_280)]"/>
          <input placeholder="Izoh" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
            className="w-full bg-[oklch(0.22_0.014_285)] text-white rounded-lg px-3 py-2 text-sm border border-[oklch(0.30_0.014_285)] focus:outline-none focus:border-[oklch(0.72_0.18_160)] placeholder-[oklch(0.45_0.01_280)]"/>
          <button onClick={() => form.name && createMutation.mutate(form)}
            className="bg-[oklch(0.72_0.18_160)] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
            Saqlash
          </button>
        </div>
      )}

      {!mosques?.length ? (
        <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-8 border border-[oklch(0.22_0.014_285)] text-center">
          <p className="text-[oklch(0.55_0.01_280)]">Hali masjid qo'shilmagan. Yangi masjid qo'shish uchun tugmani bosing.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mosques.map(m => (
            <div key={m.id} className="bg-[oklch(0.13_0.014_285)] rounded-xl p-4 border border-[oklch(0.22_0.014_285)] flex items-start justify-between group">
              <div>
                <p className="font-semibold text-white">🕌 {m.name}</p>
                {m.address && <p className="text-sm text-[oklch(0.55_0.01_280)] mt-1">📍 {m.address}</p>}
                {m.notes && <p className="text-sm text-[oklch(0.55_0.01_280)] mt-1">{m.notes}</p>}
              </div>
              <button onClick={() => deleteMutation.mutate({ id: m.id })} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all">
                <Trash2 size={16}/>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
