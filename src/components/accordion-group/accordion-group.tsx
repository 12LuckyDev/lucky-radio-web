import { useRef, useState, useLayoutEffect } from "preact/hooks";
import { AccordionItem } from "./accordion-item";
import type { AccordionItemData } from "./models/accordion-item-data";

import "./accordion-group.css";

export function AccordionGroup({
  items,
  active,
  setActive,
}: {
  items: AccordionItemData[];
  active: string;
  setActive: (key: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openedHeight, setOpenedHeight] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    const getHeaders = () =>
      Array.from(container.querySelectorAll('[data-accordion-header="true"]'));

    const updateHeights = () => {
      const headersHeight = getHeaders().reduce(
        (sum, el) => sum + el.getBoundingClientRect().height,
        0,
      );

      setOpenedHeight(container.getBoundingClientRect().height - headersHeight);
    };

    updateHeights();

    const observer = new ResizeObserver(updateHeights);

    observer.observe(container);
    getHeaders().forEach((header) => observer.observe(header));

    return () => {
      observer.disconnect();
    };
  }, []);

  const onClick = (type: string) => {
    if (type !== active) {
      setActive(type);
      return;
    }

    const keys = items.map(({ key }) => key).filter((key) => key !== type);
    if (keys.length === 0) return;

    setActive(keys[0]);
  };

  return (
    <div class="accordion-group" ref={containerRef}>
      {items.map((item, i) => {
        const isOpen = active === item.key;
        return (
          <AccordionItem
            item={item}
            key={item.key}
            isLast={i === items.length - 1}
            isOpen={isOpen}
            openedHeight={openedHeight}
            onClick={onClick}
          ></AccordionItem>
        );
      })}
    </div>
  );
}
