import { useState, useEffect } from "react";

export function useResponsive() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const mql = window.matchMedia("(max-width: 768px)");
    
    const onChange = () => {
      setIsMobile(mql.matches);
    };
    
    mql.addEventListener("change", onChange);
    setIsMobile(mql.matches);
    
    return () => mql.removeEventListener("change", onChange);
  }, []);
  
  return { isMobile };
}
