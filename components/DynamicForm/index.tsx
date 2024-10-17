import React from "react";
import { ParticipantsProvider, useParticipantContext } from "./context";
import ParticipantsForm from "./ParticipantsFrom";
import DynamicDebts from "./DynamicDebts";
import ParticipantTransactions from "./ParticipantTransactions";
import Loader from "../Loader";
import Auth from "./Auth";

const DynamicForm = () => {
  const { participants, participantTransactions, isLoading } =
    useParticipantContext();

  if (!localStorage.getItem("password")) {
    return <Auth />;
  }

  if (isLoading) {
    return <Loader />;
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
