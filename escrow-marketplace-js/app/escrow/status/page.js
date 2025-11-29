"use client";

import Card from "@/components/Card";
import { getJobs } from "@/utils/storage";

export default function EscrowStatusPage() {
  const jobs = getJobs();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Escrow Status</h1>
      <Card>
        {jobs.length === 0 ? (
          <p className="text-sm text-gray-500">
            No jobs yet. Create jobs from the client dashboard.
          </p>
        ) : (
          <div className="space-y-2 text-sm">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border rounded-lg p-3 flex flex-col gap-1"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{job.title}</span>
                  <span className="text-xs text-gray-500">
                    {job.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Client: {job.clientEmail} · Worker:{" "}
                  {job.workerEmail || "Not assigned"}
                </p>
                <p className="text-xs text-gray-600">
                  Budget: ₹{job.budget} · Paid: {job.paid ? "Yes" : "No"} ·
                  Released: {job.released ? "Yes" : "No"}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
