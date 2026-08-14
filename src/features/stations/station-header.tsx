import { useStations } from "../../contexts/stations/stations-context";
import { CustomAccordionHeaderWrapper } from "../../components/accordion-group/custom-accordion-header-wrapper";
import type { AccordionHeaderProps } from "../../components/accordion-group/models/accordion-header-props";

export function StationHeader({
  headerProps,
}: {
  headerProps: AccordionHeaderProps;
}) {
  const { currentName, canPlayNext, canPlayPrev, playNext, playPrev } =
    useStations();

  return (
    <CustomAccordionHeaderWrapper headerProps={headerProps}>
      <div>
        <button class="button" disabled={!canPlayPrev} onClick={playPrev}>
          <span class="icon">
            <i class="fas fa-backward"></i>
          </span>
        </button>
        <button class="button" disabled={!canPlayNext} onClick={playNext}>
          <span class="icon">
            <i class="fa-solid fa-forward"></i>{" "}
          </span>
        </button>
      </div>

      <span class="shrinkable-text">{currentName}</span>
    </CustomAccordionHeaderWrapper>
  );
}
