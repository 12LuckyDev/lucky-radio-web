import { useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren, CSSProperties } from "preact";

import "./marquee.css";

interface MarqueeProps {
  children: ComponentChildren;
  speed?: number;
  gap?: string;
}

export function Marquee({ children, speed = 40, gap = "50%" }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [distance, setDistance] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const measure = () => {
      const containerWidth = container.clientWidth;
      const contentWidth = content.getBoundingClientRect().width;

      const gapWidth = gap.endsWith("%")
        ? (parseFloat(gap) / 100) * containerWidth
        : parseFloat(gap) || 0;

      const overflowing = contentWidth > containerWidth;

      setIsOverflowing(overflowing);
      setDistance(contentWidth + gapWidth);
    };

    const observer = new ResizeObserver(measure);

    observer.observe(container);
    observer.observe(content);

    measure();

    return () => observer.disconnect();
  }, [children, gap]);

  const duration = distance > 0 ? distance / speed : 0;

  const style = {
    "--distance": `${distance}px`,
    "--duration": `${duration}s`,
    "--gap": gap.endsWith("%")
      ? `${(parseFloat(gap) / 100) * (containerRef.current?.clientWidth ?? 0)}px`
      : `${parseFloat(gap) || 0}px`,
  } as CSSProperties;

  return (
    <div ref={containerRef} class="marquee">
      <div
        class={`marquee-track ${isOverflowing ? "is-animated" : ""}`}
        style={style}
      >
        <div ref={contentRef} class="marquee-content">
          {children}
        </div>

        {isOverflowing && (
          <div class="marquee-content" aria-hidden="true">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
