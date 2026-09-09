import { Stations } from "./stations/stations";
import { Player } from "./player/player";
import { AccordionGroup } from "../../components/accordion-group/accordion-group";
import { useRadio } from "./contexts/radio-context";
import { StationHeader } from "./stations/station-header";
import { PlayerHeader } from "./player/player-header";

export function InternetRadio() {
  const { activeTab, setActiveTab } = useRadio();

  return (
    <AccordionGroup
      items={[
        {
          title: "Stations",
          header: (headerProps) =>
            headerProps.isOpen ? null : (
              <StationHeader headerProps={headerProps} />
            ),
          key: "stations",
          content: <Stations />,
        },
        {
          title: "Radio",
          header: (headerProps) =>
            headerProps.isOpen ? null : (
              <PlayerHeader headerProps={headerProps} />
            ),
          key: "player",
          content: <Player />,
        },
      ]}
      active={activeTab}
      setActive={(tab) => setActiveTab(tab as "player" | "stations")}
    />
  );
}
