"use client";

import { useState } from "react";
import AdminTopbar from "../../components/AdminTopbar";
import { useAdmin } from "../AdminContext";
import "./admin-users.css";

type Role = "student" | "teacher" | "admin";
type Status = "active" | "pending" | "suspended";

interface UserRow {
  id: string;
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
}

const roleLabel: Record<Role, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
};

const statusLabel: Record<Status, string> = {
  active: "Active",
  pending: "Pending",
  suspended: "Suspended",
};

const users: UserRow[] = [
  { id: "1", avatarBg: "#3372C4", initials: "SA", name: "Sarah Ahmed", email: "sarah.ahmed@example.com", role: "student", targetBand: "7.5", currentBand: "6.5", testsTaken: "18", daysActive: "54", status: "active" },
  { id: "2", avatarBg: "var(--purple)", initials: "AR", name: "Arafat Rahman", email: "arafat.r@example.com", role: "student", targetBand: "7.0", currentBand: "6.0", testsTaken: "9", daysActive: "22", status: "active" },
  { id: "3", avatarBg: "var(--forest-700)", initials: "NJ", name: "Nusrat Jahan", email: "nusrat.jahan@example.com", role: "student", targetBand: "7.5", currentBand: "7.5", testsTaken: "26", daysActive: "81", status: "active" },
  { id: "4", avatarBg: "var(--teal-500)", initials: "DR", name: "Dr. Sarah Rahman", email: "s.rahman@ieltsbeta.com", role: "teacher", targetBand: "—", currentBand: "—", testsTaken: "—", daysActive: "312", status: "active" },
  { id: "5", avatarBg: "var(--blue)", initials: "MA", name: "Michael Anderson", email: "m.anderson@ieltsbeta.com", role: "teacher", targetBand: "—", currentBand: "—", testsTaken: "—", daysActive: "198", status: "active" },
  { id: "6", avatarBg: "var(--amber)", initials: "TH", name: "Tanvir Hasan", email: "tanvir.hasan@example.com", role: "student", targetBand: "7.0", currentBand: "7.0", testsTaken: "15", daysActive: "40", status: "pending" },
  { id: "7", avatarBg: "var(--gray-400)", initials: "MI", name: "Mahin Islam", email: "mahin.islam@example.com", role: "student", targetBand: "6.5", currentBand: "5.5", testsTaken: "7", daysActive: "15", status: "suspended" },
  { id: "8", avatarBg: "var(--forest-800)", initials: "NK", name: "Nadia Karim", email: "n.karim@ieltsbeta.com", role: "admin", targetBand: "—", currentBand: "—", testsTaken: "—", daysActive: "410", status: "active" },
];

export default function UserManagementPage() {
  const admin = useAdmin();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allChecked = selected.size > 0 && selected.size === users.length;

  const toggleAll = () => {
    setSelected(allChecked ? new Set() : new Set(users.map((u) => u.id)));
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
          <div><div className="val">4,812</div><div className="lbl">Students</div></div>
          <div className="sum-icon s1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
        </div>
        <div className="sum-card">
          <div><div className="val">86</div><div className="lbl">Teachers</div></div>
          <div className="sum-icon s2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg></div>
        </div>
        <div className="sum-card">
          <div><div className="val">126</div><div className="lbl">Pending Approval</div></div>
          <div className="sum-icon s3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
        </div>
        <div className="sum-card">
          <div><div className="val">37</div><div className="lbl">Suspended</div></div>
          <div className="sum-icon s4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M4.9 4.9l14.2 14.2"/></svg></div>
        </div>
      </div>

      {/* FILTER + TABLE PANEL */}
      <div className="filter-panel">
        <div className="filter-bar">
          <div className="search-field">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
            <input type="text" placeholder="Search by name or email…" />
          </div>
          <div className="filter-select">Role: All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
          <div className="filter-select">Status: All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
          <div className="filter-select">Registered: Any time <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg></div>
        </div>

        <div className={`bulk-bar ${selected.size > 0 ? "show" : ""}`}>
          <span>{selected.size} {selected.size === 1 ? "user selected" : "users selected"}</span>
          <div className="bulk-actions">
            <button>Suspend</button>
            <button className="danger">Delete</button>
          </div>
        </div>

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
            {users.map((u) => (
              <tr key={u.id}>
                <td><input type="checkbox" className="row-chk" checked={selected.has(u.id)} onChange={() => toggleRow(u.id)} /></td>
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
                    <div className="icon-btn danger"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <div className="page-info">Showing <b>1–8</b> of <b>4,998</b> users</div>
          <div className="page-controls">
            <div className="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></div>
            <div className="page-btn active">1</div>
            <div className="page-btn">2</div>
            <div className="page-btn">3</div>
            <div className="page-btn">…</div>
            <div className="page-btn">625</div>
            <div className="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></div>
          </div>
        </div>
      </div>

    </div>
    </>
  );
}