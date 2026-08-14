import { createContext } from "preact";
import type { FunctionComponent, ComponentChildren } from "preact";
import { createPortal } from "preact/compat";
import { useCallback, useContext, useState } from "preact/hooks";

import clsx from "clsx";

import "./progress.css";

export interface ProgressState {
  loading: boolean;
  show: () => void;
  hide: () => void;
}

const ProgressContext = createContext<ProgressState>({
  loading: false,
  show: () => {},
  hide: () => {},
});

export const ProgressProvider: FunctionComponent<{
  children: ComponentChildren;
}> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const show = useCallback(() => {
    setLoading(true);
  }, []);

  const hide = useCallback(() => {
    setLoading(false);
  }, []);

  const value: ProgressState = {
    loading,
    show,
    hide,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}

      {createPortal(
        <div
          className={clsx("main-progress", loading && "is-active")}
          aria-hidden={!loading}
        >
          <progress className="progress is-small is-primary" max="100" />
        </div>,
        document.body,
      )}
    </ProgressContext.Provider>
  );
};

export function useProgress() {
  const context = useContext(ProgressContext);
  return context;
}
