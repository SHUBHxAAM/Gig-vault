"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/Card";

export default function AdminLoginPage() {
  const { login, loading, error } = useAuth("admin");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card title="Admin Login">
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div className="flex flex-col gap-1">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg mt-2 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Default admin: admin@example.com / admin123 (configurable via .env).
          </p>
        </form>
      </Card>
    </div>
  );
}
