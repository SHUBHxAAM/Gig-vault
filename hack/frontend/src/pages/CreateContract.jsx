import { useState } from "react";
import axios from "../api/escrow";
import { useNavigate } from "react-router-dom";

export default function CreateContract() {
  const [contractId, setContractId] = useState("");
  const [workerEmail, setWorkerEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/create",
        { contractId, workerEmail, amount, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Contract created successfully! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create contract");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Contract</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-500 mb-2">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Contract ID (unique)"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Worker Email"
            value={workerEmail}
            onChange={(e) => setWorkerEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Amount in INR"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            placeholder="Description / Note (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Create Contract
          </button>
        </form>
      </div>
    </div>
  );
}
