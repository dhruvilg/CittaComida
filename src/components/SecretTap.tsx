"use client";

import { useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/** Wraps any element; N quick taps on it opens the hidden route. */
export default function SecretTap({ children, taps = 5, windowMs = 2500, to = "/c" }: { children: ReactNode; taps?: number; windowMs?: number; to?: string }) {
  const router = useRouter();
  const times = useRef<number[]>([]);
  const onTap = () => {
    const now = Date.now();
    times.current = [...times.current.filter((t) => now - t < windowMs), now];
    if (times.current.length >= taps) {
      times.current = [];
      router.push(to);
    }
  };
  return (
    <span onClick={onTap} className="inline-flex cursor-default select-none" aria-hidden="true">
      {children}
    </span>
  );
}
