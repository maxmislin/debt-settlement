import React from "react";
import { ParticipantsProvider, useParticipantContext } from "./context";
import ParticipantsForm from "./ParticipantsFrom";
import DynamicDebts from "./DynamicDebts";
import ParticipantTransactions from "./ParticipantTransactions";
import Loader from "../Loader";
import Auth from "./Auth";

const DynamicForm = () => {
  const { participants, participantTransactions, isLoading, isAuthenticated } =
    useParticipantContext();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

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
