import React, { useState } from "react";
import { useParticipantContext } from "../context";
import { minimizeCashFlow } from "@/utils/minimizeCashFlow";
import { minimizeTransactions } from "@/utils/minimizeTransactions";

type Debt = {
  from: string;
  to: string;
  amount: number;
};

const DynamicDebts: React.FC = () => {
  const { participants, setParticipantTransactions } = useParticipantContext();
  const [debts, setDebts] = useState<Debt[]>([]);

  const maxDebts = participants.length * (participants.length - 1);

  const addDebt = () => {
    if (debts.length < maxDebts) {
      setDebts([...debts, { from: "", to: "", amount: 0 }]);
    }
  };

  const handleDebtChange = (
    index: number,
    field: keyof Debt,
    value: string
  ) => {
    const newDebts = debts.slice();
    newDebts[index] = { ...newDebts[index], [field]: value };
    setDebts(newDebts);
  };

  const createMatrix = () => {
    const matrix = Array(participants.length)
      .fill(0)
      .map(() => Array(participants.length).fill(0));

    for (const debt of debts) {
      const fromIndex = participants.findIndex((p) => p.id === debt.from);
      const toIndex = participants.findIndex((p) => p.id === debt.to);
      const amount = parseFloat(debt.amount.toString());

      if (isNaN(amount) || amount <= 0) {
        alert(`Invalid amount for debt from ${debt.from} to ${debt.to}`);
        return;
      }

      if (fromIndex !== -1 && toIndex !== -1) {
        matrix[fromIndex][toIndex] = amount;
      }
    }

    const minCashFlow = minimizeCashFlow(matrix);
    const minimizedTransactions = minimizeTransactions(minCashFlow) || [];

    // Map indexes back to participants
    const mappedTransactions = minimizedTransactions.map((transaction) => {
      const { debtorIndex, creditorIndex, amount } = transaction;
      return {
        debtor: participants[debtorIndex].name,
        creditor: participants[creditorIndex].name,
        amount,
      };
    });

    setParticipantTransactions(mappedTransactions);
  };

  const removeDebt = () => {
    if (debts.length > 0) {
      setDebts(debts.slice(0, debts.length - 1));
    }
  };

  const isAvailableFromParticipant = (id: string) => {
    const maxUsage = Math.max(1, participants.length - 1);
    const availableFromParticipants = participants.filter((participant) => {
      const usageCount = debts.filter(
        (debt) => debt.from === participant.id
      ).length;
      return usageCount < maxUsage;
    });

    return (
      availableFromParticipants.findIndex(
        (participant) => participant.id === id
      ) === -1
    );
  };

  const isAvailableToParticipant = (idFrom: string, id: string) => {
    const usedParticipants = debts.reduce((acc: string[], debt) => {
      if (debt.from === idFrom && debt.to) {
        acc.push(debt.to);
      }
      return acc;
    }, []);

    return usedParticipants.includes(id);
  };

  return (
    <div className="flex flex-col items-start  gap-4">
      <h2 className="text-lg font-semibold">Debts</h2>
      {debts.map((debt, index) => (
        <div
          className="flex flex-col lg:flex-row lg:items-center gap-4 border-2 p-2 w-full lg:w-auto"
          key={index}
        >
          <div className="flex flex-col lg:flex-row gap-2">
            <select
              value={debt.from}
              onChange={(e) => handleDebtChange(index, "from", e.target.value)}
              className="p-2 rounded"
            >
              <option value="">Select Participant</option>
              {participants.map(
                (participant) =>
                  debt.to !== participant.id && (
                    <option
                      key={participant.id}
                      value={participant.id}
                      disabled={isAvailableFromParticipant(participant.id)}
                    >
                      {participant.name}
                    </option>
                  )
              )}
            </select>
            <span className="flex items-center">owes</span>
            <select
              value={debt.to}
              onChange={(e) => handleDebtChange(index, "to", e.target.value)}
              className="p-2 rounded"
              disabled={!debt.from}
            >
              <option value="">Select Participant</option>
              {participants.map(
                (participant) =>
                  debt.from !== participant.id && (
                    <option
                      key={participant.id}
                      value={participant.id}
                      disabled={isAvailableToParticipant(
                        debt.from,
                        participant.id
                      )}
                    >
                      {participant.name}
                    </option>
                  )
              )}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              value={debt.amount}
              onChange={(e) =>
                handleDebtChange(index, "amount", e.target.value)
              }
              placeholder="Amount in EUR"
              className="p-2 rounded"
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50 flex-1"
              onClick={removeDebt}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50 w-full lg:w-auto"
        onClick={addDebt}
        disabled={debts.length >= maxDebts}
      >
        Add Debt
      </button>
      <button
        className="bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50 w-full lg:w-auto"
        onClick={createMatrix}
      >
        Settle Debts
      </button>
    </div>
  );
};

export default DynamicDebts;
