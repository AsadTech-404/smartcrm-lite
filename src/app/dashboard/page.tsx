"use client";

import { useEffect, useState } from "react";
import { UserCheck, Users, UserX } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Stats = {
  total: number;
  active: number;
  inactive: number;
};

function StatCardSkeleton() {
  return (
    <Card className="border bg-card text-foreground shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2 p-4 pb-2 md:p-6 md:pb-2">
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="h-10 w-10 rounded-md" />
      </CardHeader>
      <CardContent className="p-4 pt-1 md:p-6 md:pt-1">
        <Skeleton className="h-9 w-20 rounded" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");

        const users: { status: string }[] = await res.json();

        const total = users.length;
        const active = users.filter((u) => u.status === "Active").length;
        const inactive = users.filter((u) => u.status === "Inactive").length;

        setStats({ total, active, inactive });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.total, icon: Users },
        { label: "Active Users", value: stats.active, icon: UserCheck },
        { label: "Inactive Users", value: stats.inactive, icon: UserX },
      ]
    : [];

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <header className="space-y-2">
          <h1 className="text-base font-semibold tracking-tight text-foreground md:text-lg lg:text-xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground md:text-base lg:text-lg">
            Track your key metrics and team performance in one place.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : error ? (
            <p className="col-span-full rounded-xl border border-dashed border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
              {error}
            </p>
          ) : (
            statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <Card
                  key={stat.label}
                  className="border bg-card text-foreground shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardHeader className="flex flex-row items-center justify-between gap-2 p-4 pb-2 md:p-6 md:pb-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 md:p-6 md:pt-1">
                    <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                      {stat.value.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
