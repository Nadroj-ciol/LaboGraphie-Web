import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const FadeIn = ({ children, className, delay = 0 }: FadeInProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      if (delay > 0) {
        timer = setTimeout(() => setIsVisible(true), delay);
      } else {
        setIsVisible(true);
      }
    };

    // Si l'élément est déjà dans le viewport au montage (ex. changement d'onglet ou haut de page),
    // on le révèle immédiatement sans attendre un événement scroll.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > -50) {
      reveal();
      return () => {
        if (timer) clearTimeout(timer);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.01, rootMargin: "50px 0px" }
    );

    observer.observe(el);

    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export default FadeIn;
