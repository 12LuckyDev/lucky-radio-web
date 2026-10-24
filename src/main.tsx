import { render } from "preact";
import "./index.css";
import "bulma/css/bulma.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fortawesome/fontawesome-free/css/brands.min.css";

import { App } from "./app";
import { NotificationProvider } from "./contexts/notification/notification-context";
import { ProgressProvider } from "./contexts/progress/progress-context";
import { AppProvider } from "./features/global/contexts/app-context";
import { UiProvider } from "./contexts/ui/ui-context";

render(
  <UiProvider>
    <NotificationProvider>
      <ProgressProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ProgressProvider>
    </NotificationProvider>
  </UiProvider>,
  document.getElementById("app")!,
);
