import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { JSX } from "react";

type BlurTextProps = {
  text: string;
  className?: string;
  animateBy?: "words" | "chars";
  delay?: number; // ms entre ítems
  direction?: "top" | "bottom";
  rootMargin?: string;
  stepDuration?: number; // s duración de cada transición
  as?: keyof JSX.IntrinsicElements;
};

export default function BlurText({
  text,
  className,
  animateBy = "words",
  delay = 50,
  direction = "top",
  rootMargin = "0px 0px -10% 0px",
  stepDuration = 0.35,
  as = "div",
}: BlurTextProps) {
  const Wrapper: React.ElementType = as;
  const ref = useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (visible) return;
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
            break;
          }
        }
      },
      { root: null, rootMargin, threshold: 0.1 }
    );
    obs.observe(el);
    // Fallback: si por algún motivo no dispara, forzar tras 300ms
    const t = window.setTimeout(() => {
      if (!inView) setInView(true);
    }, 300);
    return () => {
      obs.disconnect();
      window.clearTimeout(t);
    };
  }, [rootMargin, visible]);

  // Asegura que las transiciones se apliquen: cambia a visible en el siguiente frame
  useEffect(() => {
    if (!inView || visible) return;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [inView, visible]);

  const items = useMemo(() => {
    if (animateBy === "chars") return Array.from(text);
    return text.split(/(\s+)/);
  }, [text, animateBy]);

  const isUp = direction === "top";

  return (
    <span ref={ref} aria-label={text}>
      <Wrapper className={className}>
      {items.map((token, i) => {
        const isSpace = token === " " || token === "\n" || /^\s+$/.test(token);
        const style: CSSProperties = isSpace
          ? { whiteSpace: "pre-wrap" }
          : {
              display: "inline-block",
              filter: visible ? "blur(0px)" : "blur(8px)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : `translateY(${isUp ? "8px" : "-8px"})`,
              transition: `opacity ${stepDuration}s ease, filter ${stepDuration}s ease, transform ${stepDuration}s ease`,
              transitionDelay: `${i * delay}ms`,
            };

        return (
          <span key={i} style={style} aria-hidden>
            {token === " " ? '\u00A0' : token}
          </span>
        );
      })}
      </Wrapper>
    </span>
  );
}
