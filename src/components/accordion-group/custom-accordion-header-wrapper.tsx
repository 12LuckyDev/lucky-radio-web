import type { ComponentChildren } from "preact";
import "./custom-accordion-header-wrapper.css";
import clsx from "clsx";
import type { AccordionHeaderProps } from "./models/accordion-header-props";

type CustomAccordionHeaderWrapperProps = {
  headerProps: AccordionHeaderProps;
  children: ComponentChildren;
  endSlotChildren?: ComponentChildren;
};

export function CustomAccordionHeaderWrapper({
  headerProps,
  children,
  endSlotChildren,
}: CustomAccordionHeaderWrapperProps) {
  return (
    <div class="header-container">
      {children}

      <div class="end-slot-container">
        <button class="button" onClick={headerProps.onOpenToggle}>
          <span class="icon">
            <i
              class={clsx(
                "fas",
                headerProps.isLast ? "fa-caret-up" : "fa-caret-down",
              )}
            ></i>
          </span>
        </button>

        {endSlotChildren}
      </div>
    </div>
  );
}
