"use client";

import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function BackendPing() {
  useEffect(() => {
    fetch(`${API_URL}/`, { method: "GET", cache: "no-store" })
      .catch(() => {}); // silencioso — só acorda o backend
  }, []);

  return null;
}