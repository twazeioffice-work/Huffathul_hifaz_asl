"use client";

import { useState, useEffect, useCallback } from "react";

export function useRateLimit(cooldownSeconds: number = 60) {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isLimited, setIsLimited] = useState<boolean>(false);

  useEffect(() => {
    if (remainingTime <= 0) {
      setIsLimited(false);
      return;
    }

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLimited(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const triggerLimit = useCallback((customSeconds?: number) => {
    const delay = customSeconds || cooldownSeconds;
    setRemainingTime(delay);
    setIsLimited(true);
  }, [cooldownSeconds]);

  return { isLimited, remainingTime, triggerLimit };
}
