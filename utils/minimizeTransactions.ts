type DebtorOrCreditor = {
  index: number;
  amount: number;
};

type Transaction = {
  debtorIndex: number;
  creditorIndex: number;
  amount: number;
}

const getMin = (arr: number[]): number => {
  let minInd = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[minInd]) {
      minInd = i;
    }
  }
  return minInd;
};

const getMax = (arr: number[]): number => {
  let maxInd = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[maxInd]) {
      maxInd = i;
    }
  }
  return maxInd;
};

const minOf2 = (x: number, y: number): number => {
  return x < y ? x : y;
};

const roundToTwoDecimals = (num: number): number => {
  return Math.round(num * 100) / 100;
};

const settleGreedy = (
  debtors: DebtorOrCreditor[],
  creditors: DebtorOrCreditor[],
  currentTransactions: Transaction[]
): Transaction[] => {
  const amount = Array(debtors.length + creditors.length).fill(0);

  debtors.forEach((debtor) => {
    amount[debtor.index] = -debtor.amount;
  });

  creditors.forEach((creditor) => {
    amount[creditor.index] = creditor.amount;
  });

  const minCashFlowRec = (amount: number[]): void => {
    const mxCredit = getMax(amount);
    const mxDebit = getMin(amount);

    // If both amounts are effectively zero, then all amounts are settled
    if (roundToTwoDecimals(amount[mxCredit]) === 0 && roundToTwoDecimals(amount[mxDebit]) === 0) {
      return;
    }

    const min = minOf2(-amount[mxDebit], amount[mxCredit]);
    amount[mxCredit] -= min;
    amount[mxDebit] += min;

    currentTransactions.push({
      debtorIndex: mxDebit,
      creditorIndex: mxCredit,
      amount: roundToTwoDecimals(min),
    });

    minCashFlowRec(amount);
  };

  minCashFlowRec(amount);
  return currentTransactions;
};

const settleRecursive = (debtors: DebtorOrCreditor[], creditors: DebtorOrCreditor[], currentTransactions: Transaction[]) => {
  if (!debtors.length || !creditors.length) {
    return currentTransactions;
  }

  let minTransactions: Transaction[] | null = null;

  debtors.forEach((debtor, i) => {
    creditors.forEach((creditor, j) => {
      const transactionAmount = Math.min(debtor.amount, creditor.amount);
      const newTransactions = [
        ...currentTransactions,
        {
          debtorIndex: debtor.index,
          creditorIndex: creditor.index,
          amount: transactionAmount,
        },
      ];

      const newDebtors = [...debtors.slice(0, i), ...debtors.slice(i + 1)];
      const newCreditors = [
        ...creditors.slice(0, j),
        ...creditors.slice(j + 1),
      ];

      if (debtor.amount > creditor.amount) {
        newDebtors.splice(i, 0, {
          index: debtor.index,
          amount: debtor.amount - creditor.amount,
        });
      } else if (debtor.amount < creditor.amount) {
        newCreditors.splice(j, 0, {
          index: creditor.index,
          amount: creditor.amount - debtor.amount,
        });
      }

      const result = settleRecursive(
        newDebtors,
        newCreditors,
        newTransactions
      );

      if (!minTransactions || (result && result.length < minTransactions.length)) {
        minTransactions = result;
      }
    });
  });

  return minTransactions;
}

export const minimizeTransactions = (transactions: number[]) => {
  const debtors: DebtorOrCreditor[] = [];
  const creditors: DebtorOrCreditor[] = [];

  // Separate debtors and creditors
  transactions.forEach((amount, i) => {
    if (amount < 0) {
      debtors.push({ index: i, amount: -amount }); // Store {index, amount owed}
    } else if (amount > 0) {
      creditors.push({ index: i, amount }); // Store {index, amount to be received}
    }
  });

  return transactions.length < 10
    ? settleRecursive(debtors, creditors, [])
    : settleGreedy(debtors, creditors, []);
};
