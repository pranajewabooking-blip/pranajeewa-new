import { Ban, CheckCircle2, RefreshCw, ShieldAlert, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { http } from "../api/http";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-LK", {
        dateStyle: "medium"
      }).format(new Date(value))
    : "No bookings";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export default function ClientsManage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const loadClients = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await http.get("/customers/admin/all");
      setClients(response.data.customers || []);
    } catch {
      setError("Unable to load clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const cancelRiskClients = useMemo(
    () => clients.filter((client) => (client.stats?.cancelledBookings || client.cancelCount || 0) > 0),
    [clients]
  );

  const toggleBlacklist = async (client) => {
    const nextValue = !client.isBlacklisted;
    const reason = nextValue
      ? window.prompt("Reason for blacklisting this client?", client.blacklistReason || "Repeated booking cancellations")
      : "";

    if (nextValue && reason === null) return;

    setSavingId(client._id);
    setError("");

    try {
      const response = await http.patch(`/customers/${client._id}/blacklist`, {
        isBlacklisted: nextValue,
        blacklistReason: reason || ""
      });

      setClients((current) =>
        current.map((item) =>
          item._id === client._id
            ? {
                ...item,
                ...response.data.customer
              }
            : item
        )
      );
    } catch {
      setError("Unable to update client status.");
    } finally {
      setSavingId("");
    }
  };

  const ClientCard = ({ client }) => (
    <article className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-black/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          {client.avatar ? (
            <img src={client.avatar} alt={client.name} className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-red text-white">
              <UserRound size={24} />
            </span>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-brand-maroon">
                Rank #{client.rank}
              </span>
              {client.isBlacklisted ? (
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">Blacklisted</span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Active</span>
              )}
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-brand-maroon">{client.name}</h2>
            <p className="text-sm text-slate-600">{client.email}</p>
            <p className="mt-2 text-sm text-slate-600">
              Mobile: {client.mobileNumber || "Not set"} | WhatsApp: {client.whatsappNumber || "Not set"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Gender: {client.gender || "Not set"} | Last booking: {formatDate(client.stats?.lastBookingAt)}
            </p>
            {client.blacklistReason ? <p className="mt-2 text-sm font-semibold text-rose-700">{client.blacklistReason}</p> : null}
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleBlacklist(client)}
          disabled={savingId === client._id}
          className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 font-bold transition disabled:opacity-70 ${
            client.isBlacklisted
              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              : "bg-rose-100 text-rose-700 hover:bg-rose-200"
          }`}
        >
          {client.isBlacklisted ? <CheckCircle2 size={17} /> : <Ban size={17} />}
          {savingId === client._id ? "Saving..." : client.isBlacklisted ? "Remove Blacklist" : "Blacklist"}
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total", client.stats?.totalBookings || 0],
          ["Completed", client.stats?.completedBookings || 0],
          ["Pending", client.stats?.pendingBookings || 0],
          ["Active", client.stats?.activeBookings || 0],
          ["Cancelled", client.stats?.cancelledBookings || client.cancelCount || 0]
        ].map(([label, value]) => (
          <div key={label} className="rounded-md bg-brand-cream p-3">
            <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-brand-charcoal">{value}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm font-bold text-brand-leaf">Completed value: {formatMoney(client.stats?.totalSpent)}</p>
    </article>
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-brand-red">Client Management</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-brand-charcoal">Clients</h1>
        </div>
        <button
          type="button"
          onClick={loadClients}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-red px-5 py-3 font-bold text-white transition hover:bg-brand-maroon"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {error ? <p className="mt-6 rounded-md bg-rose-100 px-4 py-3 text-sm font-bold text-rose-800">{error}</p> : null}
      {loading ? <p className="mt-6 font-bold text-brand-maroon">Loading clients...</p> : null}

      <section className="mt-8 rounded-lg bg-brand-charcoal p-6 text-white shadow-soft">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-brand-gold" size={24} />
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-gold">Cancellation Watchlist</h2>
            <p className="mt-1 text-sm text-white/70">Clients who have cancelled at least one booking.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cancelRiskClients.map((client) => (
            <div key={client._id} className="rounded-md bg-white/10 p-4">
              <p className="font-bold">{client.name}</p>
              <p className="mt-1 text-sm text-white/70">{client.email}</p>
              <p className="mt-3 font-display text-3xl font-bold text-brand-gold">
                {client.stats?.cancelledBookings || client.cancelCount || 0}
              </p>
              <p className="text-xs uppercase text-white/55">Cancellations</p>
            </div>
          ))}
          {!cancelRiskClients.length ? <p className="text-white/70">No cancellations recorded yet.</p> : null}
        </div>
      </section>

      <div className="mt-8 space-y-5">
        {clients.map((client) => (
          <ClientCard key={client._id} client={client} />
        ))}
        {!loading && !clients.length ? (
          <p className="rounded-lg bg-white px-6 py-8 text-center text-slate-600 shadow-soft">
            No clients found yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
