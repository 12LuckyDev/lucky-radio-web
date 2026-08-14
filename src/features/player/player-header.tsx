import { CustomAccordionHeaderWrapper } from "../../components/accordion-group/custom-accordion-header-wrapper";
import type { AccordionHeaderProps } from "../../components/accordion-group/models/accordion-header-props";
import { useStations } from "../../contexts/stations/stations-context";
import { PlayerButton } from "./player-button";
import { Volume } from "./volume/volume";

export function PlayerHeader({
  headerProps,
}: {
  headerProps: AccordionHeaderProps;
}) {
  const { currentName } = useStations();
  return (
    <CustomAccordionHeaderWrapper
      headerProps={headerProps}
      endSlotChildren={<Volume />}
    >
      <PlayerButton />
      <div class="shrinkable-text">{currentName} </div>
    </CustomAccordionHeaderWrapper>
  );
}
