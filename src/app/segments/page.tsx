"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Users } from "lucide-react";

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
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
        <h1 className="text-base font-semibold tracking-tight text-foreground md:text-lg lg:text-xl">
          User Segments
        </h1>

        {/* Working segment summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleFilterChange("Active")}
            className={`min-h-28 rounded-2xl border border-border bg-card p-4 text-left text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:p-5 ${
              selectedFilter === "Active"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-card/90"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    selectedFilter === "Active"
                      ? "text-primary-foreground/90"
                      : "text-muted-foreground"
                  }`}
                >
                  Active
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{activeCount}</p>
              </div>
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-all duration-200 ${
                  selectedFilter === "Active"
                    ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                <Activity className="h-4 w-4" />
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange("Inactive")}
            className={`min-h-28 rounded-2xl border border-border bg-card p-4 text-left text-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:p-5 ${
              selectedFilter === "Inactive"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-card/90"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    selectedFilter === "Inactive"
                      ? "text-primary-foreground/90"
                      : "text-muted-foreground"
                  }`}
                >
                  Inactive
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{inactiveCount}</p>
              </div>
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-all duration-200 ${
                  selectedFilter === "Inactive"
                    ? "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                <Users className="h-4 w-4" />
              </span>
            </div>
          </button>
        </section>

        {/* Working filter tabs + filtered users list */}
        <section className="rounded-2xl border border-border bg-card p-4 text-foreground shadow-sm transition-all duration-200 md:p-6">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {filters.map((filter) => {
              const isActive = selectedFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterChange(filter)}
                  className={`h-11 rounded-full px-4 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-background text-muted-foreground hover:bg-card"
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
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-foreground transition-all duration-200 hover:bg-background"
              >
                <p className="text-sm font-semibold md:text-base">{user.name}</p>
                <span
                  className={`inline-flex rounded-full border border-border px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
                    user.status === "Active"
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground"
                  }`}
                >
                  {user.status}
                </span>
              </article>
            ))}

            {filteredUsers.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground transition-all duration-200">
                No users found for this segment.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}