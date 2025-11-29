"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/utils/storage";

export function useProtectedRoute(allowedRole) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace(
        allowedRole === "worker"
          ? "/worker/login"
          : allowedRole === "client"
          ? "/client/login"
          : "/admin/login"
      );
      return;
    }

    if (user.role !== allowedRole) {
      router.replace("/");
    }
  }, [router, pathname, allowedRole]);
}
