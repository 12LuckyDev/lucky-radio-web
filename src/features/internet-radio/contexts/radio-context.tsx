import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext, useState } from "preact/hooks";
import { useApp } from "./app-context";

type RadioState = {
  activeTab: "player" | "stations";
  setActiveTab: (tab: "player" | "stations") => void;
  setAsReady: () => void;
};

const initialState: RadioState = {
  activeTab: "player",
  setActiveTab: () => {},
  setAsReady: () => {},
};

export const RadioContext = createContext<RadioState>(initialState);

export function RadioProvider({ children }: { children: ComponentChildren }) {
  const [activeTab, setActiveTab] = useState<"player" | "stations">("player");
  const { setModuleAsReady } = useApp();

  const setAsReady = () => setModuleAsReady("i-radio");

  return (
    <RadioContext.Provider value={{ activeTab, setActiveTab, setAsReady }}>
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio(): RadioState {
  const context = useContext(RadioContext);
  return context;
}
