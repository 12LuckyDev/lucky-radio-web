import { render } from "preact";
import "./index.css";
import "bulma/css/bulma.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { App } from "./app";
import { NotificationProvider } from "./contexts/notification/notification-context";
import { ProgressProvider } from "./contexts/progress/progress-context";
import { AppProvider } from "./features/internet-radio/contexts/app-context";

render(
  <NotificationProvider>
    <ProgressProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ProgressProvider>
  </NotificationProvider>,
  document.getElementById("app")!,
);
