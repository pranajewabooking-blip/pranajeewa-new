import { CalendarDays, Image, Stethoscope, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { http } from "../api/http";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const [stats, setStats] = useState({
    treatments: [],
    bookings: [],
    banners: []
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [treatments, bookings, banners] = await Promise.all([
          http.get("/treatments"),
          http.get("/bookings/admin/all"),
          http.get("/news-banners/admin/all")
        ]);

        setStats({
          treatments: treatments.data.treatments || [],
          bookings: bookings.data.bookings || [],
          banners: banners.data.banners || []
        });
      } catch {
        setStats({ treatments: [], bookings: [], banners: [] });
      }
    };

    loadStats();
  }, []);

  const pending = stats.bookings.filter((booking) => booking.status === "Pending").length;
  const active = stats.bookings.filter((booking) => booking.status === "Active").length;

  const cards = [
    { label: "Treatments", value: stats.treatments.length, icon: Stethoscope },
    { label: "Bookings", value: stats.bookings.length, icon: CalendarDays },
    { label: "Pending", value: pending, icon: UsersRound },
    { label: "Banners", value: stats.banners.length, icon: Image }
  ];

  return (
    <div>
      <div>
        <p className="text-sm font-bold uppercase text-brand-red">Overview</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-brand-charcoal">Sethsuwa Dashboard</h1>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">{card.label}</span>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-cream text-brand-red">
                  <Icon size={21} />
                </span>
              </div>
              <p className="mt-5 font-display text-5xl font-bold text-brand-maroon">{card.value}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
          <h2 className="font-display text-2xl font-bold text-brand-charcoal">Recent Bookings</h2>
          <div className="mt-5 space-y-4">
            {stats.bookings.slice(0, 6).map((booking) => (
              <div key={booking._id} className="flex flex-col gap-3 rounded-md bg-brand-cream p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold text-brand-maroon">{booking.customerName}</p>
                  <p className="text-sm text-slate-600">{booking.treatment?.name} | {booking.bookingTime}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            ))}
            {!stats.bookings.length ? <p className="text-slate-600">No bookings yet.</p> : null}
          </div>
        </section>

        <section className="rounded-lg bg-brand-charcoal p-6 text-white shadow-soft">
          <h2 className="font-display text-2xl font-bold text-brand-gold">Booking Pulse</h2>
          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Active</span>
                <span>{active}</span>
              </div>
              <div className="h-3 rounded-full bg-white/12">
                <div className="h-3 rounded-full bg-brand-gold" style={{ width: `${stats.bookings.length ? (active / stats.bookings.length) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Pending</span>
                <span>{pending}</span>
              </div>
              <div className="h-3 rounded-full bg-white/12">
                <div className="h-3 rounded-full bg-brand-red" style={{ width: `${stats.bookings.length ? (pending / stats.bookings.length) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
