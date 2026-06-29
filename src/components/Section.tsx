import { useEffect, useRef, type ReactNode } from "react";

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  heading?: string;
  subheading?: string;
  variant?: "default" | "dark" | "alt";
};

export function Section({
  id,
  children,
  className = "",
  heading,
  subheading,
  variant = "default",
}: SectionProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.revealed = "true";
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`section section--${variant} ${className}`}
      data-revealed="false"
    >
      <div className="section__inner">
        {heading && (
          <header className="section__header">
            {subheading && <span className="section__label">{subheading}</span>}
            <h2 className="section__heading">{heading}</h2>
          </header>
        )}
        {children}
      </div>
    </section>
  );
}