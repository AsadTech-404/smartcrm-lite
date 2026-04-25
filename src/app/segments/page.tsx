"use client";

import { useEffect, useMemo, useState } from "react";

type UserStatus = "Active" | "Inactive";
type SegmentFilter = "All Users" | "Active" | "Inactive";

type User = {
  name: string;
  status: UserStatus;
};

const users: User[] = [
  { name: "Ayesha Khan", status: "Active" },
  { name: "Bilal Ahmed", status: "Inactive" },
  { name: "Hina Ali", status: "Active" },
  { name: "Usman Tariq", status: "Active" },
  { name: "Sara Noor", status: "Inactive" },
  { name: "Zain Iqbal", status: "Active" },
  { name: "Mariam Raza", status: "Inactive" },
];

const filters: SegmentFilter[] = ["All Users", "Active", "Inactive"];

export default function SegmentsPage() {
  const [selectedFilter, setSelectedFilter] = useState<SegmentFilter>("All Users");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeCount = useMemo(
    () => users.filter((user) => user.status === "Active").length,
    [],
  );
  const inactiveCount = useMemo(
    () => users.filter((user) => user.status === "Inactive").length,
    [],
  );

  const filteredUsers = useMemo(() => {
    if (selectedFilter === "All Users") {
      return users;
    }

    return users.filter((user) => user.status === selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsTransitioning(false), 180);
    return () => window.clearTimeout(timeout);
  }, [selectedFilter]);

  const handleFilterChange = (filter: SegmentFilter) => {
    if (filter === selectedFilter) {
      return;
    }

    setIsTransitioning(true);
    setSelectedFilter(filter);
  };

  return (
    <main className="p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Segments</h1>

        {/* Working segment summary cards */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleFilterChange("Active")}
            className={`rounded-2xl border p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              selectedFilter === "Active"
                ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-sm font-medium text-slate-600">Active Users</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{activeCount}</p>
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange("Inactive")}
            className={`rounded-2xl border p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              selectedFilter === "Inactive"
                ? "border-rose-300 bg-rose-50 ring-2 ring-rose-100"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-sm font-medium text-slate-600">Inactive Users</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{inactiveCount}</p>
          </button>
        </section>

        {/* Working filter tabs + filtered users list */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive = selectedFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterChange(filter)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <div
            className={`mt-5 space-y-3 transition-all duration-200 ${
              isTransitioning ? "translate-y-1 opacity-60" : "translate-y-0 opacity-100"
            }`}
          >
            {filteredUsers.map((user) => (
              <article
                key={user.name}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
              >
                <p className="font-medium text-slate-900">{user.name}</p>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {user.status}
                </span>
              </article>
            ))}

            {filteredUsers.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                No users found for this segment.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
