import type { ComponentChildren } from "preact";
import "./action-modal.css";

interface ActionModalAction {
  iconClass: string;
  buttonClass?: string;
  key: string;
  action: () => void;
  dismiss?: boolean;
}

interface ActionModalProps {
  isOpen: boolean;
  title?: string;
  children?: ComponentChildren;
  actions: ActionModalAction[];
  onClose: (close: boolean) => void;
}

export function ActionModal({
  isOpen,
  title,
  children,
  actions,
  onClose,
}: ActionModalProps) {
  if (!isOpen) {
    return null;
  }

  const onCloseHandle = () => onClose(true);

  return (
    <div class="modal is-active is-bottom">
      <div class="modal-background" onClick={onCloseHandle} />

      <div class="modal-content">
        <div class="box">
          {title && <p class="title is-5">{title}</p>}
          {children && <p class="title is-5">{children}</p>}

          <div class="buttons">
            {actions.map((item) => (
              <button
                key={item.key}
                class={`button ${item.buttonClass ?? ""}`}
                type="button"
                onClick={() => {
                  if (item.dismiss !== false) {
                    onClose(false);
                  }
                  item.action();
                }}
              >
                <span class="icon">
                  <i class={item.iconClass} />
                </span>
              </button>
            ))}

            <button
              class="button ml-auto"
              type="button"
              onClick={onCloseHandle}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
