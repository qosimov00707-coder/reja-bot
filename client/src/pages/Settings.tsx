import { trpc } from '../main';

export default function Settings() {
  const { data: user } = trpc.auth.me.useQuery();
  const { data: settings } = trpc.settings.get.useQuery();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sozlamalar</h1>
        <p className="text-[oklch(0.55_0.01_280)] text-sm">Tizim sozlamalari va ma'lumotlar</p>
      </div>

      <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)] space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2">👤 Foydalanuvchi</h2>
        <div className="flex items-center gap-4">
          {user?.avatar && <img src={user.avatar} alt="" className="w-14 h-14 rounded-full"/>}
          <div>
            <p className="text-white font-semibold">{user?.name}</p>
            <p className="text-[oklch(0.55_0.01_280)] text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-[oklch(0.55_0.01_280)]">Rol</span><p className="text-white mt-1 capitalize">{user?.role}</p></div>
          <div><span className="text-[oklch(0.55_0.01_280)]">Ro'yxatdan o'tgan</span><p className="text-white mt-1">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uz') : '—'}</p></div>
        </div>
      </div>

      <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)] space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2">🌐 Tizim</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-[oklch(0.55_0.01_280)]">Shahar</span><p className="text-white mt-1">{settings?.city || 'Tashkent'}</p></div>
          <div><span className="text-[oklch(0.55_0.01_280)]">Vaqt zonasi</span><p className="text-white mt-1">{settings?.timezone || 'Asia/Tashkent'}</p></div>
          <div><span className="text-[oklch(0.55_0.01_280)]">Namoz hisob usuli</span><p className="text-white mt-1">#{settings?.prayerMethod || 2}</p></div>
        </div>
      </div>

      <div className="bg-[oklch(0.13_0.014_285)] rounded-xl p-5 border border-[oklch(0.22_0.014_285)]">
        <h2 className="font-semibold text-white mb-3">Hisobdan chiqish</h2>
        <a href="/auth/logout"
          className="inline-block bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
          Chiqish
        </a>
      </div>
    </div>
  );
}
