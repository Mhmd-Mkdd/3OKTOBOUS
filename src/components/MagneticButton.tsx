import { useRef, type ReactNode } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  strength?: number;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * MagneticButton — an element that subtly pulls toward the pointer on hover.
 * Uses a single rAF + transform; no GSAP needed.
 */
export function MagneticButton({
  children,
  href = "#",
  className = "",
  strength = 0.4,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`magnetic ${className}`}
    >
      {children}
    </a>
  );
}