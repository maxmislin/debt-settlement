import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { filterOldPaymentsOrParticipants } from "@/utils/filterOldPayments";
import { fetchItemData } from "@/query/appData";
import { useAppContext } from "@/app/context";

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
  setPayments: (debts: Payment[]) => void;
  payments: Payment[];
  setParticipants: (participants: Participant[]) => void;
  deletedParticipantIds: string[];
  setDeletedParticipantIds: (ids: string[]) => void;
  deletedPaymentIds: string[];
  setDeletedPaymentIds: (ids: string[]) => void;
  isLoading: boolean;
  loadItemData: () => Promise<void>;
};

export type ParticipantTransaction = {
  debtor: string;
  creditor: string;
  amount: string;
  id: string;
};

export type Payment = {
  payer: string;
  amount: string;
  splitAmongAll: boolean;
  selectedParticipants: string[];
  id: string;
  description: string;
};

const ParticipantsContext = createContext<ParticipantsContextType | undefined>(
  undefined,
);

export const ParticipantsProvider = ({ children }: { children: ReactNode }) => {
  const { currentItem } = useAppContext();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantTransactions, setParticipantTransactions] = useState<
    ParticipantTransaction[]
  >([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [deletedParticipantIds, setDeletedParticipantIds] = useState<string[]>(
    [],
  );
  const [deletedPaymentIds, setDeletedPaymentIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addParticipant = (participant: Participant) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  const removeParticipant = (id: string) => {
    setDeletedParticipantIds((prevDeletedIds) => {
      const filteredPrevDeletedIds =
        filterOldPaymentsOrParticipants(prevDeletedIds);
      return [...filteredPrevDeletedIds, id];
    });
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.id !== id),
    );
  };

  const loadItemData = useCallback(async () => {
    if (!currentItem) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchItemData(currentItem);

      if (data) {
        setParticipants(data.participants);
        setPayments(data.payments);
        setParticipantTransactions(data.participantTransactions);
        setDeletedParticipantIds(data.deletedParticipantIds || []);
        setDeletedPaymentIds(data.deletedPaymentIds || []);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load item data");
    }
    setIsLoading(false);
  }, [currentItem]);

  useEffect(() => {
    loadItemData();
  }, [currentItem, loadItemData]);

  return (
    <ParticipantsContext.Provider
      value={{
        participants,
        addParticipant,
        removeParticipant,
        participantTransactions,
        setParticipantTransactions,
        payments,
        setPayments,
        setParticipants,
        deletedParticipantIds,
        setDeletedParticipantIds,
        deletedPaymentIds,
        setDeletedPaymentIds,
        isLoading,
        loadItemData,
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
      "useParticipants must be used within a ParticipantsProvider",
    );
  }
  return context;
};
