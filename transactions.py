import time

def settle_debts(transactions):
    debtors = []
    creditors = []

    # Separate debtors and creditors
    for i, amount in enumerate(transactions):
        if amount < 0:
            debtors.append((i, -amount))  # Store (index, amount owed)
        elif amount > 0:
            creditors.append((i, amount))  # Store (index, amount to be received)

    def settle_recursive(debtors, creditors, current_transactions):
        if not debtors or not creditors:
            return current_transactions

        min_transactions = None

        for i, (debtor_idx, debtor_amount) in enumerate(debtors):
            for j, (creditor_idx, creditor_amount) in enumerate(creditors):
                transaction_amount = min(debtor_amount, creditor_amount)
                new_transactions = current_transactions + [(debtor_idx, creditor_idx, transaction_amount)]

                new_debtors = debtors[:i] + debtors[i+1:]
                new_creditors = creditors[:j] + creditors[j+1:]

                if debtor_amount > creditor_amount:
                    new_debtors.insert(i, (debtor_idx, debtor_amount - creditor_amount))
                elif debtor_amount < creditor_amount:
                    new_creditors.insert(j, (creditor_idx, creditor_amount - debtor_amount))

                result = settle_recursive(new_debtors, new_creditors, new_transactions)

                if min_transactions is None or len(result) < len(min_transactions):
                    min_transactions = result

        return min_transactions

    return settle_recursive(debtors, creditors, [])

start_time = time.time()
# Example usage:
amount6 = [26, 10, -2, -9, -10, -15]
amount4 = [-4, 226, 139, -361]
amount7 = [ 3, -5, -6, -6, 8, -10, 16]
amount8 = [-3, -1, -1, -6, -4, 0, 8, 7]
amount9 = [-8, 1, 8, -2, 4, -8, 4, -9, 10]
amount10 = [ 7, -8, -5,  7,  5,  3, -8,  1, -8,  6]
# amount15 = [ 18, -13, -14, -15,  -2, -12,  14,  -4, -12,  19, -20,  10,  -6,  -1,  38]

settled_debts = settle_debts(amount4)
print("--- %s seconds ---" % (time.time() - start_time))

# Output the transactions
for debtor_idx, creditor_idx, amount in settled_debts:
    print(f"Debtor at index {debtor_idx} pays Creditor at index {creditor_idx} an amount of {amount}")