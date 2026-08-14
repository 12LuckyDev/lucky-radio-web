import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext, useState } from "preact/hooks";

type RadioState = {
  activeTab: "player" | "stations";
  setActiveTab: (tab: "player" | "stations") => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const initialState: RadioState = {
  activeTab: "player",
  setActiveTab: () => {},
  isLoading: true,
  setIsLoading: () => {},
};

export const RadioContext = createContext<RadioState>(initialState);

export function RadioProvider({ children }: { children: ComponentChildren }) {
  const [activeTab, setActiveTab] = useState<"player" | "stations">("player");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <RadioContext.Provider
      value={{ activeTab, setActiveTab, isLoading, setIsLoading }}
    >
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio(): RadioState {
  const context = useContext(RadioContext);
  return context;
}
