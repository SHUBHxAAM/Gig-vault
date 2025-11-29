"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import FileUpload from "@/components/FileUpload";
import Card from "@/components/Card";

export default function ClientSignupPage() {
  const { signup, loading, error } = useAuth("client");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [aadharFile, setAadharFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!aadharFile) {
      alert("Please select an Aadhar file. (Frontend only)");
      return;
    }
    signup(form);
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card title="Client Signup">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col gap-1 text-sm">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>
          <FileUpload
            label="Aadhar Upload"
            onChange={(file) => setAadharFile(file)}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg mt-2 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up as Client"}
          </button>
          <p className="text-xs text-gray-500 mt-1">
            After signup, admin approval is required before you can login.
          </p>
        </form>
      </Card>
    </div>
  );
}
