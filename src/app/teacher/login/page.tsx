"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function TeacherLoginRedirect() {
  useEffect(() => {
    // Client-side redirect
    window.location.href = "/auth/teacher-login";
  }, []);

  // Server-side redirect (for SSR)
  redirect("/auth/teacher-login");
}
