import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { fetchAppData } from "@/query/appData";

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

export const ParticipantsProvider = ({ children }: { children: ReactNode }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantTransactions, setParticipantTransactions] = useState<
    ParticipantTransaction[]
  >([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState(() => {
    return localStorage.getItem("password") || "";
  });
  const [isInitialDataLoaded, setDataLoaded] = useState(false);

  const addParticipant = (participant: Participant) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.id !== id)
    );
  };

  const loadPrivateData = useCallback(async () => {
    if (isInitialDataLoaded) {
      return;
    }

    localStorage.setItem("password", password);
    setIsLoading(true);
    try {
      const data = await fetchAppData(password);
      if (data) {
        setParticipants(data.participants);
        setDebts(data.debts);
        setParticipantTransactions(data.participantTransactions);
      }
      setDataLoaded(true);
    } catch (e) {
      console.error(e);
      alert("Failed to load data or wrong password");
      localStorage.setItem("password", "");
    }
    setIsLoading(false);
  }, [isInitialDataLoaded, password]);

  useEffect(() => {
    if (localStorage.getItem("password")) {
      loadPrivateData();
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
