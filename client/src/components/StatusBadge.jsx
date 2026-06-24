const statusClasses = {
  Pending: "bg-amber-100 text-amber-800 ring-amber-200",
  Active: "bg-sky-100 text-sky-800 ring-sky-200",
  Completed: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Cancelled: "bg-rose-100 text-rose-800 ring-rose-200"
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusClasses[status] || statusClasses.Pending}`}>
      {status}
    </span>
  );
}
