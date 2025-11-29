import { useEffect, useState } from "react";
import axios from "../api/escrow";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        // detect user role via backend 'me' or separate API
        const meRes = await axios.get("/me", {
          baseURL: "http://localhost:5000/api/auth",
          headers: { Authorization: `Bearer ${token}` }
        });

        const role = meRes.data.user.role;
        const url = role === "client" ? "/client" : "/worker";

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setContracts(res.data.escrows);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [token]);

  if (loading) return <div className="p-8">Loading contracts...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Your Contracts</h2>
      {contracts.length === 0 && <div>No contracts yet.</div>}
      <ul className="space-y-4">
        {contracts.map((c) => (
          <li key={c._id} className="border p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">Contract ID: {c.contractId}</div>
              <div>Status: <span className="capitalize">{c.status}</span></div>
              <div>Amount: ₹{(c.amount / 100).toFixed(2)}</div>
              <div>
                {c.workerId?.name && <span>Worker: {c.workerId.name}</span>}
                {c.clientId?.name && <span> | Client: {c.clientId.name}</span>}
              </div>
            </div>
            <Link
              to={`/contract/${c._id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Link
          to="/create-contract"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create New Contract
        </Link>
      </div>
    </div>
  );
}
