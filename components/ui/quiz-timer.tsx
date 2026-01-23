"use client";

import { useEffect, useRef, useState } from "react";

export default function QuizTimer({ minutes, formId }: { minutes: number; formId: string }) {
  const [remaining, setRemaining] = useState(minutes * 60);
  const [expired, setExpired] = useState(false);
  const startedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!minutes || minutes <= 0) return;
    if (startedRef.current == null) {
      startedRef.current = Date.now();
    }
    const tick = () => {
      const elapsed = Math.floor((Date.now() - (startedRef.current as number)) / 1000);
      const left = minutes * 60 - elapsed;
      setRemaining(left > 0 ? left : 0);
      if (left <= 0) {
        setExpired(true);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [minutes]);

  useEffect(() => {
    if (!expired) return;
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (form) {
      const fm = form as HTMLFormElement & { __submitted?: boolean };
      if (!fm.__submitted) {
        fm.__submitted = true;
        fm.requestSubmit();
      }
    }
  }, [expired, formId]);

  if (!minutes || minutes <= 0) return null;
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  const percent = Math.max(0, Math.min(100, (remaining / (minutes * 60)) * 100));

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
      <span className="font-semibold" aria-live="polite">
        Time Left: {m}:{s.toString().padStart(2, "0")}
      </span>
      <div className="w-32 h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden" aria-label="Time remaining">
        <div
          className="h-full bg-amber-500 dark:bg-amber-400"
          style={{ width: `${percent}%`, transition: "width 1s linear" }}
        />
      </div>
    </div>
  );
}
