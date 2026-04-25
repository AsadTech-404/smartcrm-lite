const stats = [
  { label: "Total Users", value: "1200" },
  { label: "Active Users", value: "860" },
  { label: "Revenue", value: "$12,400" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>

        {/* Working KPI cards grid */}
        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
