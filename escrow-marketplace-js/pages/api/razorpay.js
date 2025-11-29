export default function handler(req, res) {
  if (req.method === "POST") {
    return res
      .status(200)
      .json({
        message:
          "Razorpay placeholder endpoint. Implement real logic here.",
      });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
