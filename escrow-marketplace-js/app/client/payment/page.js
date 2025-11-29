"use client";

import Sidebar from "@/components/Sidebar";
import Card from "@/components/Card";
import RazorpayButton from "@/components/RazorpayButton";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { getCurrentUser, getJobs, setJobs } from "@/utils/storage";

export default function ClientPaymentPage() {
  useProtectedRoute("client");
  const user = getCurrentUser();
  const jobs = getJobs().filter((j) => j.clientEmail === user?.email);

  const handleMockPayment = (jobId) => {
    const updated = getJobs().map((j) =>
      j.id === jobId ? { ...j, paid: true } : j
    );
    setJobs(updated);
    alert("Payment simulated. Funds are now in escrow.");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Sidebar role="client" />
      <div className="flex-1 space-y-4">
        <h1 className="text-xl font-semibold">Payments (Razorpay UI)</h1>
        <Card>
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-500">No jobs to pay for yet.</p>
          ) : (
            <div className="space-y-3 text-sm">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-3 flex flex-col gap-1"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{job.title}</span>
                    <span className="text-xs text-gray-500">
                      Paid: {job.paid ? "Yes" : "No"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Budget: ₹{job.budget} · Status:{" "}
                    {job.status.toUpperCase()}
                  </p>
                  {!job.paid && (
                    <RazorpayButton
                      amount={job.budget}
                      onMockPayment={() => handleMockPayment(job.id)}
                    />
                  )}
                  {job.paid && (
                    <p className="text-xs text-green-600">
                      Payment done (demo). Awaiting admin release.
                    </p>
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
