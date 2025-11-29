"use client";

export default function RazorpayButton({ amount, onMockPayment }) {
  const handleClick = () => {
    alert(
      `This is a Razorpay UI placeholder.\nSimulating payment of ₹${amount}.`
    );
    onMockPayment();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 text-sm"
    >
      Pay with Razorpay (Demo)
    </button>
  );
}
