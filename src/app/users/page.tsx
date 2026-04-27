"use client";

import { useMemo, useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UserStatus = "Active" | "Inactive";

type User = {
  name: string;
  email: string;
  status: UserStatus;
};

type FormErrors = {
  name?: string;
  email?: string;
};


export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    status: "Active",
  });

  useEffect(() => {
    fetch("/api/users")
    .then(res => res.json())
    .then(data => setUsers(data));
  },[]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => user.name.toLowerCase().includes(query));
  }, [searchTerm, users]);

  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const name = formData.name.trim();
    const email = formData.email.trim();
    const errors: FormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!name) errors.name = "Name is required.";
    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
  
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
  
    // CALL API
    await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        status: formData.status,
      }),
    });
  
    // REFETCH USERS
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  
    setFormData({ name: "", email: "", status: "Active" });
    setFormErrors({});
    setShowAddForm(false);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-base font-semibold tracking-tight text-foreground md:text-lg lg:text-xl">Users</h1>
          <Button
            type="button"
            onClick={() => {
              setShowAddForm((prev) => !prev);
              setFormErrors({});
            }}
            className="h-11 px-4"
          >
            Add User
          </Button>
        </div>

        {/* Working add-user form section */}
        {showAddForm ? (
          <section className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm md:p-6">
            <h2 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
              Add New User
            </h2>
            <form onSubmit={handleAddUser} className="mt-4 grid gap-4 md:mt-5 md:gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => {
                    setFormData((prev) => ({ ...prev, name: event.target.value }));
                    setFormErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  required
                  aria-invalid={Boolean(formErrors.name)}
                  className={`mt-2 h-11 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-2 transition focus:ring-2 ${
                    formErrors.name
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                      : "border-border focus:border-ring focus:ring-ring/20"
                  }`}
                />
                {formErrors.name ? (
                  <p className="mt-1 text-xs font-medium text-destructive">{formErrors.name}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => {
                    setFormData((prev) => ({ ...prev, email: event.target.value }));
                    setFormErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  required
                  aria-invalid={Boolean(formErrors.email)}
                  className={`mt-2 h-11 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-2 transition focus:ring-2 ${
                    formErrors.email
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                      : "border-border focus:border-ring focus:ring-ring/20"
                  }`}
                />
                {formErrors.email ? (
                  <p className="mt-1 text-xs font-medium text-destructive">{formErrors.email}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium text-foreground">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: event.target.value as UserStatus,
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-2 transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="h-11 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Save User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormErrors({});
                  }}
                  className="h-11 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {/* Working searchable users table */}
        <section className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm">
          <div className="border-b p-4 md:p-6">
            <label htmlFor="user-search" className="block text-sm font-semibold text-foreground">
              Search users
            </label>
            <input
              id="user-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name..."
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-2 transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[640px] text-sm">
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-muted/50">
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:px-6">
                  Name
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:px-6">
                  Email
                </TableHead>
                <TableHead className="px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:px-6">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:px-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={`${user.email}-${index}`}
                  className="transition-colors hover:bg-muted/40"
                >
                  <TableCell className="px-4 py-4 text-sm font-medium text-foreground sm:px-6">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm text-muted-foreground sm:px-6">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-sm sm:px-6">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        user.status === "Active"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-right sm:px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="h-10 w-10 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label={`Edit ${user.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="h-10 w-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Delete ${user.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}
