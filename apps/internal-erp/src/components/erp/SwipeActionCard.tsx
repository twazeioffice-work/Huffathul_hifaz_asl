"use client";

import React, { useRef, useState } from "react";
import { motion, useAnimation, useMotionValue, PanInfo } from "framer-motion";
import { Trash2, CheckCircle2 } from "lucide-react";

interface SwipeActionCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftThreshold?: number;
  rightThreshold?: number;
}

export function SwipeActionCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftThreshold = -80,
  rightThreshold = 80,
}: SwipeActionCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [swiped, setSwiped] = useState<"left" | "right" | null>(null);

  const handleDragEnd = async (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < leftThreshold || velocity < -500) {
      if (onSwipeLeft) {
        setSwiped("left");
        await controls.start({ x: -window.innerWidth, opacity: 0 });
        onSwipeLeft();
        return;
      }
    } else if (offset > rightThreshold || velocity > 500) {
      if (onSwipeRight) {
        setSwiped("right");
        await controls.start({ x: window.innerWidth, opacity: 0 });
        onSwipeRight();
        return;
      }
    }

    // Bounce back if threshold not met
    controls.start({ x: 0, transition: { type: "spring", bounce: 0.4 } });
  };

  if (swiped) return null; // Unmount after swipe completes for now

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-lg bg-card touch-target my-2">
      {/* Background Action Indicators */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
        <div
          className={`flex items-center text-grade-mumtaz transition-opacity duration-300`}
          style={{ opacity: x.get() > 20 ? 1 : 0 }}
        >
          <CheckCircle2 className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm">Approve</span>
        </div>
        <div
          className={`flex items-center text-grade-daif transition-opacity duration-300`}
          style={{ opacity: x.get() < -20 ? 1 : 0 }}
        >
          <span className="font-semibold text-sm mr-2">Reject</span>
          <Trash2 className="w-6 h-6" />
        </div>
      </div>

      {/* Foreground Draggable Card */}
      <motion.div
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        className="relative z-10 w-full bg-background border border-border rounded-lg shadow-sm active:cursor-grabbing p-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
