import { useState } from "preact/hooks";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import type { ComponentChildren } from "preact";
import "./tabs.css";

const duration = 0.3;

export type TabItem = {
  id: string;
  label: string;
  content: ComponentChildren;
  icon: string;
  disabled?: boolean;
};

export type TabsProps = {
  tabs: TabItem[];
  orientation?: "horizontal" | "vertical";
  activeTab: string;
  onChange?: (id: string) => void;
};

export function Tabs({
  tabs,
  orientation = "horizontal",
  activeTab,
  onChange,
}: TabsProps) {
  const [direction, setDirection] = useState(1);

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  const currentTab = tabs[activeIndex];
  const isVertical = orientation === "vertical";
  const axis = isVertical ? "y" : "x";
  const offset = 40;

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      [axis]: dir * offset,
    }),
    center: {
      opacity: 1,
      [axis]: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      [axis]: dir * -offset,
    }),
  };

  const selectTab = (id: string) => {
    if (id === activeTab) return;

    const nextIndex = tabs.findIndex((tab) => tab.id === id);

    if (nextIndex === -1 || tabs[nextIndex].disabled) return;

    setDirection(nextIndex > activeIndex ? 1 : -1);

    onChange?.(id);
  };

  return (
    <div class={clsx("tabs", isVertical && "tabs-vertical")}>
      <div
        class={clsx("tabs-menu", isVertical && "tabs-menu-vertical")}
        role="tablist"
        aria-orientation={isVertical ? "vertical" : "horizontal"}
      >
        {tabs.map((tab) => {
          const selected = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              disabled={tab.disabled}
              class={clsx(
                "button",
                isVertical ? "is-large" : "is-medium",
                selected && "is-primary",
              )}
              onClick={() => selectTab(tab.id)}
            >
              <span class={clsx("icon", isVertical ? "is-large" : "is-medium")}>
                <i class={clsx("fas", tab.icon)}></i>
              </span>
            </button>
          );
        })}
      </div>

      <div class="tab-content">
        <AnimatePresence mode="sync" initial={false} custom={direction}>
          {currentTab && (
            <motion.div
              key={currentTab.id}
              id={`panel-${currentTab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${currentTab.id}`}
              tabIndex={0}
              custom={direction}
              variants={variants}
              initial={"enter"}
              animate="center"
              exit={"exit"}
              transition={{
                duration,
                ease: [0.22, 1, 0.36, 1],
              }}
              class="tab-panel"
            >
              {currentTab.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Tabs;
