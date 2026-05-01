import { DollarSign, UserCheck, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Total Users", value: "1,200", icon: Users },
  { label: "Active Users", value: "860", icon: UserCheck },
  { label: "Revenue", value: "$12,400", icon: DollarSign },
];

export default function DashboardPage() {
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
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.label}
                className="border bg-card text-foreground shadow-sm transition-shadow hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-center justify-between gap-2 p-4 pb-2 md:p-6 md:pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.label}</CardTitle>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                </CardHeader>
                <CardContent className="p-4 pt-1 md:p-6 md:pt-1">
                  <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
