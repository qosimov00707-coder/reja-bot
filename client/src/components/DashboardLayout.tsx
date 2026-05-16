import { Link, useLocation } from 'react-router-dom';
import { Calendar, BarChart2, Building2, CalendarDays, CalendarRange, Clock, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { User } from '../../../server/src/db/schema';

const navItems = [
  { path: '/', label: 'Bugun', icon: Calendar },
  { path: '/progress', label: 'Progress', icon: BarChart2 },
  { path: '/mosques', label: 'Masjidlar', icon: Building2 },
  { path: '/weekly', label: 'Hafta', icon: CalendarDays },
  { path: '/monthly', label: 'Oy', icon: CalendarRange },
  { path: '/calendar', label: 'Taqvim', icon: Calendar },
  { path: '/schedule', label: 'Tartib', icon: Clock },
  { path: '/settings', label: 'Sozlamalar', icon: Settings },
];

interface Props {
  user: User;
  children: React.ReactNode;
}

export default function DashboardLayout({ user, children }: Props) {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const Sidebar = () => (
    <aside className="w-64 h-full bg-[oklch(0.08_0.014_285)] border-r border-[oklch(0.22_0.014_285)] flex flex-col">
      <div className="p-4 border-b border-[oklch(0.22_0.014_285)]">
        <Link to="/" className="text-[oklch(0.72_0.18_160)] font-bold text-lg">
          📅 Reja Bot
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === path
                ? 'bg-[oklch(0.72_0.18_160/0.15)] text-[oklch(0.72_0.18_160)]'
                : 'text-[oklch(0.65_0.01_280)] hover:bg-[oklch(0.22_0.014_285)] hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[oklch(0.22_0.014_285)]">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[oklch(0.72_0.18_160)] flex items-center justify-center text-sm font-bold">
              {user.name[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-[oklch(0.55_0.01_280)] truncate">{user.email}</p>
          </div>
        </div>
        <a
          href="/auth/logout"
          className="mt-3 w-full text-center text-xs text-[oklch(0.55_0.01_280)] hover:text-white transition-colors block"
        >
          Chiqish
        </a>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[oklch(0.08_0.014_285)]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[oklch(0.22_0.014_285)]">
          <button onClick={() => setOpen(true)} className="text-white">
            <Menu size={22} />
          </button>
          <span className="text-[oklch(0.72_0.18_160)] font-bold">Reja Bot</span>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
