import type { ComponentChildren } from "preact";

interface ConfirmationModalProps {
  isOpen: boolean;
  message?: string;
  children?: ComponentChildren;
  confirmText?: string;
  cancelText?: string;
  confirmClass?: string;
  onClose: (confirmed: boolean) => void;
}

export function ConfirmationModal({
  isOpen,
  message,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmClass = "is-primary",
  onClose,
}: ConfirmationModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div class="modal is-active">
      <div class="modal-background" onClick={() => onClose(false)} />

      <div class="modal-content">
        <div class="box p-5">
          <div class="content mb-5">
            {message && <p class="is-size-5 mb-0">{message}</p>}
            {children && <p class="is-size-5 mb-0">{children}</p>}
          </div>

          <div class="buttons is-justify-content-flex-end mb-0">
            <button class="button" type="button" onClick={() => onClose(false)}>
              {cancelText}
            </button>

            <button
              class={`button ${confirmClass}`}
              type="button"
              onClick={() => onClose(true)}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
