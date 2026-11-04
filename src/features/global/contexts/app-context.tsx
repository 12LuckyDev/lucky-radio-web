import { createContext } from "preact";
import type { ComponentChildren } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { api } from "../api/api";

type ModuleName = "i-radio" | "spotify";
type AppState = {
  isLoading: boolean;
  setModuleAsReady: (name: ModuleName) => void;
  activeTab: ModuleName;
  setActiveTab: (tab: string) => void;
};

const initialState: AppState = {
  isLoading: true,
  setModuleAsReady: () => {},
  activeTab: "i-radio",
  setActiveTab: () => {},
};

export const AppContext = createContext<AppState>(initialState);

export function AppProvider({ children }: { children: ComponentChildren }) {
  const [appReady, setAppReady] = useState<boolean>(false);
  const [internetRadioReady, setInternetRadioReady] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ModuleName>(
    initialState.activeTab,
  );

  const setModuleAsReady = (name: ModuleName) => {
    if (name === "i-radio") {
      setInternetRadioReady(true);
    }
  };

  useEffect(() => {
    const getCurrent = async () => {
      try {
        const { current } = await api.global.getCurrent();
        if (current === "i-radio" || current === "spotify") {
          setActiveTab(current);
          setAppReady(true);
        }
      } catch (error) {
        console.error("Failed to play previous station", error);
        setAppReady(true);
      }
    };
    void getCurrent();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoading: !internetRadioReady || !appReady,
        setModuleAsReady,
        activeTab,
        setActiveTab: (tab: string) => {
          if (tab === "i-radio" || tab === "spotify") {
            setActiveTab(tab);
          }
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  return context;
}
