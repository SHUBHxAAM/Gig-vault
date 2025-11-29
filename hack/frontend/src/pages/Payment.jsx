import { useEffect, useState } from "react";
import axios from "../api/payment";

export default function Payment({ contractId, amount }) {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create order on backend
      const res = await axios.post(
        "/create-order",
        { amount: amount * 100, contractId }, // backend expects paisa
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { id: order_id, amount: order_amount, currency } = res.data.order;

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // replace with your key
        amount: order_amount,
        currency: currency,
        name: "Escrow Payment",
        description: `Payment for Contract ${contractId}`,
        order_id: order_id,
        handler: async function (response) {
          try {
            // verify payment on backend
            await axios.post(
              "/webhook",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Payment successful! Escrow locked.");
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          }
        },
        prefill: { email: "", name: "" },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Pay & Lock Escrow</h2>
      <div className="mb-4">
        Contract: {contractId} | Amount: ₹{amount}
      </div>
      <button
        onClick={handlePayment}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
