"use client";

import { useMemo, useState, useEffect } from "react";
import { AwardIcon, Delete, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Types
type UserStatus = "Active" | "Inactive";

// User type definition
type User = {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
};

// Form error type definition
type FormErrors = {
  name?: string;
  email?: string;
};

export default function UsersPage() {

  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    status: "Active",
  });

// Initial fetch of users on component mount
useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  // Memoized filtered users based on search term
  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return query 
      ? users.filter((user) => user.name.toLowerCase().includes(query)) 
      : users;
  }, [searchTerm, users]);

  // Validation Logic
  const validate = (name: string, email: string) => {
    const errors: FormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      errors.email = "Invalid email format.";
    }
    return errors;
  };

  // Add User
  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validate(formData.name, formData.email);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsUpdating(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("User added successfully!",{
          description: `${formData.name} has been added to the user list.`,
        });
        fetchUsers();
        setFormData({ id: 0, name: "", email: "", status: "Active" });
        setShowAddForm(false);
      } else {
        toast.error("Failed to add user.", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        description: "Please try again later.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        toast.success("User deleted", {
          description: "The user record has been permanently removed.",
        });
        fetchUsers();
      } else {
        toast.error("Could not delete user");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    }
  };

  // Edit User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const errors = validate(editingUser.name, editingUser.email);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });

      if (res.ok) {
        toast.success("User updated");
        await fetchUsers();
        setEditingUser(null);
        setFormErrors({});
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      toast.error("An error occurred while updating");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-base font-semibold tracking-tight text-foreground md:text-lg lg:text-xl">
            Users
          </h1>
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

        {/* Add user model */}
        <Dialog
          open={!!showAddForm}
          onOpenChange={(open) => !open && setShowAddForm(false)}
        >
          <DialogContent className="max-w-md border-border bg-card text-card-foreground shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Add User</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter details to create a new user.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleAddUser}
              className="mt-4 grid gap-4 md:mt-5 md:gap-5 sm:grid-cols-2"
            >
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => {
                    setFormData((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }));
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
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {formErrors.name}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => {
                    setFormData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }));
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
                  <p className="mt-1 text-xs font-medium text-destructive">
                    {formErrors.email}
                  </p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-foreground"
                >
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
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <DialogFooter className="pt-4 flex gap-2 sm:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormErrors({});
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating} className="flex-1">
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Working searchable users table */}
        <section className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm">
          <div className="border-b p-4 md:p-6">
            <label
              htmlFor="user-search"
              className="block text-sm font-semibold text-foreground"
            >
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
            <Table className="min-w-160 text-sm">
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
                          onClick={() => setEditingUser(user)}
                          className="h-10 w-10 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={`Edit ${user.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeleteUser(user.id)}
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
                    <TableCell
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-muted-foreground sm:px-6"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>

      {/* --- EDIT USER MODAL --- */}
      <Dialog
        open={!!editingUser}
        onOpenChange={(open) => !open && setEditingUser(null)}
      >
        <DialogContent className="max-w-md border-border bg-card text-card-foreground shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit User</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update user details and status. Click save to apply changes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateUser} className="space-y-4 py-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                value={editingUser?.name || ""}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, name: e.target.value } : null,
                  )
                }
                className={`h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:ring-2 ${
                  formErrors.name
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:ring-primary/20"
                }`}
              />
              {formErrors.name && (
                <p className="text-xs text-destructive">{formErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={editingUser?.email || ""}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev ? { ...prev, email: e.target.value } : null,
                  )
                }
                className={`h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:ring-2 ${
                  formErrors.email
                    ? "border-destructive focus:ring-destructive/20"
                    : "border-border focus:ring-primary/20"
                }`}
              />
              {formErrors.email && (
                <p className="text-xs text-destructive">{formErrors.email}</p>
              )}
            </div>

            {/* Status Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Status</label>
              <select
                value={editingUser?.status || "Active"}
                onChange={(e) =>
                  setEditingUser((prev) =>
                    prev
                      ? { ...prev, status: e.target.value as UserStatus }
                      : null,
                  )
                }
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingUser(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating} className="flex-1">
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
