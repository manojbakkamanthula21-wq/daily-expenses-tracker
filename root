import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Plus, X, Search, Download, Upload, Trash2, Pencil, Banknote, CreditCard,
  Utensils, Plane, ShoppingBag, Receipt, Film, MoreHorizontal, Sun, Moon,
  AlertTriangle, Check, ChevronDown, BookOpen, LayoutGrid, History as HistoryIcon,
  BarChart3, Settings as SettingsIcon
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

/* ---------------------------------------------------------------------- */
/* Design tokens                                                          */
/* ---------------------------------------------------------------------- */

const THEMES = {
  dark: {
    bg: "#12181A",
    bgAlt: "#0D1213",
    surface: "#1C2528",
    surface2: "#232E31",
    surface3: "#2A3639",
    border: "#33403F",
    borderSoft: "#263030",
    ink: "#ECE7D9",
    inkDim: "#A9B0AC",
    muted: "#74807D",
    gold: "#C9A15A",
    goldDim: "#8A7040",
    teal: "#6FA8A0",
    tealDim: "#3F5D58",
    red: "#D97B6C",
    redDim: "#5B372F",
    green: "#8FB88A",
    greenDim: "#3B4E38",
    plum: "#A98BB0",
    slate: "#7C93A6",
    shadow: "0 8px 24px rgba(0,0,0,0.35)",
  },
  light: {
    bg: "#EFEAE0",
    bgAlt: "#E5DECF",
    surface: "#FBF9F3",
    surface2: "#FFFFFF",
    surface3: "#F2EEE3",
    border: "#DCD5C2",
    borderSoft: "#E6E0D2",
    ink: "#231F16",
    inkDim: "#544E3F",
    muted: "#8A8270",
    gold: "#A87C2E",
    goldDim: "#E8D6AE",
    teal: "#3E7C74",
    tealDim: "#CFE3DF",
    red: "#B0503F",
    redDim: "#F1D9D2",
    green: "#4F7A49",
    greenDim: "#D9E7D5",
    plum: "#7A5D82",
    slate: "#4C647A",
    shadow: "0 8px 24px rgba(70,60,30,0.10)",
  },
};

const CATEGORIES = [
  { key: "Food", icon: Utensils, color: "gold" },
  { key: "Travel", icon: Plane, color: "slate" },
  { key: "Shopping", icon: ShoppingBag, color: "plum" },
  { key: "Bills", icon: Receipt, color: "red" },
  { key: "Entertainment", icon: Film, color: "teal" },
  { key: "Other", icon: MoreHorizontal, color: "muted" },
];

const CURRENCIES = [
  { key: "INR", symbol: "\u20B9", label: "Rupee", locale: "en-IN" },
  { key: "GBP", symbol: "\u00A3", label: "Pound", locale: "en-GB" },
];

const PAYMENTS = [
  { key: "Cash", icon: Banknote },
  { key: "Card", icon: CreditCard },
];

const STORAGE_KEY = "expenses:v1";

/* ---------------------------------------------------------------------- */
/* Helpers                                                                */
/* ---------------------------------------------------------------------- */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function fmtMoney(amount, currency) {
  const c = CURRENCIES.find((x) => x.key === currency) || CURRENCIES[0];
  const n = Number(amount) || 0;
  return c.symbol + n.toLocaleString(c.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDateLabel(iso) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function isThisWeek(iso) {
  return iso >= daysAgo(6) && iso <= todayISO();
}

function isThisMonth(iso) {
  const now = new Date();
  const d = new Date(iso + "T00:00:00");
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function monthKey(iso) {
  return iso.slice(0, 7);
}

function monthLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "short", year: "2-digit" });
}

function emptyTotals() {
  return { INR: 0, GBP: 0 };
}

function sampleData() {
  const t = todayISO();
  const rows = [
    { amount: 320, currency: "INR", category: "Food", payment: "Cash", date: t, note: "Lunch with team" },
    { amount: 1450, currency: "INR", category: "Shopping", payment: "Card", date: daysAgo(1), note: "New shoes" },
    { amount: 18.5, currency: "GBP", category: "Food", payment: "Card", date: daysAgo(2), note: "Groceries" },
    { amount: 60, currency: "GBP", category: "Bills", payment: "Card", date: daysAgo(3), note: "Mobile bill" },
    { amount: 250, currency: "INR", category: "Travel", payment: "Cash", date: daysAgo(4), note: "Auto fare" },
    { amount: 12.99, currency: "GBP", category: "Entertainment", payment: "Card", date: daysAgo(6), note: "Cinema" },
    { amount: 2200, currency: "INR", category: "Bills", payment: "Card", date: daysAgo(9), note: "Electricity" },
    { amount: 45, currency: "GBP", category: "Shopping", payment: "Cash", date: daysAgo(15), note: "Books" },
    { amount: 890, currency: "INR", category: "Entertainment", payment: "Cash", date: daysAgo(28), note: "Concert tickets" },
    { amount: 33.2, currency: "GBP", category: "Travel", payment: "Card", date: daysAgo(40), note: "Train ticket" },
    { amount: 610, currency: "INR", category: "Other", payment: "Cash", date: daysAgo(52), note: "Gift" },
  ];
  return rows.map((r) => ({ id: uid(), createdAt: Date.now() - Math.random() * 1000, isSample: true, ...r }));
}

/* ---------------------------------------------------------------------- */
/* Small UI atoms                                                         */
/* ---------------------------------------------------------------------- */

function CategoryIcon({ category, size = 16 }) {
  const c = CATEGORIES.find((x) => x.key === category) || CATEGORIES[5];
  const Icon = c.icon;
  return <Icon size={size} strokeWidth={1.8} />;
}

function Toast({ message, theme }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 22,
        right: 22,
        background: theme.surface3,
        border: `1px solid ${theme.border}`,
        color: theme.ink,
        borderRadius: 10,
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        boxShadow: theme.shadow,
        zIndex: 200,
        fontSize: 13.5,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Check size={16} color={theme.green} />
      {message}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Main App                                                               */
/* ---------------------------------------------------------------------- */

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [themeName, setThemeName] = useState("dark");
  const [tab, setTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState("");
  const [chartCurrency, setChartCurrency] = useState("INR");
  const [clearConfirm, setClearConfirm] = useState(null); // 'sample' | 'all' | null

  const [q, setQ] = useState("");
  const [fCategory, setFCategory] = useState("All");
  const [fCurrency, setFCurrency] = useState("All");
  const [fPayment, setFPayment] = useState("All");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");

  const fileInputRef = useRef(null);
  const theme = THEMES[themeName];

  /* ---------------- Persistence ---------------- */

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (!cancelled) {
          if (res && res.value) {
            const parsed = JSON.parse(res.value);
            setExpenses(Array.isArray(parsed) ? parsed : []);
          } else {
            const seed = sampleData();
            setExpenses(seed);
            await window.storage.set(STORAGE_KEY, JSON.stringify(seed), false);
          }
        }
      } catch (e) {
        if (!cancelled) {
          const seed = sampleData();
          setExpenses(seed);
          try {
            await window.storage.set(STORAGE_KEY, JSON.stringify(seed), false);
          } catch (e2) {}
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    try {
      const savedTheme = window.localStorage ? null : null;
    } catch (e) {}
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next) => {
    setExpenses(next);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(next), false);
    } catch (e) {
      console.error("Storage error", e);
    }
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 2500);
  }, []);

  /* ---------------- CRUD ---------------- */

  const handleSave = (data) => {
    if (editing) {
      const next = expenses.map((e) => (e.id === editing.id ? { ...e, ...data } : e));
      persist(next);
      showToast("Expense updated");
    } else {
      const next = [{ id: uid(), createdAt: Date.now(), isSample: false, ...data }, ...expenses];
      persist(next);
      showToast("Expense saved");
    }
    setShowModal(false);
    setEditing(null);
  };

  const confirmDelete = () => {
    const next = expenses.filter((e) => e.id !== deleteTarget);
    persist(next);
    setDeleteTarget(null);
    showToast("Expense deleted");
  };

  const doClear = () => {
    if (clearConfirm === "sample") {
      persist(expenses.filter((e) => !e.isSample));
      showToast("Sample data cleared");
    } else if (clearConfirm === "all") {
      persist([]);
      showToast("All expenses cleared");
    }
    setClearConfirm(null);
  };

  /* ---------------- Export / Import ---------------- */

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported as JSON");
  };

  const exportCSV = () => {
    const header = ["date", "amount", "currency", "category", "payment", "note"];
    const rows = expenses.map((e) =>
      [e.date, e.amount, e.currency, e.category, e.payment, (e.note || "").replace(/"/g, '""')]
        .map((v) => `"${v}"`)
        .join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported as CSV");
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const list = Array.isArray(parsed) ? parsed : [];
        const cleaned = list
          .filter((r) => r && r.amount && r.currency && r.category && r.date)
          .map((r) => ({
            id: uid(),
            createdAt: Date.now(),
            isSample: false,
            amount: Number(r.amount),
            currency: r.currency,
            category: r.category,
            payment: r.payment || "Cash",
            date: r.date,
            note: r.note || "",
          }));
        persist([...cleaned, ...expenses]);
        showToast(`Imported ${cleaned.length} expense${cleaned.length === 1 ? "" : "s"}`);
      } catch (e) {
        showToast("Import failed: invalid file");
      }
    };
    reader.readAsText(file);
  };

  /* ---------------- Derived data ---------------- */

  const totals = useMemo(() => {
    const today = emptyTotals();
    const week = emptyTotals();
    const month = emptyTotals();
    const all = emptyTotals();
    const cash = emptyTotals();
    const card = emptyTotals();
    for (const e of expenses) {
      const amt = Number(e.amount) || 0;
      all[e.currency] = (all[e.currency] || 0) + amt;
      if (e.date === todayISO()) today[e.currency] += amt;
      if (isThisWeek(e.date)) week[e.currency] += amt;
      if (isThisMonth(e.date)) month[e.currency] += amt;
      if (e.payment === "Cash") cash[e.currency] += amt;
      else card[e.currency] += amt;
    }
    return { today, week, month, all, cash, card, count: expenses.length };
  }, [expenses]);

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => {
        if (fCategory !== "All" && e.category !== fCategory) return false;
        if (fCurrency !== "All" && e.currency !== fCurrency) return false;
        if (fPayment !== "All" && e.payment !== fPayment) return false;
        if (fFrom && e.date < fFrom) return false;
        if (fTo && e.date > fTo) return false;
        if (q) {
          const hay = `${e.note || ""} ${e.category}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      })
      .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1));
  }, [expenses, fCategory, fCurrency, fPayment, fFrom, fTo, q]);

  const monthlySeries = useMemo(() => {
    const map = {};
    for (const e of expenses) {
      if (e.currency !== chartCurrency) continue;
      const k = monthKey(e.date);
      map[k] = (map[k] || 0) + Number(e.amount);
    }
    const keys = Object.keys(map).sort().slice(-6);
    return keys.map((k) => ({ month: monthLabel(k), total: Math.round(map[k] * 100) / 100 }));
  }, [expenses, chartCurrency]);

  const categorySeries = useMemo(() => {
    const map = {};
    for (const e of expenses) {
      if (e.currency !== chartCurrency) continue;
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    }
    return CATEGORIES.filter((c) => map[c.key]).map((c) => ({
      name: c.key,
      value: Math.round(map[c.key] * 100) / 100,
      color: theme[c.color] || theme.muted,
    }));
  }, [expenses, chartCurrency, theme]);

  const cashCardSeries = useMemo(() => {
    let cash = 0,
      card = 0;
    for (const e of expenses) {
      if (e.currency !== chartCurrency) continue;
      if (e.payment === "Cash") cash += Number(e.amount);
      else card += Number(e.amount);
    }
    return [
      { name: "Cash", total: Math.round(cash * 100) / 100 },
      { name: "Card", total: Math.round(card * 100) / 100 },
    ];
  }, [expenses, chartCurrency]);

  /* ---------------- Render ---------------- */

  const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');`;

  return (
    <div
      style={{
        background: theme.bg,
        color: theme.ink,
        minHeight: 600,
        fontFamily: "'Inter', sans-serif",
        transition: "background 0.2s ease",
      }}
    >
      <style>{`
        ${fontImport}
        * { box-sizing: border-box; }
        .et-num { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
        .et-serif { font-family: 'Fraunces', serif; }
        .et-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .et-scroll::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
        input, select, textarea, button { font-family: inherit; }
        input::placeholder, textarea::placeholder { color: ${theme.muted}; }
        .et-fade-in { animation: etFadeIn 0.18s ease; }
        @keyframes etFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {loading ? (
        <LoadingState theme={theme} />
      ) : (
        <>
          <Header theme={theme} themeName={themeName} setThemeName={setThemeName} onAdd={() => { setEditing(null); setShowModal(true); }} />
          <TabNav theme={theme} tab={tab} setTab={setTab} />

          <div style={{ padding: "20px 24px 60px", maxWidth: 1100, margin: "0 auto" }}>
            {tab === "dashboard" && (
              <Dashboard theme={theme} totals={totals} expenses={expenses} />
            )}
            {tab === "history" && (
              <HistoryTab
                theme={theme}
                filtered={filtered}
                q={q} setQ={setQ}
                fCategory={fCategory} setFCategory={setFCategory}
                fCurrency={fCurrency} setFCurrency={setFCurrency}
                fPayment={fPayment} setFPayment={setFPayment}
                fFrom={fFrom} setFFrom={setFFrom}
                fTo={fTo} setFTo={setFTo}
                onEdit={(e) => { setEditing(e); setShowModal(true); }}
                onDelete={(id) => setDeleteTarget(id)}
              />
            )}
            {tab === "insights" && (
              <Insights
                theme={theme}
                chartCurrency={chartCurrency}
                setChartCurrency={setChartCurrency}
                monthlySeries={monthlySeries}
                categorySeries={categorySeries}
                cashCardSeries={cashCardSeries}
                hasData={expenses.some((e) => e.currency === chartCurrency)}
              />
            )}
            {tab === "settings" && (
              <SettingsTab
                theme={theme}
                onExportJSON={exportJSON}
                onExportCSV={exportCSV}
                onImportClick={() => fileInputRef.current && fileInputRef.current.click()}
                onClearSample={() => setClearConfirm("sample")}
                onClearAll={() => setClearConfirm("all")}
                hasSample={expenses.some((e) => e.isSample)}
                count={expenses.length}
              />
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files && e.target.files[0];
              if (f) handleImport(f);
              e.target.value = "";
            }}
          />

          {showModal && (
            <ExpenseModal
              theme={theme}
              initial={editing}
              onClose={() => { setShowModal(false); setEditing(null); }}
              onSave={handleSave}
            />
          )}

          {deleteTarget && (
            <ConfirmDialog
              theme={theme}
              title="Delete this expense?"
              body="This action can't be undone."
              confirmLabel="Delete"
              danger
              onCancel={() => setDeleteTarget(null)}
              onConfirm={confirmDelete}
            />
          )}

          {clearConfirm && (
            <ConfirmDialog
              theme={theme}
              title={clearConfirm === "sample" ? "Clear sample data?" : "Clear all expenses?"}
              body={
                clearConfirm === "sample"
                  ? "This removes the sample entries only. Your own expenses stay untouched."
                  : "This permanently removes every expense in your history. This action can't be undone."
              }
              confirmLabel="Clear"
              danger
              onCancel={() => setClearConfirm(null)}
              onConfirm={doClear}
            />
          )}

          <Toast message={toast} theme={theme} />
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Loading                                                                */
/* ---------------------------------------------------------------------- */

function LoadingState({ theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, color: theme.muted, gap: 10 }}>
      <BookOpen size={20} />
      <span>Opening the ledger…</span>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Header + Nav                                                           */
/* ---------------------------------------------------------------------- */

function Header({ theme, themeName, setThemeName, onAdd }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 24px 16px",
        borderBottom: `1px solid ${theme.borderSoft}`,
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 8,
            background: theme.gold, color: theme.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <BookOpen size={19} strokeWidth={2} />
        </div>
        <div>
          <div className="et-serif" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>Ledger</div>
          <div style={{ fontSize: 11.5, color: theme.muted, letterSpacing: 0.3 }}>Daily expenses, kept honest</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={() => setThemeName(themeName === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          style={{
            width: 36, height: 36, borderRadius: 8,
            border: `1px solid ${theme.border}`, background: theme.surface,
            color: theme.inkDim, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {themeName === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={onAdd}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: theme.gold, color: theme.bg, border: "none",
            borderRadius: 8, padding: "9px 16px", fontWeight: 600, fontSize: 13.5,
            cursor: "pointer",
          }}
        >
          <Plus size={16} strokeWidth={2.5} /> Add expense
        </button>
      </div>
    </div>
  );
}

function TabNav({ theme, tab, setTab }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { key: "history", label: "History", icon: HistoryIcon },
    { key: "insights", label: "Insights", icon: BarChart3 },
    { key: "settings", label: "Settings", icon: SettingsIcon },
  ];
  return (
    <div
      style={{
        display: "flex", gap: 4, padding: "0 24px",
        borderBottom: `1px solid ${theme.borderSoft}`,
        overflowX: "auto",
      }}
      className="et-scroll"
    >
      {items.map((it) => {
        const active = tab === it.key;
        const Icon = it.icon;
        return (
          <button
            key={it.key}
            onClick={() => setTab(it.key)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "12px 14px",
              background: "none", border: "none", cursor: "pointer",
              color: active ? theme.gold : theme.muted,
              borderBottom: active ? `2px solid ${theme.gold}` : "2px solid transparent",
              fontSize: 13.5, fontWeight: active ? 600 : 500,
              whiteSpace: "nowrap",
            }}
          >
            <Icon size={15} strokeWidth={2} /> {it.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Currency ledger tabs (signature element)                               */
/* ---------------------------------------------------------------------- */

function LedgerTabs({ theme, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {CURRENCIES.map((c) => {
        const active = value === c.key;
        return (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            style={{
              padding: "7px 16px 6px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border: `1px solid ${active ? theme.gold : theme.border}`,
              borderBottom: active ? `1px solid ${theme.surface}` : `1px solid ${theme.border}`,
              background: active ? theme.surface : "transparent",
              color: active ? theme.gold : theme.muted,
              borderRadius: "8px 8px 0 0",
              marginBottom: -1,
              position: "relative",
              zIndex: active ? 2 : 1,
              transform: active ? "translateY(0)" : "translateY(2px)",
              transition: "transform 0.12s ease",
            }}
          >
            {c.symbol} {c.key}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Dashboard                                                              */
/* ---------------------------------------------------------------------- */

function StatCard({ theme, label, values, accent }) {
  return (
    <div
      style={{
        background: theme.surface, border: `1px solid ${theme.borderSoft}`,
        borderRadius: 12, padding: "16px 18px", flex: "1 1 200px", minWidth: 200,
      }}
    >
      <div style={{ fontSize: 12, color: theme.muted, marginBottom: 10, letterSpacing: 0.3 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {CURRENCIES.map((c) => (
          <div key={c.key} className="et-num" style={{ fontSize: 20, fontWeight: 600, color: values[c.key] > 0 ? (accent || theme.ink) : theme.muted }}>
            {fmtMoney(values[c.key] || 0, c.key)}
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ theme, totals, expenses }) {
  if (expenses.length === 0) {
    return <EmptyState theme={theme} />;
  }
  return (
    <div className="et-fade-in">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
        <StatCard theme={theme} label="Today" values={totals.today} accent={theme.red} />
        <StatCard theme={theme} label="This week" values={totals.week} accent={theme.red} />
        <StatCard theme={theme} label="This month" values={totals.month} accent={theme.red} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
        <StatCard theme={theme} label="All-time total" values={totals.all} />
        <StatCard theme={theme} label="Paid by cash" values={totals.cash} accent={theme.gold} />
        <StatCard theme={theme} label="Paid by card" values={totals.card} accent={theme.teal} />
      </div>

      <div
        style={{
          background: theme.surface, border: `1px solid ${theme.borderSoft}`,
          borderRadius: 12, padding: "16px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10,
        }}
      >
        <div style={{ fontSize: 12, color: theme.muted }}>Entries recorded</div>
        <div className="et-num" style={{ fontSize: 22, fontWeight: 600 }}>{totals.count}</div>
      </div>
    </div>
  );
}

function EmptyState({ theme, ctaLabel = "Add expense", onCta }) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "70px 20px", textAlign: "center", color: theme.muted,
        border: `1px dashed ${theme.border}`, borderRadius: 14,
      }}
    >
      <BookOpen size={30} strokeWidth={1.5} style={{ marginBottom: 12, color: theme.gold }} />
      <div className="et-serif" style={{ fontSize: 18, color: theme.ink, marginBottom: 4 }}>No expenses yet</div>
      <div style={{ fontSize: 13, maxWidth: 320 }}>Add your first entry and it will show up here, in your dashboard, and in your history.</div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* History                                                                */
/* ---------------------------------------------------------------------- */

function FilterSelect({ theme, value, onChange, options, style }) {
  return (
    <div style={{ position: "relative", ...style }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none",
          width: "100%",
          background: theme.surface2,
          color: theme.ink,
          border: `1px solid ${theme.border}`,
          borderRadius: 8,
          padding: "8px 28px 8px 10px",
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={14} style={{ position: "absolute", right: 9, top: 10, color: theme.muted, pointerEvents: "none" }} />
    </div>
  );
}

function HistoryTab({
  theme, filtered, q, setQ, fCategory, setFCategory, fCurrency, setFCurrency,
  fPayment, setFPayment, fFrom, setFFrom, fTo, setFTo, onEdit, onDelete,
}) {
  return (
    <div className="et-fade-in">
      <div
        style={{
          display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16,
          background: theme.surface, border: `1px solid ${theme.borderSoft}`,
          borderRadius: 12, padding: 14,
        }}
      >
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: theme.muted }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search note or category"
            style={{
              width: "100%", background: theme.surface2, color: theme.ink,
              border: `1px solid ${theme.border}`, borderRadius: 8,
              padding: "8px 10px 8px 30px", fontSize: 13,
            }}
          />
        </div>
        <FilterSelect theme={theme} value={fCategory} onChange={setFCategory} options={["All", ...CATEGORIES.map((c) => c.key)]} style={{ width: 140 }} />
        <FilterSelect theme={theme} value={fCurrency} onChange={setFCurrency} options={["All", ...CURRENCIES.map((c) => c.key)]} style={{ width: 100 }} />
        <FilterSelect theme={theme} value={fPayment} onChange={setFPayment} options={["All", ...PAYMENTS.map((p) => p.key)]} style={{ width: 110 }} />
        <input
          type="date" value={fFrom} onChange={(e) => setFFrom(e.target.value)}
          style={{ background: theme.surface2, color: theme.ink, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", fontSize: 13 }}
        />
        <input
          type="date" value={fTo} onChange={(e) => setFTo(e.target.value)}
          style={{ background: theme.surface2, color: theme.ink, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", fontSize: 13 }}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState theme={theme} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((e) => {
            const cat = CATEGORIES.find((c) => c.key === e.category) || CATEGORIES[5];
            const catColor = theme[cat.color] || theme.muted;
            const Pay = PAYMENTS.find((p) => p.key === e.payment)?.icon || Banknote;
            return (
              <div
                key={e.id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: theme.surface, border: `1px solid ${theme.borderSoft}`,
                  borderRadius: 10, padding: "12px 14px",
                }}
              >
                <div
                  style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${catColor}22`, color: catColor,
                  }}
                >
                  <CategoryIcon category={e.category} size={16} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{e.category}</span>
                    <span style={{ fontSize: 11.5, color: theme.muted, display: "flex", alignItems: "center", gap: 3 }}>
                      <Pay size={11} /> {e.payment}
                    </span>
                    <span style={{ fontSize: 11.5, color: theme.muted }}>{fmtDateLabel(e.date)}</span>
                  </div>
                  {e.note ? (
                    <div style={{ fontSize: 12, color: theme.inkDim, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {e.note}
                    </div>
                  ) : null}
                </div>

                <div className="et-num" style={{ fontSize: 15, fontWeight: 600, marginRight: 6, whiteSpace: "nowrap" }}>
                  {fmtMoney(e.amount, e.currency)}
                </div>

                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() => onEdit(e)}
                    aria-label="Edit"
                    style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${theme.border}`, background: theme.surface2, color: theme.inkDim, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onDelete(e.id)}
                    aria-label="Delete"
                    style={{ width: 30, height: 30, borderRadius: 7, border: `1px solid ${theme.border}`, background: theme.surface2, color: theme.red, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Insights                                                                */
/* ---------------------------------------------------------------------- */

function ChartCard({ theme, title, children }) {
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.borderSoft}`, borderRadius: 12, padding: "16px 16px 8px", marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: theme.inkDim }}>{title}</div>
      {children}
    </div>
  );
}

function Insights({ theme, chartCurrency, setChartCurrency, monthlySeries, categorySeries, cashCardSeries, hasData }) {
  const accent = chartCurrency === "INR" ? theme.gold : theme.teal;

  return (
    <div className="et-fade-in">
      <div style={{ marginBottom: 16 }}>
        <LedgerTabs theme={theme} value={chartCurrency} onChange={setChartCurrency} />
      </div>

      {!hasData ? (
        <EmptyState theme={theme} />
      ) : (
        <>
          <ChartCard theme={theme} title="Monthly spending (last 6 months)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlySeries} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke={theme.borderSoft} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: theme.muted, fontSize: 11 }} axisLine={{ stroke: theme.border }} tickLine={false} />
                <YAxis tick={{ fill: theme.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: theme.surface3, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => fmtMoney(v, chartCurrency)}
                  labelStyle={{ color: theme.ink }}
                />
                <Bar dataKey="total" fill={accent} radius={[4, 4, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <ChartCard theme={theme} title="By category">
              {categorySeries.length === 0 ? (
                <div style={{ fontSize: 12.5, color: theme.muted, padding: "20px 0" }}>No entries in this currency.</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categorySeries} dataKey="value" nameKey="name" innerRadius={44} outerRadius={72} paddingAngle={2}>
                      {categorySeries.map((c, i) => (
                        <Cell key={i} fill={c.color} stroke={theme.surface} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: theme.surface3, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }}
                      formatter={(v) => fmtMoney(v, chartCurrency)}
                    />
                    <Legend
                      formatter={(v) => <span style={{ color: theme.inkDim, fontSize: 11.5 }}>{v}</span>}
                      iconSize={8}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard theme={theme} title="Cash vs card">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={cashCardSeries} layout="vertical" margin={{ top: 6, right: 20, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={theme.borderSoft} horizontal={false} />
                  <XAxis type="number" tick={{ fill: theme.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: theme.inkDim, fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip
                    contentStyle={{ background: theme.surface3, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => fmtMoney(v, chartCurrency)}
                  />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]} maxBarSize={28}>
                    <Cell fill={theme.gold} />
                    <Cell fill={theme.teal} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Settings                                                                */
/* ---------------------------------------------------------------------- */

function SettingsRow({ theme, icon: Icon, title, desc, action, danger }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        padding: "14px 4px", borderBottom: `1px solid ${theme.borderSoft}`, flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: danger ? `${theme.red}22` : theme.surface3, color: danger ? theme.red : theme.inkDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} />
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: 12, color: theme.muted, marginTop: 1 }}>{desc}</div>
        </div>
      </div>
      {action}
    </div>
  );
}

function SmallButton({ theme, children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: "pointer",
        border: `1px solid ${danger ? theme.red : theme.border}`,
        background: "transparent",
        color: danger ? theme.red : theme.ink,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function SettingsTab({ theme, onExportJSON, onExportCSV, onImportClick, onClearSample, onClearAll, hasSample, count }) {
  return (
    <div className="et-fade-in" style={{ background: theme.surface, border: `1px solid ${theme.borderSoft}`, borderRadius: 12, padding: "4px 16px" }}>
      <SettingsRow
        theme={theme} icon={Download} title="Export as JSON"
        desc="Download your full expense history as a JSON file."
        action={<SmallButton theme={theme} onClick={onExportJSON}>Export</SmallButton>}
      />
      <SettingsRow
        theme={theme} icon={Download} title="Export as CSV"
        desc="Download your full expense history as a spreadsheet-friendly CSV."
        action={<SmallButton theme={theme} onClick={onExportCSV}>Export</SmallButton>}
      />
      <SettingsRow
        theme={theme} icon={Upload} title="Import data"
        desc="Restore expenses from a previously exported JSON file."
        action={<SmallButton theme={theme} onClick={onImportClick}>Import</SmallButton>}
      />
      {hasSample && (
        <SettingsRow
          theme={theme} icon={Trash2} title="Clear sample data"
          desc="Remove the starter entries used to demo the app. Your own entries stay."
          action={<SmallButton theme={theme} onClick={onClearSample}>Clear sample</SmallButton>}
        />
      )}
      <SettingsRow
        theme={theme} icon={AlertTriangle} title="Clear all expenses" danger
        desc={`Permanently delete all ${count} recorded expense${count === 1 ? "" : "s"}.`}
        action={<SmallButton theme={theme} onClick={onClearAll} danger>Clear all</SmallButton>}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Add / Edit modal                                                       */
/* ---------------------------------------------------------------------- */

function ExpenseModal({ theme, initial, onClose, onSave }) {
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [currency, setCurrency] = useState(initial ? initial.currency : "INR");
  const [category, setCategory] = useState(initial ? initial.category : "Food");
  const [payment, setPayment] = useState(initial ? initial.payment : "Cash");
  const [date, setDate] = useState(initial ? initial.date : todayISO());
  const [note, setNote] = useState(initial ? initial.note || "" : "");
  const [error, setError] = useState("");

  const submit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (!date) {
      setError("Pick a date.");
      return;
    }
    onSave({ amount: amt, currency, category, payment, date, note: note.trim() });
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 100, padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: theme.surface2, borderRadius: 14, border: `1px solid ${theme.border}`,
          width: "100%", maxWidth: 420, maxHeight: "88vh", overflowY: "auto",
          boxShadow: theme.shadow,
        }}
        className="et-scroll et-fade-in"
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 8px" }}>
          <div className="et-serif" style={{ fontSize: 18, fontWeight: 600 }}>{initial ? "Edit expense" : "Add expense"}</div>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", color: theme.muted, cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "10px 20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: theme.muted, display: "block", marginBottom: 6 }}>Amount</label>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", flex: 1, alignItems: "center", background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "0 10px" }}>
                <span style={{ color: theme.gold, fontWeight: 600, marginRight: 4 }}>
                  {CURRENCIES.find((c) => c.key === currency).symbol}
                </span>
                <input
                  className="et-num"
                  type="number" min="0" step="0.01" value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  style={{ flex: 1, background: "transparent", border: "none", color: theme.ink, padding: "9px 0", fontSize: 15, outline: "none" }}
                  autoFocus
                />
              </div>
              <SegButtons
                theme={theme}
                value={currency}
                onChange={setCurrency}
                options={CURRENCIES.map((c) => ({ key: c.key, label: c.symbol + " " + c.key }))}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: theme.muted, display: "block", marginBottom: 6 }}>Category</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = category === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setCategory(c.key)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      padding: "10px 6px", borderRadius: 9, cursor: "pointer",
                      border: `1px solid ${active ? theme.gold : theme.border}`,
                      background: active ? `${theme.gold}18` : theme.surface,
                      color: active ? theme.gold : theme.inkDim,
                    }}
                  >
                    <Icon size={16} />
                    <span style={{ fontSize: 11 }}>{c.key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, color: theme.muted, display: "block", marginBottom: 6 }}>Payment method</label>
            <SegButtons
              theme={theme}
              value={payment}
              onChange={setPayment}
              options={PAYMENTS.map((p) => ({ key: p.key, label: p.key, icon: p.icon }))}
              full
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: theme.muted, display: "block", marginBottom: 6 }}>Date</label>
            <input
              type="date" value={date} onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", background: theme.surface, color: theme.ink, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "9px 10px", fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, color: theme.muted, display: "block", marginBottom: 6 }}>Note (optional)</label>
            <textarea
              value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="What was this for?"
              rows={2}
              style={{ width: "100%", background: theme.surface, color: theme.ink, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "9px 10px", fontSize: 13.5, resize: "vertical" }}
            />
          </div>

          {error && <div style={{ fontSize: 12.5, color: theme.red }}>{error}</div>}

          <button
            onClick={submit}
            style={{
              marginTop: 4, background: theme.gold, color: theme.bg, border: "none",
              borderRadius: 9, padding: "11px 0", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}
          >
            {initial ? "Save changes" : "Save expense"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SegButtons({ theme, value, onChange, options, full }) {
  return (
    <div style={{ display: "flex", border: `1px solid ${theme.border}`, borderRadius: 8, overflow: "hidden", flex: full ? 1 : "none" }}>
      {options.map((o) => {
        const active = value === o.key;
        const Icon = o.icon;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              padding: "9px 12px", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
              border: "none", flex: full ? 1 : "none",
              background: active ? theme.gold : theme.surface,
              color: active ? theme.bg : theme.inkDim,
            }}
          >
            {Icon ? <Icon size={13} /> : null} {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Confirm dialog                                                         */
/* ---------------------------------------------------------------------- */

function ConfirmDialog({ theme, title, body, confirmLabel, danger, onCancel, onConfirm }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 120, padding: 16 }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="et-fade-in"
        style={{ background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 14, width: "100%", maxWidth: 340, padding: 20, boxShadow: theme.shadow }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${theme.red}22`, color: theme.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={16} />
          </div>
          <div className="et-serif" style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
        </div>
        <div style={{ fontSize: 13, color: theme.inkDim, marginBottom: 18 }}>{body}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.ink, fontSize: 13, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: theme.red, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
