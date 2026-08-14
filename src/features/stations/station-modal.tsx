import { useEffect, useState } from "preact/hooks";
import { api } from "../../api-client/api";
import type { StationDTO } from "../../models/station-dto";
import { useNotifications } from "../../contexts/notification/notification-context";
import { useProgress } from "../../contexts/progress/progress-context";
import clsx from "clsx";
import { errorMsgHelper } from "../../core/error-msg-helper";

interface StationModalProps {
  isOpen: boolean;
  station?: StationDTO | null;
  onClose: (refresh: boolean) => void;
}

interface FormErrors {
  name?: string;
  url?: string;
}

export function StationModal({
  isOpen,
  station = null,
  onClose,
}: StationModalProps) {
  const notifications = useNotifications();
  const progress = useProgress();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isEdit = station !== null;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(station?.name ?? "");
    setUrl(station?.url ?? "");
    setErrors({});
  }, [isOpen, station]);

  if (!isOpen) {
    return null;
  }

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Station name is required.";
    }

    if (!url.trim()) {
      nextErrors.url = "Stream URL is required.";
    } else {
      try {
        const parsedUrl = new URL(url.trim());

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          nextErrors.url = "Stream URL must use HTTP or HTTPS.";
        }
      } catch {
        nextErrors.url = "Please enter a valid URL.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    progress.show();
    const stationData = {
      name: name.trim(),
      url: url.trim(),
    };

    try {
      if (station) {
        const { id, ...rest } = station;
        await api.stations.patchStation(id, { ...rest, ...stationData });
        notifications.success(`Changes in station ${stationData.name} saved!`);
      } else {
        await api.stations.postStation(stationData);
        notifications.success(`Station ${stationData.name} added!`);
      }

      onClose(true);
    } catch (error) {
      console.error("Error during saving", error);
      notifications.danger(errorMsgHelper(error));
    } finally {
      progress.hide();
    }
  };

  const onCloseHandler = () => onClose(false);

  return (
    <div class="modal is-active">
      <div class="modal-background" onClick={onCloseHandler} />

      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {isEdit ? "Edit station" : "Add station"}
          </p>

          <button
            class="delete"
            type="button"
            aria-label="Close"
            onClick={onCloseHandler}
          />
        </header>

        <form onSubmit={handleSubmit}>
          <section class="modal-card-body">
            <div class="field">
              <label class="label" for="station-name">
                Name
              </label>
              <div class="control">
                <input
                  id="station-name"
                  class={`input ${errors.name ? "is-danger" : ""}`}
                  value={name}
                  onInput={(event) => setName(event.currentTarget.value)}
                  autoFocus
                />
              </div>
              {errors.name && <p class="help is-danger">{errors.name}</p>}
            </div>

            <div class="field">
              <label class="label" for="station-url">
                Stream URL
              </label>

              <div class="control">
                <input
                  id="station-url"
                  class={`input ${errors.url ? "is-danger" : ""}`}
                  value={url}
                  onInput={(event) => setUrl(event.currentTarget.value)}
                  placeholder="https://example.com/stream"
                />
              </div>

              {errors.url ? (
                <p class="help is-danger">{errors.url}</p>
              ) : (
                <p class="help">Enter the URL of the radio stream.</p>
              )}
            </div>
          </section>

          <footer class="modal-card-foot is-justify-content-flex-end">
            <div class="buttons">
              <button
                class="button"
                type="button"
                onClick={onCloseHandler}
                disabled={progress.loading}
              >
                Cancel
              </button>

              <button
                class={clsx(
                  "button",
                  "is-primary",
                  progress.loading && "is-loading",
                )}
                type="submit"
                disabled={progress.loading}
              >
                {isEdit ? "Save changes" : "Add station"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
