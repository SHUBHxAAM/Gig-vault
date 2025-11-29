"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getCurrentUser, getJobs, setJobs } from "@/utils/storage";

export default function WorkerProgressPage() {
  useProtectedRoute("worker");
  const user = getCurrentUser();
  const jobs = getJobs().filter((j) => j.workerEmail === user?.email);
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || "");
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressDescription, setProgressDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = getJobs().map((j) =>
      j.id === selectedJobId
        ? { ...j, progressPercent, progressDescription, status: "in_progress" }
        : j
    );
    setJobs(updated);
    alert("Progress updated (stored in localStorage).");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Sidebar role="worker" />
      <div className="flex-1 space-y-4">
        <h1 className="text-xl font-semibold">Submit Work Progress</h1>
        <Card>
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-500">
              No jobs assigned, nothing to update yet.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              <div className="flex flex-col gap-1">
                <label>Job</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label>Progress (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={progressPercent}
                  onChange={(e) =>
                    setProgressPercent(
                      Math.min(100, Math.max(0, Number(e.target.value)))
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label>Progress Description</label>
                <textarea
                  rows={3}
                  value={progressDescription}
                  onChange={(e) => setProgressDescription(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                Update Progress
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
