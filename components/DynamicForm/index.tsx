import React from "react";
import { ParticipantsProvider, useParticipantContext } from "./context";
import ParticipantsForm from "./ParticipantsFrom";
import DynamicDebts from "./DynamicDebts";
import ParticipantTransactions from "./ParticipantTransactions";

const DynamicForm: React.FC = () => {
  const { participants, participantTransactions } = useParticipantContext();

  return (
    <div className="flex flex-col flex-1 w-full">
      <ParticipantsForm />
      {participants.length > 0 && <DynamicDebts />}
      {participantTransactions.length > 0 && <ParticipantTransactions />}
    </div>
  );
};

const WrappedDynamicForm: React.FC = () => (
  <ParticipantsProvider>
    <DynamicForm />
  </ParticipantsProvider>
);

export default WrappedDynamicForm;
