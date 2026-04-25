"use client";

import { useMemo, useState } from "react";

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

const initialUsers: User[] = [
  { name: "Ayesha Khan", email: "ayesha.khan@example.com", status: "Active" },
  { name: "Bilal Ahmed", email: "bilal.ahmed@example.com", status: "Inactive" },
  { name: "Hina Ali", email: "hina.ali@example.com", status: "Active" },
  { name: "Usman Tariq", email: "usman.tariq@example.com", status: "Active" },
  { name: "Sara Noor", email: "sara.noor@example.com", status: "Inactive" },
  { name: "Zain Iqbal", email: "zain.iqbal@example.com", status: "Active" },
];

export default function UsersPage() {
  // Working table data state (includes newly added users).
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    status: "Active",
  });

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => user.name.toLowerCase().includes(query));
  }, [searchTerm, users]);

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const errors: FormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Working validation: required fields + email format check.
    if (!name) {
      errors.name = "Name is required.";
    }

    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setUsers((prevUsers) => [
      ...prevUsers,
      { name, email, status: formData.status },
    ]);
    setFormData({ name: "", email: "", status: "Active" });
    setFormErrors({});
    setShowAddForm(false);
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Users</h1>
          <button
            type="button"
            onClick={() => {
              setShowAddForm((prev) => !prev);
              setFormErrors({});
            }}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Add User
          </button>
        </div>

        {/* Working add-user form section */}
        {showAddForm ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Add New User</h2>
            <form onSubmit={handleAddUser} className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
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
                  className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 transition focus:ring-2 ${
                    formErrors.name
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-300 focus:border-slate-400 focus:ring-slate-200"
                  }`}
                />
                {formErrors.name ? (
                  <p className="mt-1 text-xs font-medium text-rose-600">{formErrors.name}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
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
                  className={`mt-2 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 transition focus:ring-2 ${
                    formErrors.email
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-300 focus:border-slate-400 focus:ring-slate-200"
                  }`}
                />
                {formErrors.email ? (
                  <p className="mt-1 text-xs font-medium text-rose-600">{formErrors.email}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium text-slate-700">
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
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Save User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormErrors({});
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {/* Working searchable users table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-4 sm:p-6">
            <label htmlFor="user-search" className="block text-sm font-medium text-slate-700">
              Search users
            </label>
            <input
              id="user-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name..."
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-6"
                  >
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user, index) => (
                  <tr key={`${user.email}-${index}`} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900 sm:px-6">
                      {user.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm sm:px-6">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
                      No users found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
