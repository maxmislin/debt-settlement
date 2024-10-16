export const minimizeCashFlow = (graph: number[][]): number[] => {
  const n = graph.length;

  // Create an array amount[], initialize all values in it as 0.
  const amount = Array(n).fill(0);

  // Calculate the net amount to be paid to person 'p', and store it in amount[p].
  // The value of amount[p] can be calculated by subtracting credits of 'p' from debts of 'p'
  for (let p = 0; p < n; p++) {
    for (let i = 0; i < n; i++) {
      amount[p] += graph[p][i] - graph[i][p];
    }
  }

  return amount;
};
