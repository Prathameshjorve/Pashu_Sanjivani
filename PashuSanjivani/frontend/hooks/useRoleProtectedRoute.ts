"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export function useRoleProtectedRoute(allowedRoles: string[]) {
  const router = useRouter();
  const { token, role } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!token) {
        // Not logged in, redirect to login
        router.replace("/login");
        return;
      }

      if (role && !allowedRoles.includes(role)) {
        // Logged in but wrong role, redirect to correct dashboard
        if (role === "farmer") {
          router.replace("/dashboard");
        } else if (role === "vet") {
          router.replace("/vet/dashboard");
        } else if (role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/login");
        }
        return;
      }

      // Authorized
      setIsAuthorized(true);
    }
  }, [token, role, allowedRoles, router]);

  return isAuthorized;
}
