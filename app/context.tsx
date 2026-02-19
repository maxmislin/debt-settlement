import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { fetchAppData, updateAppData } from "@/query/appData";
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
  timerTarget: number | null;
  isUpdatePending: boolean;
  updateApp: (data: { items: Item[] }) => Promise<void>;
  showSaveConfirmation: boolean;
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
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const [timerTarget, setTimerTarget] = useState<number | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const isUpdatePendingRef = React.useRef(isUpdatePending);
  const itemsRef = React.useRef(items);

  useEffect(() => {
    isUpdatePendingRef.current = isUpdatePending;
  }, [isUpdatePending]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const updateApp = useCallback(
    async (data: { items: Item[] }) => {
      await updateAppData(
        {
          ...data,
          updatedAt: new Date().toISOString(),
        },
        password,
      );

      if (!timerTarget) {
        const target = Date.now() + 30000;
        setTimerTarget(target);
        setTimeout(async () => {
          // Use refs to get latest values
          if (isUpdatePendingRef.current) {
            try {
              await updateApp({ items: itemsRef.current });

              setShowSaveConfirmation(true);
              setTimeout(() => setShowSaveConfirmation(false), 3000); // Hide after 3s
            } catch {
              alert("Failed to update app");
            }
            setIsUpdatePending(false);
            setTimerTarget(Date.now() + 30000);
          } else {
            setTimerTarget(null);
          }
        }, 30000);
      } else {
        setIsUpdatePending(true);
      }
    },
    [password, timerTarget],
  );

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
        updateApp,
        timerTarget,
        isUpdatePending,
        showSaveConfirmation,
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
