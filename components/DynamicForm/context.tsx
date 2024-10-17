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

export type Participant = {
  id: string;
  name: string;
};

type ParticipantsContextType = {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  participantTransactions: ParticipantTransaction[];
  setParticipantTransactions: (transactions: ParticipantTransaction[]) => void;
  setDebts: (debts: Debt[]) => void;
  debts: Debt[];
  isLoading: boolean;
  loadPrivateData: () => void;
  setPassword: (password: string) => void;
  password: string;
  isAuthenticated: boolean;
};

export type ParticipantTransaction = {
  debtor: string;
  creditor: string;
  amount: number;
};

export type Debt = {
  from: string;
  to: string;
  amount?: number;
};

const ParticipantsContext = createContext<ParticipantsContextType | undefined>(
  undefined
);

let isFetching = false;

export const ParticipantsProvider = ({ children }: { children: ReactNode }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantTransactions, setParticipantTransactions] = useState<
    ParticipantTransaction[]
  >([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState(() => {
    return getLocalStoragePassword() || "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const addParticipant = (participant: Participant) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.id !== id)
    );
  };

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
        setParticipants(data.participants);
        setDebts(data.debts);
        setParticipantTransactions(data.participantTransactions);
      }
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
      alert("Failed to load data or wrong password");
      setLocalStoragePassword(password);
    }
    setIsLoading(false);
  }, [isAuthenticated, password]);

  useEffect(() => {
    if (getLocalStoragePassword()) {
      loadPrivateData();
    } else {
      setIsLoading(false);
    }
  }, [loadPrivateData]);

  return (
    <ParticipantsContext.Provider
      value={{
        participants,
        addParticipant,
        removeParticipant,
        participantTransactions,
        setParticipantTransactions,
        debts,
        setDebts,
        isLoading,
        loadPrivateData,
        password,
        setPassword,
        isAuthenticated,
      }}
    >
      {children}
    </ParticipantsContext.Provider>
  );
};

export const useParticipantContext = (): ParticipantsContextType => {
  const context = useContext(ParticipantsContext);
  if (!context) {
    throw new Error(
      "useParticipants must be used within a ParticipantsProvider"
    );
  }
  return context;
};
