import { CalendarDays, Image, LayoutDashboard, LogOut, Menu, MessageSquare, Stethoscope, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Treatments", to: "/treatments", icon: Stethoscope },
  { label: "Bookings", to: "/bookings", icon: CalendarDays },
  { label: "Reviews", to: "/reviews", icon: MessageSquare },
  { label: "News Banners", to: "/news-banners", icon: Image }
];

const navClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold transition ${
    isActive ? "bg-brand-gold text-brand-charcoal" : "text-white/78 hover:bg-white/10 hover:text-white"
  }`;

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAuth();

  const Sidebar = (
    <aside className="flex h-full flex-col bg-brand-charcoal p-5 text-white">
      <div>
        <p className="brand-title font-display text-3xl font-bold">SETHSUWA</p>
        <p className="mt-1 text-sm text-white/55">Admin Dashboard</p>
      </div>
      <nav className="mt-10 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className={navClass} onClick={() => setOpen(false)}>
              <Icon size={18} /> {item.label}
            </NavLink>
          );
        })}
      </nav>
      <button
        type="button"
        className="mt-auto flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold text-white/78 transition hover:bg-white/10 hover:text-white"
        onClick={logout}
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="hidden fixed inset-y-0 left-0 w-72 lg:block">{Sidebar}</div>
      <header className="sticky top-0 z-40 border-b border-brand-gold/25 bg-white px-4 py-4 shadow-sm lg:ml-72">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-brand-maroon ring-1 ring-brand-maroon/20 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open admin navigation"
          >
            <Menu size={22} />
          </button>
          <div className="ml-auto text-right">
            <p className="text-sm font-bold text-brand-charcoal">{admin?.name}</p>
            <p className="text-xs text-slate-500">{admin?.email}</p>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-charcoal/50"
            aria-label="Close admin navigation"
            onClick={() => setOpen(false)}
          />
          <div className="relative h-full w-72 shadow-soft">
            <button
              type="button"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white"
              onClick={() => setOpen(false)}
              aria-label="Close admin navigation"
            >
              <X size={20} />
            </button>
            {Sidebar}
          </div>
        </div>
      ) : null}

      <main className="px-4 py-8 sm:px-6 lg:ml-72 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
