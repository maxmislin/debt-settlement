import React, { useState } from "react";
import { useParticipantContext, Payment } from "../context";
import { minimizeCashFlow } from "@/utils/minimizeCashFlow";
import { minimizeTransactions } from "@/utils/minimizeTransactions";
import { updateAppData, fetchAppData } from "@/query/appData";

const DynamicDebts: React.FC = () => {
  const {
    participants,
    setParticipantTransactions,
    password,
    payments,
    setParticipants,
    setPayments,
    deletedParticipantIds,
    deletedPaymentIds,
    setDeletedPaymentIds,
  } = useParticipantContext();
  const [isLoading, setIsLoading] = useState(false);

  const addPayment = () => {
    setPayments([
      ...payments,
      {
        payer: "",
        amount: "",
        splitAmongAll: true,
        selectedParticipants: [],
        id: `payment-${Date.now()}`,
        description: "",
      },
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

  const createMatrix = async () => {
    setIsLoading(true);
    try {
      const refetchData = await fetchAppData(password);

      const filteredParticipants = refetchData.participants.filter(
        (participant) => !deletedParticipantIds.includes(participant.id)
      );
      const filteredPayments = refetchData.payments.filter((refetched) => {
        const payment = payments.find((p) => p.id === refetched.id);

        if (JSON.stringify(payment) !== JSON.stringify(refetched)) {
          console.log("Payment changed", payment, refetched);
        }

        return (
          !deletedPaymentIds.includes(refetched.id) &&
          JSON.stringify(payment) === JSON.stringify(refetched)
        );
      });

      const participantsDiff = participants.filter(
        (participant) =>
          !filteredParticipants.some(
            (refetchedParticipant) => refetchedParticipant.id === participant.id
          )
      );
      const paymentsDiff = payments.filter(
        (payment) =>
          !filteredPayments.some(
            (refetchedPayment) => refetchedPayment.id === payment.id
          )
      );

      const mergedParticipants = [...filteredParticipants, ...participantsDiff];
      const mergedPayments = [...filteredPayments, ...paymentsDiff];

      setParticipants(mergedParticipants);
      setPayments(mergedPayments);

      const matrix = Array(mergedParticipants.length)
        .fill(0)
        .map(() => Array(mergedParticipants.length).fill(0));

      mergedPayments.forEach((payment) => {
        const payerIndex = mergedParticipants.findIndex(
          (participant) => participant.id === payment.payer
        );
        const paymentAmount = parseFloat(payment.amount);

        if (isNaN(paymentAmount) || paymentAmount <= 0) {
          alert(`Invalid amount for payment from ${payment.payer}`);
          return;
        }

        const amountPerParticipant = payment.splitAmongAll
          ? paymentAmount / mergedParticipants.length
          : paymentAmount / payment.selectedParticipants.length;

        mergedParticipants.forEach((payee, payeeIndex) => {
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
          debtor: mergedParticipants[debtorIndex].name,
          creditor: mergedParticipants[creditorIndex].name,
          amount: amount.toFixed(2).toLocaleString(),
          id: `transaction-${debtorIndex}-${creditorIndex}-${Date.now()}`,
        };
      });

      setParticipantTransactions(mappedTransactions);

      await updateAppData(
        {
          participantTransactions: mappedTransactions,
          participants: mergedParticipants,
          payments: mergedPayments,
          deletedParticipantIds,
          deletedPaymentIds,
        },
        password
      );

      alert("Debts settled successfully");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error updating app data, message: ${error.message}`);
        return;
      }

      alert("Error updating app data");
    } finally {
      setIsLoading(false);
    }
  };

  const removePayment = (index: number) => {
    if (payments.length > 0) {
      setDeletedPaymentIds([...deletedPaymentIds, payments[index].id]);
      setPayments(payments.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="text-lg font-semibold">Payments</h2>
      {payments.map((payment, index) => (
        <div
          className="flex flex-col lg:flex-row lg:items-start gap-4 rounded-md p-3 w-full lg:w-auto bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
          key={index}
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="border border-neutral-300 rounded-md">
                <select
                  value={payment.payer}
                  onChange={(e) =>
                    handlePaymentChange(index, "payer", e.target.value)
                  }
                  className="p-2 rounded-md h-10 border-r-4 border-x-white w-full"
                >
                  <option value="">Select Participant</option>
                  {participants.map((participant) => (
                    <option key={participant.id} value={participant.id}>
                      {participant.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                value={payment.amount}
                onChange={(e) =>
                  handlePaymentChange(index, "amount", e.target.value)
                }
                placeholder="Amount in EUR"
                className="p-2 rounded-md h-10 border border-neutral-300"
              />
              <input
                type="text"
                value={payment.description}
                onChange={(e) =>
                  handlePaymentChange(index, "description", e.target.value)
                }
                placeholder="Description"
                className="p-2 rounded-md h-10 border border-neutral-300"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={payment.splitAmongAll}
                  onChange={(e) =>
                    handlePaymentChange(
                      index,
                      "splitAmongAll",
                      e.target.checked
                    )
                  }
                />
                Split among all participants
              </label>
            </div>
            {!payment.splitAmongAll && (
              <div className="flex flex-wrap gap-2">
                {participants.map((participant) => (
                  <label
                    key={participant.id}
                    className="flex items-center gap-2"
                  >
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
          </div>
          <button
            className="bg-black border-gray-600 border transition-colors hover:bg-gray-600 text-white rounded-md h-10 py-2 px-4 disabled:opacity-50 flex-1"
            onClick={() => removePayment(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="bg-black border-gray-600 border transition-colors hover:bg-gray-600 text-white rounded-md h-10 py-2 px-4 disabled:opacity-50 disabled:hover:bg-black w-full lg:w-auto"
        onClick={addPayment}
      >
        Add Payment
      </button>
      <button
        className="bg-white text-black transition-opacity hover:opacity-80 rounded-md h-10 py-2 px-4 disabled:opacity-50 w-full lg:w-auto border-black border"
        onClick={createMatrix}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              aria-hidden="true"
              role="status"
              className="inline mr-2 w-4 h-4 text-gray-300 animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              ></path>
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#000000"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          "Settle Debts"
        )}
      </button>
    </div>
  );
};

export default DynamicDebts;
