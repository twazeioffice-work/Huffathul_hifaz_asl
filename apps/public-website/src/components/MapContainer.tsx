"use client";

import { useLazyMap } from "@/hooks/useLazyMap";

interface MapContainerProps {
  latitude: number;
  longitude: number;
  branchName: string;
}

export default function MapContainer({
  latitude,
  longitude,
  branchName,
}: MapContainerProps) {
  const [containerRef, isVisible] = useLazyMap({ rootMargin: "200px" });

  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY || "";
  const mapSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}`
    : `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`;

  return (
    <div
      ref={containerRef}
      className="w-full h-[350px] bg-card border border-border rounded-lg relative overflow-hidden flex items-center justify-center"
    >
      {!isVisible ? (
        <div className="absolute inset-0 animate-pulse bg-slate-100 flex flex-col items-center justify-center space-y-2">
          <span className="text-muted-foreground text-xs">
            Loading interactive location map for {branchName}...
          </span>
          <div className="h-3 w-1/3 bg-slate-200 rounded"></div>
        </div>
      ) : (
        <iframe
          title={`Google Maps location marker for ${branchName}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={mapSrc}
        />
      )}
    </div>
  );
}
