"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSession } from "@/hooks/use-app-session";

/**
 * Guest-only gate. Signed in? Go home.
 * UX only. API still check real session.
 */
export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useAppSession();

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [isPending, session, router]);

  // Hide form while check run, or while redirect happen
  if (isPending || session) return null;

  return <>{children}</>;
}
