import { useMemo, useState } from "preact/hooks";
import { TilePager } from "../../components/tile-pager/tile-pager";
import { useStations } from "../../contexts/stations/stations-context";
import type { StationDTO } from "../../models/station-dto";
import { AddStationTile } from "./stations-tile-pager/add-station-tile";
import { StationTile } from "./stations-tile-pager/station-tile";
import { StationModal } from "./station-modal";
import { ConfirmationModal } from "../../components/confirmation-modal/confirmation-modal";
import { api } from "../../api-client/api";
import { ActionModal } from "../../components/action-modal/action-modal";
import { useNotifications } from "../../contexts/notification/notification-context";
import { useProgress } from "../../contexts/progress/progress-context";
import { errorMsgHelper } from "../../core/error-msg-helper";

export function Stations() {
  const notifications = useNotifications();
  const progress = useProgress();

  const { getStations } = useStations();
  const [stationModalOpen, setStationModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const [pendingStation, setPendingStation] = useState<StationDTO | null>(null);

  const persistentTiles = useMemo(
    () => ({
      add: <AddStationTile onClick={() => setStationModalOpen(true)} />,
    }),
    [setStationModalOpen],
  );

  const onModalClose = async () => {
    setStationModalOpen(false);
    setPendingStation(null);
  };

  const onEdit = (station: StationDTO) => {
    setPendingStation(station);
    setStationModalOpen(true);
  };

  const onDelete = async (station: StationDTO) => {
    setPendingStation(station);
    setConfirmModalOpen(true);
  };

  const onAction = (station: StationDTO) => {
    setPendingStation(station);
    setActionModalOpen(true);
  };

  const onActionClose = (close: boolean) => {
    if (close) {
      setPendingStation(null);
    }
    setActionModalOpen(false);
  };

  const handleDeletion = async (confirm: boolean) => {
    const { id, name } = pendingStation ?? {};
    setPendingStation(null);
    setConfirmModalOpen(false);
    if (!confirm || !id) return;
    try {
      progress.show();
      await api.stations.deleteStation(id);
      notifications.success(
        `Station "${name}" have been successfully removed.`,
      );
    } catch (error) {
      console.error("Error during saving", error);
      notifications.danger(errorMsgHelper(error));
    } finally {
      progress.hide();
    }
  };

  return (
    <>
      <TilePager<StationDTO>
        getData={getStations}
        renderTile={(station, { size }) => (
          <StationTile
            station={station}
            size={size}
            onEdit={onEdit}
            onDelete={onDelete}
            onAction={onAction}
          />
        )}
        persistentTiles={persistentTiles}
      />

      <ActionModal
        isOpen={actionModalOpen}
        onClose={onActionClose}
        actions={[
          {
            key: "Edit",
            iconClass: "fas fa-pen",
            action: () => setStationModalOpen(true),
          },
          {
            key: "Delete",
            iconClass: "fas fa-trash",
            buttonClass: "is-danger",
            action: () => setConfirmModalOpen(true),
          },
        ]}
      >
        <span>
          <b class="has-text-primary">{pendingStation?.name}</b> actions
        </span>
      </ActionModal>

      <StationModal
        isOpen={stationModalOpen}
        station={pendingStation}
        onClose={onModalClose}
      />

      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={handleDeletion}
        confirmClass="is-danger"
      >
        <span>
          Are you sure you want to delete the station{" "}
          <b class="has-text-danger">{pendingStation?.name}</b>?`
        </span>
      </ConfirmationModal>
    </>
  );
}
