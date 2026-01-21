 "use client";
 
 import { useEffect, useRef } from "react";
 import { cn } from "@/lib/utils";
 
 export function Reveal({
   children,
   className,
   once = true,
 }: {
   children: React.ReactNode;
   className?: string;
   once?: boolean;
 }) {
   const ref = useRef<HTMLDivElement | null>(null);
 
   useEffect(() => {
     const el = ref.current;
     if (!el) return;
 
     const observer = new IntersectionObserver(
       (entries) => {
         entries.forEach((entry) => {
           if (entry.isIntersecting) {
             entry.target.classList.add("is-visible");
             if (once) observer.unobserve(entry.target);
           } else if (!once) {
             entry.target.classList.remove("is-visible");
           }
         });
       },
       { threshold: 0.15 }
     );
 
     observer.observe(el);
     return () => observer.disconnect();
   }, [once]);
 
   return (
     <div ref={ref} className={cn("reveal", className)}>
       {children}
     </div>
   );
 }
 
