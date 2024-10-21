import React from "react";
import { useParticipantContext, Payment } from "../context";
import { minimizeCashFlow } from "@/utils/minimizeCashFlow";
import { minimizeTransactions } from "@/utils/minimizeTransactions";
import { updateAppData } from "@/query/appData";

const DynamicDebts: React.FC = () => {
  const {
    participants,
    setParticipantTransactions,
    password,
    payments,
    setPayments,
  } = useParticipantContext();

  const addPayment = () => {
    setPayments([
      ...payments,
      { payer: "", amount: "", splitAmongAll: true, selectedParticipants: [] },
    ]);
  };

  const handlePaymentChange = (
    index: number,
    field: keyof Payment,
    value: string | boolean | number
  ) => {
    const newPayments = payments.slice();
    newPayments[index] = { ...newPayments[index], [field]: value };
    setPayments(newPayments);
  };

  const handleParticipantSelection = (
    paymentIndex: number,
    participantId: string
  ) => {
    const newPayments = payments.slice();
    const selectedParticipants = newPayments[paymentIndex].selectedParticipants;
    if (selectedParticipants.includes(participantId)) {
      newPayments[paymentIndex].selectedParticipants =
        selectedParticipants.filter((id) => id !== participantId);
    } else {
      newPayments[paymentIndex].selectedParticipants.push(participantId);
    }
    setPayments(newPayments);
  };

  const createMatrix = () => {
    const matrix = Array(participants.length)
      .fill(0)
      .map(() => Array(participants.length).fill(0));

    payments.forEach((payment) => {
      const payerIndex = participants.findIndex(
        (participant) => participant.id === payment.payer
      );
      const paymentAmount = parseFloat(payment.amount);

      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        alert(`Invalid amount for payment from ${payment.payer}`);
        return;
      }

      const amountPerParticipant = payment.splitAmongAll
        ? paymentAmount / participants.length
        : paymentAmount / payment.selectedParticipants.length;

      participants.forEach((payee, payeeIndex) => {
        if (payerIndex !== payeeIndex) {
          if (
            payment.splitAmongAll ||
            payment.selectedParticipants.includes(payee.id)
          ) {
            matrix[payeeIndex][payerIndex] += amountPerParticipant;
          }
        }
      });
    });

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
    try {
      updateAppData(
        {
          participantTransactions: mappedTransactions,
          participants,
          payments,
        },
        password
      );
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error updating app data, message: ${error.message}`);
        return;
      }

      alert("Error updating app data");
    }
  };

  const removePayment = (index: number) => {
    if (payments.length > 0) {
      setPayments(payments.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-lg font-semibold">Payments</h2>
      {payments.map((payment, index) => (
        <div
          className="flex flex-col lg:flex-row lg:items-center gap-4 rounded-md p-3 w-full lg:w-auto"
          style={{
            border: "1px solid hsla(0,0%,18%,1)",
            background: "#0a0a0a",
          }}
          key={index}
        >
          <div className="flex flex-col lg:flex-row gap-2">
            <select
              value={payment.payer}
              onChange={(e) =>
                handlePaymentChange(index, "payer", e.target.value)
              }
              className="p-2 rounded-md h-10 border-r-4 border-x-white"
            >
              <option value="">Select Participant</option>
              {participants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {participant.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={payment.amount}
              onChange={(e) =>
                handlePaymentChange(index, "amount", e.target.value)
              }
              placeholder="Amount in EUR"
              className="p-2 rounded-md h-10"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={payment.splitAmongAll}
                onChange={(e) =>
                  handlePaymentChange(index, "splitAmongAll", e.target.checked)
                }
              />
              Split among all participants
            </label>
          </div>
          {!payment.splitAmongAll && (
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => (
                <label key={participant.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={payment.selectedParticipants.includes(
                      participant.id
                    )}
                    onChange={() =>
                      handleParticipantSelection(index, participant.id)
                    }
                  />
                  {participant.name}
                </label>
              ))}
            </div>
          )}
          <button
            className="bg-black border-gray-600 border-2 transition-colors hover:bg-gray-600 text-white rounded-md h-10 py-2 px-4 disabled:opacity-50 flex-1"
            onClick={() => removePayment(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="bg-black border-gray-600 border-2 transition-colors hover:bg-gray-600 text-white rounded-md h-10 py-2 px-4 disabled:opacity-50 disabled:hover:bg-black w-full lg:w-auto"
        onClick={addPayment}
      >
        Add Payment
      </button>
      <button
        className="bg-white text-black transition-opacity hover:opacity-80 rounded-md h-10 py-2 px-4 disabled:opacity-50 w-full lg:w-auto"
        onClick={createMatrix}
      >
        Settle Debts
      </button>
    </div>
  );
};

export default DynamicDebts;
