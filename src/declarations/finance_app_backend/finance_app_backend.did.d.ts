import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Transaction {
  'id' : bigint,
  'isExpense' : boolean,
  'userId' : string,
  'date' : string,
  'category' : string,
  'amount' : number,
}
export interface _SERVICE {
  'addTransaction' : ActorMethod<[number, string, boolean], string>,
  'deleteTransaction' : ActorMethod<[bigint], boolean>,
  'getBalance' : ActorMethod<[], number>,
  'getTotalExpenses' : ActorMethod<[], number>,
  'getTotalIncome' : ActorMethod<[], number>,
  'getTransactions' : ActorMethod<[], Array<Transaction>>,
  'resetTotalExpenses' : ActorMethod<[], undefined>,
  'resetTotalIncome' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
