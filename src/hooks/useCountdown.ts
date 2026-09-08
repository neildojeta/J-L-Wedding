import { useEffect, useState } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
}

function diff(target: number): TimeLeft {
  const ms = target - Date.now();
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }
  const seconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    passed: false,
  };
}

export function useCountdown(isoDate: string): TimeLeft {
  const target = new Date(isoDate).getTime();
  const [left, setLeft] = useState<TimeLeft>(() => diff(target));

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const id = window.setInterval(() => setLeft(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return left;
}
