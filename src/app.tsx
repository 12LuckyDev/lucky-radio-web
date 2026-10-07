import "./app.css";
import { Loader } from "./components/loader/loader";
import { useApp } from "./features/internet-radio/contexts/app-context";
import {
  InternetRadioProvider,
  InternetRadio,
} from "./features/internet-radio";
import { VolumeProvider } from "./features/volume";

export function App() {
  const { isLoading } = useApp();

  return (
    <VolumeProvider>
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
    </VolumeProvider>
  );
}
