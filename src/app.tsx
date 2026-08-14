import "./app.css";
import { Loader } from "./components/loader/loader";
import { useRadio } from "./contexts/radio-context";
import { Radio } from "./features/radio/radio";

export function App() {
  const { isLoading } = useRadio();

  return (
    <main class="main-container">
      {isLoading ? (
        <div class="loader-wrapper">
          <Loader />
        </div>
      ) : (
        <Radio />
      )}
    </main>
  );
}
