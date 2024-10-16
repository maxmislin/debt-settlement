import React, { createContext, useContext, useState, ReactNode } from "react";

type Participant = {
  id: string;
  name: string;
};

type ParticipantsContextType = {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  participantTransactions: ParticipantTransaction[];
  setParticipantTransactions: (transactions: ParticipantTransaction[]) => void;
};

export type ParticipantTransaction = {
  debtor: string;
  creditor: string;
  amount: number;
};

const ParticipantsContext = createContext<ParticipantsContextType | undefined>(
  undefined
);

export const ParticipantsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantTransactions, setParticipantTransactions] = useState<
    ParticipantTransaction[]
  >([]);

  const addParticipant = (participant: Participant) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p.id !== id)
    );
  };

  return (
    <ParticipantsContext.Provider
      value={{
        participants,
        addParticipant,
        removeParticipant,
        participantTransactions,
        setParticipantTransactions,
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
