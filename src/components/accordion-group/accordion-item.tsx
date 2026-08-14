import { useEffect, useRef } from "preact/hooks";
import type { AccordionItemData } from "./models/accordion-item-data";
import clsx from "clsx";

import "./accordion-item.css";

export function AccordionItem({
  item: { title, header, key, content },
  isLast,
  isOpen,
  openedHeight,
  onClick,
}: {
  item: AccordionItemData;
  isLast: boolean;
  isOpen: boolean;
  openedHeight: number;
  onClick: (type: string) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const height = isOpen ? `${openedHeight}px` : "0px";
    el.style.maxHeight = height;
    el.style.minHeight = height;
  }, [openedHeight, isOpen]);

  const onOpenToggle = () => onClick(key);

  const defaultHeader = (
    <button class="button is-fullwidth" onClick={onOpenToggle}>
      <span>{title}</span>
      <span class="icon">
        <i
          class={clsx(
            "fas",
            isOpen && !isLast ? "fa-caret-up" : "fa-caret-down",
          )}
        ></i>
      </span>
    </button>
  );

  const resolvedHeader =
    header === undefined
      ? defaultHeader
      : typeof header === "function"
        ? (header({ isLast, isOpen, onOpenToggle }) ?? defaultHeader)
        : header;

  return (
    <>
      <div data-accordion-header="true">{resolvedHeader}</div>

      <div ref={contentRef} class="accordion-content">
        {content}
      </div>
    </>
  );
}
