import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { useNotifications } from "../contexts/notification/notification-context";
import { errorMsgHelper } from "../core/error-msg-helper";

type SyncedStateConfig<T> = {
  initialValue: T;
  fetchData: () => Promise<T>;
  subscribe: (onChange: (value: T) => void) => () => void;
  errorMsg?: string;
};

export function useSyncedState<T>({
  initialValue,
  fetchData,
  subscribe,
  errorMsg,
}: SyncedStateConfig<T>): [T, () => Promise<void>] {
  const notifications = useNotifications();
  const [value, setValue] = useState<T>(initialValue);
  const version = useRef(0);

  const refresh = useCallback(async () => {
    const currentVersion = version.current;

    try {
      const result = await fetchData();

      if (currentVersion === version.current) {
        setValue(result);
      }
    } catch (error) {
      if (errorMsg) {
        console.error(errorMsg, error);
      } else {
        console.error(error);
      }
      notifications.danger(errorMsgHelper(error));
    }
  }, [fetchData, notifications]);

  useEffect(() => {
    const unsubscribe = subscribe((nextValue) => {
      version.current++;
      setValue(nextValue);
    });

    void refresh();

    return () => {
      version.current++;
      unsubscribe();
    };
  }, [subscribe, refresh]);

  return [value, refresh];
}
