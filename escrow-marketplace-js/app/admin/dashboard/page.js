"use client";

import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import {
  getPendingUsers,
  approveUser,
  getJobs,
  setJobs,
} from "@/utils/storage";

export default function AdminDashboardPage() {
  useProtectedRoute("admin");
  const pendingUsers = getPendingUsers();
  const jobs = getJobs();

  const handleApprove = (email) => {
    approveUser(email);
    alert("User approved.");
  };

  const handleReleasePayment = (jobId) => {
    const updated = getJobs().map((j) =>
      j.id === jobId ? { ...j, released: true } : j
    );
    setJobs(updated);
    alert("Payment released (demo).");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Sidebar role="admin" />
      <div className="flex-1 space-y-4">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>

        <Card title="Pending Worker & Client Approvals">
          {pendingUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No pending approvals.</p>
          ) : (
            <div className="space-y-2 text-sm">
              {pendingUsers.map((u) => (
                <div
                  key={u.email}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {u.name} ({u.role})
                    </p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                    {u.experience && (
                      <p className="text-xs text-gray-600">
                        Exp: {u.experience}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleApprove(u.email)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="All Jobs & Payment Control">
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-500">No jobs created yet.</p>
          ) : (
            <div className="space-y-2 text-sm">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-3 space-y-1 text-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{job.title}</span>
                    <span className="text-xs text-gray-500">
                      Status: {job.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Client: {job.clientEmail} · Worker:{" "}
                    {job.workerEmail || "Not assigned"} · Budget: ₹
                    {job.budget}
                  </p>
                  <p className="text-xs text-gray-600">
                    Paid: {job.paid ? "Yes" : "No"} · Released:{" "}
                    {job.released ? "Yes" : "No"}
                  </p>
                  {job.paid && !job.released && (
                    <button
                      onClick={() => handleReleasePayment(job.id)}
                      className="px-3 py-1 bg-primary-600 text-white rounded-lg text-xs"
                    >
                      Release Payment
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
