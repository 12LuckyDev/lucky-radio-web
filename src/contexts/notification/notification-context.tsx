import { createContext } from "preact";
import type { FunctionComponent, ComponentChildren } from "preact";
import { createPortal } from "preact/compat";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";

import "./notification.css";

type NotificationType = "success" | "info" | "warning" | "danger";

export interface NotificationOptions {
  type?: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

interface Notification extends NotificationOptions {
  id: string;
}

export interface NotificationsState {
  success: (
    message: string,
    options?: Omit<NotificationOptions, "message" | "type">,
  ) => string;

  info: (
    message: string,
    options?: Omit<NotificationOptions, "message" | "type">,
  ) => string;

  warning: (
    message: string,
    options?: Omit<NotificationOptions, "message" | "type">,
  ) => string;

  danger: (
    message: string,
    options?: Omit<NotificationOptions, "message" | "type">,
  ) => string;

  remove: (id: string) => void;
  clear: () => void;
}

const NotificationsContext = createContext<NotificationsState>({
  success: () => "",
  info: () => "",
  warning: () => "",
  danger: () => "",
  remove: () => {},
  clear: () => {},
});

const typeClasses: Record<NotificationType, string> = {
  success: "is-success",
  info: "is-info",
  warning: "is-warning",
  danger: "is-danger",
};

const NotificationItem: FunctionComponent<{
  notification: Notification;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const { id, type = "info", title, message, duration = 5000 } = notification;

  useEffect(() => {
    if (duration <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [id, duration, onRemove]);

  const handleClick = () => {
    onRemove(id);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRemove(id);
    }
  };

  return (
    <div
      className={`notification notification-item ${typeClasses[type]}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      {title && <p className="has-text-weight-bold mb-1">{title}</p>}

      <p>{message}</p>
    </div>
  );
};

export const NotificationProvider: FunctionComponent<{
  children: ComponentChildren;
}> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const remove = useCallback((id: string) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  }, []);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  const notify = useCallback((options: NotificationOptions) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const notification: Notification = {
      id,
      type: "info",
      duration: 5000,
      ...options,
    };

    setNotifications((current) => [...current, notification]);

    return id;
  }, []);

  const success = useCallback(
    (
      message: string,
      options: Omit<NotificationOptions, "message" | "type"> = {},
    ) =>
      notify({
        ...options,
        message,
        type: "success",
      }),
    [notify],
  );

  const info = useCallback(
    (
      message: string,
      options: Omit<NotificationOptions, "message" | "type"> = {},
    ) =>
      notify({
        ...options,
        message,
        type: "info",
      }),
    [notify],
  );

  const warning = useCallback(
    (
      message: string,
      options: Omit<NotificationOptions, "message" | "type"> = {},
    ) =>
      notify({
        ...options,
        message,
        type: "warning",
      }),
    [notify],
  );

  const danger = useCallback(
    (
      message: string,
      options: Omit<NotificationOptions, "message" | "type"> = {},
    ) =>
      notify({
        ...options,
        message,
        type: "danger",
      }),
    [notify],
  );

  const value: NotificationsState = {
    success,
    info,
    warning,
    danger,
    remove,
    clear,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}

      {createPortal(
        <div className="notifications">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={remove}
            />
          ))}
        </div>,
        document.body,
      )}
    </NotificationsContext.Provider>
  );
};

export function useNotifications(): NotificationsState {
  const context = useContext(NotificationsContext);
  return context;
}
