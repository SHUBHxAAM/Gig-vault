import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/escrow";
import { io } from "socket.io-client";

export default function ContractDetails() {
  const { id } = useParams(); // contract ID
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [note, setNote] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    // fetch contract details
    const fetchContract = async () => {
      try {
        const res = await axios.get(`/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setContract(res.data.escrow);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id, token]);

  useEffect(() => {
    // setup Socket.IO
    const s = io("http://localhost:5000"); // change if deployed
    setSocket(s);
    s.emit("joinRoom", id);

    s.on("receiveMessage", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => s.disconnect();
  }, [id]);

  const sendMessage = () => {
    if (!message) return;
    socket.emit("sendMessage", { roomId: id, senderId: contract.clientId._id, text: message });
    setMessage("");
  };

  const submitWork = async () => {
    try {
      const res = await axios.post(
        `/${id}/submit`,
        { deliverableUrl, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContract(res.data.escrow);
      alert("Work submitted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit work");
    }
  };

  const releaseEscrow = async () => {
    try {
      const res = await axios.post(
        `/${id}/release`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContract(res.data.escrow);
      alert("Escrow released!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to release escrow");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!contract) return <div className="p-8">Contract not found</div>;

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Contract Info */}
      <div className="border p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Contract Details</h2>
        <div>Contract ID: {contract.contractId}</div>
        <div>Status: <span className="capitalize">{contract.status}</span></div>
        <div>Amount: ₹{(contract.amount / 100).toFixed(2)}</div>
        <div>Worker: {contract.workerId.name}</div>
        <div>Client: {contract.clientId.name}</div>
        {contract.deliverableUrl && (
          <div className="mt-2">
            Deliverable: <a href={contract.deliverableUrl} target="_blank" rel="noreferrer" className="text-blue-500">View</a>
          </div>
        )}

        {/* Worker actions */}
        {contract.status === "locked" && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Submit Work</h3>
            <input
              type="text"
              placeholder="Deliverable URL"
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <textarea
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <button
              onClick={submitWork}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        )}

        {/* Client actions */}
        {contract.status === "submitted" && (
          <div className="mt-4">
            <button
              onClick={releaseEscrow}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Release Escrow
            </button>
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="border p-4 rounded shadow flex flex-col h-full">
        <h2 className="text-xl font-bold mb-2">Chat</h2>
        <div className="flex-1 overflow-y-auto mb-2 border p-2 rounded bg-gray-50">
          {chatMessages.map((m, i) => (
            <div key={i} className="mb-1">
              <span className="font-semibold">{m.sender}: </span>{m.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
