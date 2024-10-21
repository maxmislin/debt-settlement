import React from "react";
import { useParticipantContext } from "../context";

const ParticipantTransactions: React.FC = () => {
  const { participantTransactions } = useParticipantContext();
  return (
    <div className="mt-6">
      <h2 className="text-lg mb-2 font-semibold">Participant Transactions</h2>
      <ul>
        {participantTransactions.map((transaction, index) => (
          <li key={index}>
            {transaction.creditor} should send {transaction.amount} to{" "}
            {transaction.debtor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantTransactions;
