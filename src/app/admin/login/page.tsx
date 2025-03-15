"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function AdminLoginRedirect() {
  useEffect(() => {
    // Client-side redirect
    window.location.href = "/auth/admin-login";
  }, []);

  // Server-side redirect (for SSR)
  redirect("/auth/admin-login");
}
