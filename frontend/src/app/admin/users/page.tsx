"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminTopbar from "../../components/AdminTopbar";
import { useAdmin } from "../AdminContext";
import { getInitials } from "../../lib/currentUser";
import "./admin-users.css";

type Role = "student" | "teacher" | "admin";
type Status = "active" | "suspended";

interface UserRow {
  id: string;
  userId: number;
  avatarBg: string;
  initials: string;
  name: string;
  email: string;
  role: Role;
  targetBand: string;
  currentBand: string;
  testsTaken: string;
  daysActive: string;
  status: Status;
  createdAt: string;
}

// Shape returned by GET/PUT /api/admin/users (AdminUserDto on the backend).
interface ApiAdminUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "Student" | "Teacher" | "Admin";
  status: "Active" | "Suspended";
  createdAt: string;
  targetBand: number | null;
  currentBand: number | null;
  daysActive: number | null;
}

const ADMIN_USERS_URL = "http://localhost:8080/api/admin/users";

// Rotates through the same palette the original static mockup used, so
// avatars keep the same colorful look with real data.
const AVATAR_PALETTE = [
  "#3372C4",
  "var(--purple)",
  "var(--forest-700)",
  "var(--teal-500)",
  "var(--blue)",
  "var(--amber)",
  "var(--gray-400)",
  "var(--forest-800)",
];

function toUserRow(u: ApiAdminUser, index: number): UserRow {
  const role = u.role.toLowerCase() as Role;
  const status = u.status.toLowerCase() as Status;
  const name = `${u.firstName} ${u.lastName}`.trim();

  return {
    id: String(u.userId),
    userId: u.userId,
    avatarBg: AVATAR_PALETTE[index % AVATAR_PALETTE.length],
    initials: getInitials(u.firstName, u.lastName),
    name,
    email: u.email,
    role,
    targetBand: u.targetBand != null ? String(u.targetBand) : "—",
    currentBand: u.currentBand != null ? String(u.currentBand) : "—",
    // Not provided by the backend (no test-attempt aggregation exists yet).
    testsTaken: "—",
    daysActive: u.daysActive != null ? String(u.daysActive) : "—",
    status,
    createdAt: u.createdAt,
  };
}

const roleLabel: Record<Role, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
};

const statusLabel: Record<Status, string> = {
  active: "Active",
  suspended: "Suspended",
};

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    if (body?.message) return body.message as string;
  } catch {
    // response wasn't JSON — fall back to the generic message
  }
  return fallback;
}

const ROLE_FILTER_OPTIONS = ["All", "Student", "Teacher", "Admin"] as const;
type RoleFilterOption = (typeof ROLE_FILTER_OPTIONS)[number];

const STATUS_FILTER_OPTIONS = ["All", "Active", "Suspended"] as const;
type StatusFilterOption = (typeof STATUS_FILTER_OPTIONS)[number];

const REGISTERED_FILTER_OPTIONS = ["Any time", "Today", "This Week", "This Month"] as const;
type RegisteredFilterOption = (typeof REGISTERED_FILTER_OPTIONS)[number];

type OpenFilter = "role" | "status" | "registered" | null;

// Uses the browser's local timezone (via the Date object's local getters)
// consistently for "Today"/"This Week"/"This Month", matching how an admin
// reading the page would think about those ranges.
function matchesRegisteredFilter(createdAt: string, filter: RegisteredFilterOption): boolean {
  if (filter === "Any time") return true;

  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return false;

  const now = new Date();

  if (filter === "Today") {
    return created.toDateString() === now.toDateString();
  }

  if (filter === "This Week") {
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    return created >= startOfWeek;
  }

  // "This Month"
  return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
}

// Small shared dropdown used for the Role/Status/Registered filter
// controls. Keeps the exact existing "filter-select" box + chevron look —
// it only adds a click-to-open options panel beneath it.
function FilterDropdown<T extends string>({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string;
  value: T;
  options: readonly T[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (option: T) => void;
}) {
  return (
    <div className="filter-select-wrap">
      <div className="filter-select" onClick={onToggle}>
        {label}: {value}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
      </div>
      {isOpen && (
        <div className="filter-dropdown">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={option === value ? "active" : ""}
              onClick={() => onSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserManagementPage() {
  const admin = useAdmin();
  const router = useRouter();

  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilterOption>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>("All");
  const [registeredFilter, setRegisteredFilter] = useState<RegisteredFilterOption>("Any time");
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) {
        setOpenFilter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoadError("");
      try {
        const res = await fetch(ADMIN_USERS_URL, {
          method: "GET",
          credentials: "include",
        });

        if (cancelled) return;

        if (res.status === 401 || res.status === 403) {
          router.replace("/login");
          return;
        }

        if (!res.ok) {
          setLoadError(await readErrorMessage(res, "Could not load users. Please try again."));
          return;
        }

        const data = (await res.json()) as ApiAdminUser[];
        setUsers(data.map(toUserRow));
      } catch {
        if (!cancelled) {
          setLoadError("Could not reach the server. Please check your connection and try again.");
        }
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    const source = users ?? [];

    return source.filter((u) => {
      const matchesSearch =
        term === "" ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);

      const matchesRole = roleFilter === "All" || u.role === roleFilter.toLowerCase();
      const matchesStatus = statusFilter === "All" || u.status === statusFilter.toLowerCase();
      const matchesRegistered = matchesRegisteredFilter(u.createdAt, registeredFilter);

      return matchesSearch && matchesRole && matchesStatus && matchesRegistered;
    });
  }, [users, search, roleFilter, statusFilter, registeredFilter]);

  const selectableRows = filteredUsers.filter((u) => u.userId !== admin.userId);
  const allChecked = selected.size > 0 && selected.size === selectableRows.length;

  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(selectableRows.map((u) => u.id)));
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  function setRowBusy(id: string, busy: boolean) {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }

  async function suspendOne(id: string): Promise<boolean> {
    setRowBusy(id, true);
    try {
      const res = await fetch(`${ADMIN_USERS_URL}/${id}/suspend`, {
        method: "PUT",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        router.replace("/login");
        return false;
      }

      if (!res.ok) {
        setActionError(await readErrorMessage(res, "Could not suspend this user."));
        return false;
      }

      const updated = (await res.json()) as ApiAdminUser;
      setUsers((prev) =>
        prev
          ? prev.map((u) =>
              u.id === id ? { ...u, status: updated.status.toLowerCase() as Status } : u
            )
          : prev
      );
      return true;
    } catch {
      setActionError("Could not reach the server. Please try again.");
      return false;
    } finally {
      setRowBusy(id, false);
    }
  }

  async function deleteOne(id: string): Promise<boolean> {
    setRowBusy(id, true);
    try {
      const res = await fetch(`${ADMIN_USERS_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        router.replace("/login");
        return false;
      }

      if (!res.ok) {
        setActionError(await readErrorMessage(res, "Could not delete this user."));
        return false;
      }

      setUsers((prev) => (prev ? prev.filter((u) => u.id !== id) : prev));
      return true;
    } catch {
      setActionError("Could not reach the server. Please try again.");
      return false;
    } finally {
      setRowBusy(id, false);
    }
  }

  async function handleBulkSuspend() {
    setActionError("");
    const ids = [...selected];
    if (ids.length === 0) return;

    const results = await Promise.all(ids.map((id) => suspendOne(id)));
    const succeeded = ids.filter((_, i) => results[i]);
    setSelected((prev) => {
      const next = new Set(prev);
      succeeded.forEach((id) => next.delete(id));
      return next;
    });
  }

  async function handleBulkDelete() {
    setActionError("");
    const ids = [...selected];
    if (ids.length === 0) return;

    const confirmed = window.confirm(
      ids.length === 1
        ? "Delete this user? This action is permanent and cannot be undone."
        : `Delete ${ids.length} selected users? This action is permanent and cannot be undone.`
    );
    if (!confirmed) return;

    const results = await Promise.all(ids.map((id) => deleteOne(id)));
    const succeeded = ids.filter((_, i) => results[i]);
    setSelected((prev) => {
      const next = new Set(prev);
      succeeded.forEach((id) => next.delete(id));
      return next;
    });
  }

  async function handleRowDelete(u: UserRow) {
    setActionError("");
    const confirmed = window.confirm(
      `Delete ${u.name}? This action is permanent and cannot be undone.`
    );
    if (!confirmed) return;

    const ok = await deleteOne(u.id);
    if (ok) {
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(u.id);
        return next;
      });
    }
  }

  const studentCount = users?.filter((u) => u.role === "student").length ?? null;
  const teacherCount = users?.filter((u) => u.role === "teacher").length ?? null;
  const suspendedCount = users?.filter((u) => u.status === "suspended").length ?? null;

  return (
    <>
      <AdminTopbar
        breadcrumb="Admin / Users"
        title="User Management"
        firstName={admin.firstName}
        lastName={admin.lastName}
      />

    <div className="content">

      <div className="page-head">
        <div className="page-head-left">
          <h2>All Users</h2>
          <p>Manage students, teachers, and admin accounts across the platform.</p>
        </div>
        <button className="btn-add-user">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
          Add User
        </button>
      </div>

      {/* SUMMARY STRIP */}
      <div className="summary-strip">
        <div className="sum-card">
          <div><div className="val">{studentCount ?? "—"}</div><div className="lbl">Students</div></div>
          <div className="sum-icon s1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
        </div>
        <div className="sum-card">
          <div><div className="val">{teacherCount ?? "—"}</div><div className="lbl">Teachers</div></div>
          <div className="sum-icon s2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg></div>
        </div>
        <div className="sum-card">
          <div><div className="val">0</div><div className="lbl">Pending Approval</div></div>
          <div className="sum-icon s3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
        </div>
        <div className="sum-card">
          <div><div className="val">{suspendedCount ?? "—"}</div><div className="lbl">Suspended</div></div>
          <div className="sum-icon s4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.9 4.9l14.2 14.2"/></svg></div>
        </div>
      </div>

      {/* FILTER + TABLE PANEL */}
      <div className="filter-panel">
        <div className="filter-bar" ref={filterBarRef}>
          <div className="search-field">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FilterDropdown
            label="Role"
            value={roleFilter}
            options={ROLE_FILTER_OPTIONS}
            isOpen={openFilter === "role"}
            onToggle={() => setOpenFilter((prev) => (prev === "role" ? null : "role"))}
            onSelect={(option) => {
              setRoleFilter(option);
              setOpenFilter(null);
            }}
          />
          <FilterDropdown
            label="Status"
            value={statusFilter}
            options={STATUS_FILTER_OPTIONS}
            isOpen={openFilter === "status"}
            onToggle={() => setOpenFilter((prev) => (prev === "status" ? null : "status"))}
            onSelect={(option) => {
              setStatusFilter(option);
              setOpenFilter(null);
            }}
          />
          <FilterDropdown
            label="Registered"
            value={registeredFilter}
            options={REGISTERED_FILTER_OPTIONS}
            isOpen={openFilter === "registered"}
            onToggle={() => setOpenFilter((prev) => (prev === "registered" ? null : "registered"))}
            onSelect={(option) => {
              setRegisteredFilter(option);
              setOpenFilter(null);
            }}
          />
        </div>

        {actionError && (
          <div style={{
            margin: "0 24px 16px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "#FDECEA",
            color: "#C4453A",
            fontSize: "13.5px",
            fontWeight: 600,
          }}>
            {actionError}
          </div>
        )}

        <div className={`bulk-bar ${selected.size > 0 ? "show" : ""}`}>
          <span>{selected.size} {selected.size === 1 ? "user selected" : "users selected"}</span>
          <div className="bulk-actions">
            <button onClick={handleBulkSuspend} disabled={selected.size === 0}>Suspend</button>
            <button className="danger" onClick={handleBulkDelete} disabled={selected.size === 0}>Delete</button>
          </div>
        </div>

        {loadError && (
          <div style={{ padding: "40px 24px", textAlign: "center", color: "#C4453A", fontWeight: 600 }}>
            {loadError}
          </div>
        )}

        {!loadError && users === null && (
          <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--gray-400)" }}>
            Loading users…
          </div>
        )}

        {!loadError && users !== null && filteredUsers.length === 0 && (
          <div style={{ padding: "40px 24px", textAlign: "center", color: "var(--gray-400)" }}>
            No users found.
          </div>
        )}

        {!loadError && users !== null && filteredUsers.length > 0 && (
        <table>
          <thead>
            <tr>
              <th className="chk"><input type="checkbox" checked={allChecked} onChange={toggleAll} /></th>
              <th>User</th>
              <th>Role</th>
              <th>Target Band</th>
              <th>Current Band</th>
              <th>Tests Taken</th>
              <th>Days Active</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => {
              const isSelf = u.userId === admin.userId;
              const isBusy = busyIds.has(u.id);
              return (
                <tr key={u.id} style={isBusy ? { opacity: 0.6 } : undefined}>
                  <td>
                    <input
                      type="checkbox"
                      className="row-chk"
                      checked={selected.has(u.id)}
                      onChange={() => toggleRow(u.id)}
                      disabled={isSelf || isBusy}
                    />
                  </td>
                  <td><div className="user-cell"><div className="user-av" style={{background: u.avatarBg}}>{u.initials}</div><div><div className="user-name">{u.name}</div><div className="user-email">{u.email}</div></div></div></td>
                  <td><span className={`role-pill ${u.role}`}>{roleLabel[u.role]}</span></td>
                  <td className="band-txt">{u.targetBand}</td>
                  <td className="band-txt">{u.currentBand}</td>
                  <td>{u.testsTaken}</td>
                  <td>{u.daysActive}</td>
                  <td><span className={`status-pill ${u.status}`}>{statusLabel[u.status]}</span></td>
                  <td>
                    <div className="action-btns">
                      <div className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg></div>
                      <div className="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></div>
                      <div
                        className="icon-btn danger"
                        onClick={isSelf || isBusy ? undefined : () => handleRowDelete(u)}
                        style={isSelf ? { opacity: 0.4, cursor: "not-allowed" } : { cursor: isBusy ? "default" : "pointer" }}
                        title={isSelf ? "You cannot delete your own account" : "Delete user"}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}

        {!loadError && users !== null && filteredUsers.length > 0 && (
        <div className="pagination">
          <div className="page-info">Showing <b>{filteredUsers.length === 0 ? 0 : 1}–{filteredUsers.length}</b> of <b>{filteredUsers.length}</b> users</div>
          <div className="page-controls">
            <div className="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></div>
            <div className="page-btn active">1</div>
            <div className="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></div>
          </div>
        </div>
        )}
      </div>

    </div>
    </>
  );
}