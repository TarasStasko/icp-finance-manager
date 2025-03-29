export const idlFactory = ({ IDL }) => {
  const Transaction = IDL.Record({
    'id' : IDL.Nat,
    'isExpense' : IDL.Bool,
    'userId' : IDL.Text,
    'date' : IDL.Text,
    'category' : IDL.Text,
    'amount' : IDL.Float64,
  });
  return IDL.Service({
    'addTransaction' : IDL.Func(
        [IDL.Float64, IDL.Text, IDL.Bool],
        [IDL.Text],
        [],
      ),
    'deleteTransaction' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getBalance' : IDL.Func([], [IDL.Float64], ['query']),
    'getTotalExpenses' : IDL.Func([], [IDL.Float64], ['query']),
    'getTotalIncome' : IDL.Func([], [IDL.Float64], ['query']),
    'getTransactions' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
    'resetTotalExpenses' : IDL.Func([], [], []),
    'resetTotalIncome' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
