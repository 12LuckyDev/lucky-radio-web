import type { ComponentChildren } from "preact";
import type { AccordionHeaderProps } from "./accordion-header-props";

export type AccordionItemData = {
  title: string;
  header?:
    | ComponentChildren
    | ((headerProps: AccordionHeaderProps) => ComponentChildren | null);
  key: string;
  content: ComponentChildren;
};
