import "./app.css";
import { Loader } from "./components/loader/loader";
import { useApp } from "./features/internet-radio/contexts/app-context";
import {
  InternetRadioProvider,
  InternetRadio,
} from "./features/internet-radio";

export function App() {
  const { isLoading } = useApp();

  return (
    <InternetRadioProvider>
      <main class="main-container">
        {isLoading ? (
          <div class="loader-wrapper">
            <Loader />
          </div>
        ) : (
          <InternetRadio />
        )}
      </main>
    </InternetRadioProvider>
  );
}
