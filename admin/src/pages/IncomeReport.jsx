import { Banknote, Download, RefreshCw, UsersRound } from "lucide-react";
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

const currentMonthValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const parseMonthValue = (value) => {
  const [year, month] = value.split("-").map(Number);
  return { year, month };
};

export default function IncomeReport() {
  const [report, setReport] = useState(null);
  const [monthValue, setMonthValue] = useState(currentMonthValue());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setError("");

    try {
      const { year, month } = parseMonthValue(monthValue);
      const response = await http.get("/reports/income", { params: { year, month } });
      setReport(response.data);
    } catch {
      setError("Unable to load income report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [monthValue]);

  const totals = report?.totals || {};
  const monthLabel = report?.period?.label || monthValue;

  const cards = [
    ["Completed Treatments", totals.completedCount || 0, UsersRound],
    ["Total Income", formatMoney(totals.totalIncome), Banknote],
    ["Male Therapy 20%", formatMoney(totals.maleTherapyShare), Banknote],
    ["Female Therapy 20%", formatMoney(totals.femaleTherapyShare), Banknote],
    ["Clinic Net", formatMoney(totals.netClinicIncome), Banknote]
  ];

  const downloadPdf = async () => {
    if (!report) return;

    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 42;
    let y = 48;

    const addPageIfNeeded = (height = 28) => {
      if (y + height < pageHeight - margin) return;
      doc.addPage();
      y = 48;
    };

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("SETHSUWA", margin, y);
    y += 26;
    doc.setFontSize(16);
    doc.text(`Monthly Income Report - ${monthLabel}`, margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString("en-LK")}`, margin, y);
    y += 30;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Summary", margin, y);
    y += 18;

    const summaryRows = [
      ["Completed treatments", totals.completedCount || 0],
      ["Total income", formatMoney(totals.totalIncome)],
      ["Male customer treatment income", formatMoney(totals.maleIncome)],
      ["Male therapist 20% share", formatMoney(totals.maleTherapyShare)],
      ["Female customer treatment income", formatMoney(totals.femaleIncome)],
      ["Female therapist 20% share", formatMoney(totals.femaleTherapyShare)],
      ["Clinic net income", formatMoney(totals.netClinicIncome)]
    ];

    doc.setFont("helvetica", "normal");
    summaryRows.forEach(([label, value]) => {
      addPageIfNeeded(20);
      doc.text(String(label), margin, y);
      doc.text(String(value), pageWidth - margin, y, { align: "right" });
      y += 18;
    });

    y += 18;
    addPageIfNeeded(42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Completed Treatments", margin, y);
    y += 20;

    const headers = ["Date", "Ref", "Client", "Gender", "Treatment", "Amount"];
    const widths = [68, 76, 96, 52, 160, 72];

    const drawHeader = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      let x = margin;
      headers.forEach((header, index) => {
        doc.text(header, x, y);
        x += widths[index];
      });
      y += 12;
      doc.line(margin, y, pageWidth - margin, y);
      y += 14;
      doc.setFont("helvetica", "normal");
    };

    drawHeader();

    (report.bookings || []).forEach((booking) => {
      addPageIfNeeded(32);
      if (y === 48) drawHeader();

      const row = [
        formatDate(booking.bookingDate),
        booking.publicId || "",
        booking.customerName || "",
        booking.customerGender || "",
        booking.treatmentName || "",
        formatMoney(booking.priceAmount)
      ];
      let x = margin;
      doc.setFontSize(7.5);
      row.forEach((cell, index) => {
        const text = doc.splitTextToSize(String(cell), widths[index] - 4);
        doc.text(text.slice(0, 2), x, y);
        x += widths[index];
      });
      y += 28;
    });

    if (!report.bookings?.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("No completed treatments for this month.", margin, y);
    }

    const safeMonth = monthLabel.replace(/\s+/g, "-").toLowerCase();
    doc.save(`sethsuwa-income-${safeMonth}.pdf`);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-brand-red">Income</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-brand-charcoal">Monthly Treatment Income</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            Select a month to view completed treatment income and download the details as a PDF.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-brand-charcoal">Month</span>
            <input
              type="month"
              value={monthValue}
              onChange={(event) => setMonthValue(event.target.value || currentMonthValue())}
              className="min-h-12 rounded-md border border-brand-gold/35 bg-white px-4 font-bold text-brand-charcoal outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            />
          </label>
          <div className="flex items-end gap-3">
            <button
              type="button"
              onClick={loadReport}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brand-red px-5 font-bold text-white transition hover:bg-brand-maroon"
            >
              <RefreshCw size={18} /> Refresh
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={!report}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-brand-charcoal px-5 font-bold text-white transition hover:bg-brand-maroon disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Download size={18} /> PDF
            </button>
          </div>
        </div>
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
            <p>Use the month selector to view older or newer monthly income reports. Booking records are not deleted by this report.</p>
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
        <h2 className="font-display text-2xl font-bold text-brand-charcoal">Completed Treatments - {monthLabel}</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-cream text-brand-charcoal">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Ref</th>
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
                  <td className="px-4 py-3 text-xs font-bold text-brand-gold">{booking.publicId}</td>
                  <td className="px-4 py-3 font-bold text-brand-maroon">{booking.customerName}</td>
                  <td className="px-4 py-3">{booking.customerGender || "Not set"}</td>
                  <td className="px-4 py-3">{booking.treatmentName}</td>
                  <td className="px-4 py-3 font-bold">{formatMoney(booking.priceAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!report?.bookings?.length ? (
            <p className="px-4 py-8 text-center text-slate-600">No completed treatments for this month.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
