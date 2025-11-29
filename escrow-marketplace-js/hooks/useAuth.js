"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUser,
  getUserByEmailAndRole,
  setCurrentUser,
} from "@/utils/storage";
import { validateSignup, validateLogin } from "@/utils/validation";

export function useAuth(role) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const signup = async (data) => {
    setLoading(true);
    setError(null);

    const validationError = validateSignup(data);
    if (validationError) {
      setLoading(false);
      setError(validationError);
      return;
    }

    createUser({ ...data, role, approved: role === "admin" ? true : false });
    setCurrentUser({
      name: data.name,
      email: data.email,
      role,
    });

    const redirect =
      role === "worker"
        ? "/worker/dashboard"
        : role === "client"
        ? "/client/dashboard"
        : "/admin/dashboard";

    router.push(redirect);
    setLoading(false);
  };

  const login = async (data) => {
    setLoading(true);
    setError(null);

    const validationError = validateLogin(data);
    if (validationError) {
      setLoading(false);
      setError(validationError);
      return;
    }

    if (role === "admin") {
      const adminEmail =
        process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@example.com";
      const adminPassword =
        process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

      if (data.email === adminEmail && data.password === adminPassword) {
        setCurrentUser({
          name: "Admin",
          email: data.email,
          role: "admin",
        });
        router.push("/admin/dashboard");
        setLoading(false);
        return;
      } else {
        setError("Invalid admin credentials.");
        setLoading(false);
        return;
      }
    }

    const user = getUserByEmailAndRole(data.email, role);
    if (!user || user.password !== data.password) {
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }

    if (!user.approved) {
      setError("Your account is awaiting admin approval.");
      setLoading(false);
      return;
    }

    setCurrentUser({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const redirect =
      role === "worker"
        ? "/worker/dashboard"
        : role === "client"
        ? "/client/dashboard"
        : "/admin/dashboard";

    router.push(redirect);
    setLoading(false);
  };

  return { signup, login, loading, error };
}
