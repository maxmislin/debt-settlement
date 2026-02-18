import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { fetchAppData } from "@/query/appData";
import {
  getLocalStoragePassword,
  setLocalStoragePassword,
} from "@/utils/password";
import { useSearchParams } from "next/navigation";

export type Item = {
  name: string;
  id: string;
};

type AppContextType = {
  items: Item[];
  isLoading: boolean;
  loadPrivateData: () => void;
  setPassword: (password: string) => void;
  password: string;
  isAuthenticated: boolean;
  setItems: (items: Item[]) => void;
  currentItem: string | null;
  setCurrentItem: (itemId: string | null) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

let isFetching = false;

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const searchParams = useSearchParams();
  const itemFromParams = searchParams.get("itemId");
  const [currentItem, setCurrentItem] = useState<string | null>(itemFromParams);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState(() => {
    return getLocalStoragePassword() || "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadPrivateData = useCallback(async () => {
    if (isAuthenticated || isFetching) {
      return;
    }

    isFetching = true;

    setLocalStoragePassword(password);
    setIsLoading(true);
    try {
      const data = await fetchAppData(password);
      if (data) {
        setItems(data.items || []);

        if (!currentItem) {
          setCurrentItem(data.items[0].id);
        }
      }
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
      alert("Failed to load data or wrong password");
      setLocalStoragePassword(password);
    }
    setIsLoading(false);
  }, [isAuthenticated, password, currentItem]);

  useEffect(() => {
    if (getLocalStoragePassword()) {
      loadPrivateData();
    } else {
      setIsLoading(false);
    }
  }, [loadPrivateData]);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        loadPrivateData,
        password,
        setPassword,
        isAuthenticated,
        items,
        setItems,
        currentItem,
        setCurrentItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};
