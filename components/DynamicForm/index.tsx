import React from "react";
import { ParticipantsProvider, useParticipantContext } from "./context";
import ParticipantsForm from "./ParticipantsFrom";
import DynamicDebts from "./DynamicDebts";
import ParticipantTransactions from "./ParticipantTransactions";
import Loader from "../Loader";
import { useAppContext } from "@/app/context";
import NoItemSelected from "../NoItemSelected";
import ActionButtons from "./ActionButtons";

const DynamicForm = () => {
  const { participants, participantTransactions, isLoading } =
    useParticipantContext();
  const { currentItem, items } = useAppContext();

  if (isLoading) {
    return <Loader />;
  }

  if (!currentItem) {
    return <NoItemSelected />;
  }

  const currentItemObj = items.find((item) => item.id === currentItem);

  return (
    <div className="flex flex-col flex-1 w-full pb-24 lg:pb-0">
      <div className="flex justify-between lg:max-w-[900px]">
        <div>
          {/* Show item name */}
          {currentItemObj && (
            <div className="hidden lg:block text-2xl font-semibold mb-4 mt-4 text-center lg:text-left">
              {currentItemObj.name}
            </div>
          )}
          <ParticipantsForm />
        </div>
        <ActionButtons currentItem={currentItem} />
      </div>
      {participants?.length > 0 && <DynamicDebts currentItem={currentItem} />}
      {participantTransactions?.length > 0 && <ParticipantTransactions />}
    </div>
  );
};

const WrappedDynamicForm: React.FC = () => (
  <ParticipantsProvider>
    <DynamicForm />
  </ParticipantsProvider>
);

export default WrappedDynamicForm;
