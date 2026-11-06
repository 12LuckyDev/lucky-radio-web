import "./app.css";
import { Loader } from "./components/loader/loader";
import { useApp } from "./features/global/contexts/app-context";
import {
  InternetRadioProvider,
  InternetRadio,
} from "./features/internet-radio";
import { VolumeProvider } from "./features/volume";
import Tabs, { type TabItem } from "./components/tabs/tabs";
import { SpotifyPlayer, SpotifyProvider } from "./features/spotify";
import { useUi } from "./contexts/ui/ui-context";
import { PlayerSizesProvider } from "./features/global/contexts/player-sizes-context";

const tabs: TabItem[] = [
  {
    id: "i-radio",
    label: "i-radio",
    icon: "fa-radio",
    content: <InternetRadio />,
  },
  {
    id: "spotify",
    label: "spotify",
    icon: "fa-brands fa-spotify",
    content: <SpotifyPlayer />,
  },
];

export function App() {
  const { orientation } = useUi();
  const { isLoading, activeTab, setActiveTab } = useApp();

  return (
    <PlayerSizesProvider>
      <VolumeProvider>
        <InternetRadioProvider>
          <SpotifyProvider>
            <main class="main-container">
              {isLoading ? (
                <div class="loader-wrapper">
                  <Loader />
                </div>
              ) : (
                <Tabs
                  tabs={tabs}
                  orientation={orientation}
                  activeTab={activeTab}
                  onChange={(id) => {
                    console.log("selected tab:", id);
                    setActiveTab(id);
                  }}
                />
              )}
            </main>
          </SpotifyProvider>
        </InternetRadioProvider>
      </VolumeProvider>
    </PlayerSizesProvider>
  );
}
