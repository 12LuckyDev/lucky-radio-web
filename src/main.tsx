import { render } from "preact";
import "./index.css";
import "bulma/css/bulma.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { App } from "./app";
import { StationsProvider } from "./contexts/stations/stations-context";
import { PlayerProvider } from "./contexts/player-context";
import { RadioProvider } from "./contexts/radio-context";
import { NotificationProvider } from "./contexts/notification/notification-context";
import { ProgressProvider } from "./contexts/progress/progress-context";

render(
  <NotificationProvider>
    <ProgressProvider>
      <RadioProvider>
        <StationsProvider>
          <PlayerProvider>
            <App />
          </PlayerProvider>
        </StationsProvider>
      </RadioProvider>
    </ProgressProvider>
  </NotificationProvider>,
  document.getElementById("app")!,
);
