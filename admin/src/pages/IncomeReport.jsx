import { Banknote, RefreshCw, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { http } from "../api/http";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-LK", {
    dateStyle: "medium"
  }).format(new Date(value));

export default function IncomeReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await http.get("/reports/income", { params: { days: 45 } });
      setReport(response.data);
    } catch {
      setError("Unable to load income report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const totals = report?.totals || {};

  const cards = [
    ["Completed Treatments", totals.completedCount || 0, UsersRound],
    ["Total Income", formatMoney(totals.totalIncome), Banknote],
    ["Male Therapy 20%", formatMoney(totals.maleTherapyShare), Banknote],
    ["Female Therapy 20%", formatMoney(totals.femaleTherapyShare), Banknote],
    ["Clinic Net", formatMoney(totals.netClinicIncome), Banknote]
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-brand-red">Income</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-brand-charcoal">45 Day Treatment Income</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            This report only shows completed treatment bookings inside the latest 45 day window.
          </p>
        </div>
        <button
          type="button"
          onClick={loadReport}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-red px-5 py-3 font-bold text-white transition hover:bg-brand-maroon"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {error ? <p className="mt-6 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
      {loading ? <p className="mt-6 font-bold text-brand-maroon">Loading income report...</p> : null}

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value, Icon]) => (
          <article key={label} className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">{label}</span>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-cream text-brand-red">
                <Icon size={21} />
              </span>
            </div>
            <p className="mt-5 font-display text-3xl font-bold text-brand-maroon">{value}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-lg bg-brand-charcoal p-6 text-white shadow-soft">
          <h2 className="font-display text-2xl font-bold text-brand-gold">Therapy Split</h2>
          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Male customer treatment income</span>
                <span>{formatMoney(totals.maleIncome)}</span>
              </div>
              <div className="h-3 rounded-full bg-white/12">
                <div
                  className="h-3 rounded-full bg-brand-gold"
                  style={{ width: `${totals.totalIncome ? (totals.maleIncome / totals.totalIncome) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Female customer treatment income</span>
                <span>{formatMoney(totals.femaleIncome)}</span>
              </div>
              <div className="h-3 rounded-full bg-white/12">
                <div
                  className="h-3 rounded-full bg-brand-red"
                  style={{ width: `${totals.totalIncome ? (totals.femaleIncome / totals.totalIncome) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
          <h2 className="font-display text-2xl font-bold text-brand-charcoal">Report Rules</h2>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            <p>Only completed bookings are counted as income.</p>
            <p>Male customer treatment income contributes 20% to the male therapy share.</p>
            <p>Female customer treatment income contributes 20% to the female therapy share.</p>
            <p>The report window is limited to 45 days, so older completed bookings are hidden from this page.</p>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
        <h2 className="font-display text-2xl font-bold text-brand-charcoal">Completed Treatments</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-cream text-brand-charcoal">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Treatment</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(report?.bookings || []).map((booking) => (
                <tr key={booking._id} className="border-b border-brand-gold/15">
                  <td className="px-4 py-3">{formatDate(booking.bookingDate)}</td>
                  <td className="px-4 py-3 font-bold text-brand-maroon">{booking.customerName}</td>
                  <td className="px-4 py-3">{booking.customerGender || "Not set"}</td>
                  <td className="px-4 py-3">{booking.treatmentName}</td>
                  <td className="px-4 py-3 font-bold">{formatMoney(booking.priceAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!report?.bookings?.length ? (
            <p className="px-4 py-8 text-center text-slate-600">No completed treatments in the last 45 days.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
