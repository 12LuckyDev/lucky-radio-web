import { useEffect, useRef } from "preact/hooks";

export function useOnVisibilityChange(onVisible: () => void) {
  const callbackRef = useRef(onVisible);

  callbackRef.current = onVisible;

  useEffect(() => {
    let wasHidden = false;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        wasHidden = true;
        return;
      }

      if (document.visibilityState === "visible" && wasHidden) {
        wasHidden = false;
        callbackRef.current();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
