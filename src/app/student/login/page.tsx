"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function StudentLoginRedirect() {
  useEffect(() => {
    // Client-side redirect
    window.location.href = "/auth/student-login";
  }, []);

  // Server-side redirect (for SSR)
  redirect("/auth/student-login");
}
