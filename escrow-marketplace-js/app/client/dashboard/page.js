"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getCurrentUser, getJobs, setJobs } from "@/utils/storage";

export default function ClientDashboardPage() {
  useProtectedRoute("client");
  const user = getCurrentUser();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: 0,
  });

  const jobs = getJobs().filter((j) => j.clientEmail === user?.email);

  const handleCreateJob = (e) => {
    e.preventDefault();
    const newJob = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      clientEmail: user.email,
      budget: form.budget,
      status: "pending",
      paid: false,
      released: false,
    };
    setJobs([...getJobs(), newJob]);
    setForm({ title: "", description: "", budget: 0 });
    alert("Job created (stored in localStorage).");
  };

  const markCompleted = (id) => {
    const updated = getJobs().map((j) =>
      j.id === id ? { ...j, status: "completed" } : j
    );
    setJobs(updated);
    alert("Job marked as completed (client-confirmed).");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Sidebar role="client" />
      <div className="flex-1 space-y-4">
        <h1 className="text-xl font-semibold">Client Dashboard</h1>

        <Card title="Create Job Request">
          <form onSubmit={handleCreateJob} className="space-y-3 text-sm">
            <div className="flex flex-col gap-1">
              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label>Budget (₹)</label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) =>
                  setForm({ ...form, budget: Number(e.target.value) })
                }
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg"
            >
              Create Job
            </button>
          </form>
        </Card>

        <Card title="Your Jobs & Worker Progress">
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-500">
              No jobs yet. Create one using the form above.
            </p>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-3 text-sm space-y-1"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{job.title}</span>
                    <span className="text-xs text-gray-500">
                      Status: {job.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700">{job.description}</p>
                  {job.progressPercent != null && (
                    <p className="text-xs text-gray-600">
                      Worker progress: {job.progressPercent}% -{" "}
                      {job.progressDescription || "No description"}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => markCompleted(job.id)}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg disabled:opacity-60"
                    >
                      Confirm Completion
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
