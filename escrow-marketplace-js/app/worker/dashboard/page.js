"use client";

import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getCurrentUser, getJobs } from "@/utils/storage";

export default function WorkerDashboardPage() {
  useProtectedRoute("worker");
  const user = getCurrentUser();
  const jobs = getJobs().filter((j) => j.workerEmail === user?.email);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Sidebar role="worker" />
      <div className="flex-1 space-y-4">
        <h1 className="text-xl font-semibold">Worker Dashboard</h1>
        {jobs.length === 0 && (
          <p className="text-sm text-gray-500">
            No jobs assigned yet. Contact your client.
          </p>
        )}
        <div className="grid gap-3">
          {jobs.map((job) => (
            <Card
              key={job.id}
              title={`${job.title} (₹${job.budget})`}
              footer={
                <span className="text-xs text-gray-500">
                  Status: {job.status.toUpperCase()} · Paid:{" "}
                  {job.paid ? "Yes" : "No"} · Released:{" "}
                  {job.released ? "Yes" : "No"}
                </span>
              }
            >
              <p className="text-sm">{job.description}</p>
              {job.progressPercent != null && (
                <p className="text-xs text-gray-600 mt-1">
                  Progress: {job.progressPercent}% -{" "}
                  {job.progressDescription || "No description"}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
