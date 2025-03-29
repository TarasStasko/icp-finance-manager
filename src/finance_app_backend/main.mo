import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Time "mo:base/Time";

actor FinanceManager {
  type Transaction = {
    id: Nat;
    userId: Text;
    amount: Float;  // Завжди додатнє значення
    category: Text;
    date: Text;
    isExpense: Bool;
  };

  type UserAccount = {
    userId: Text;
    balance: Float;
    totalIncome: Float;
    totalExpenses: Float;
  };

  var transactions: [Transaction] = [];
  var users: [UserAccount] = [];
  var nextId: Nat = 1;

  // Отримати або створити обліковий запис користувача
  func getUserAccount(userId: Text) : UserAccount {
    let user = Array.find(users, func (u: UserAccount) : Bool { u.userId == userId });
    switch (user) {
      case (?u) u;
      case null {
        let newUser = {
          userId = userId;
          balance = 0.0;
          totalIncome = 0.0;
          totalExpenses = 0.0;
        };
        users := Array.append(users, [newUser]);
        newUser
      };
    }
  };

  // Оновити обліковий запис користувача
  func updateUserAccount(userId: Text, amount: Float, isExpense: Bool) {
    let user = getUserAccount(userId);
    
    users := Array.map(users, func (u: UserAccount) : UserAccount {
      if (u.userId == userId) {
        let newBalance = Float.max(0.0, u.balance + amount);
        let newIncome = if (not isExpense) { u.totalIncome + Float.abs(amount) } else { u.totalIncome };
        let newExpenses = if (isExpense) { u.totalExpenses + Float.abs(amount) } else { u.totalExpenses };
        
        return {
          userId = u.userId;
          balance = newBalance;
          totalIncome = newIncome;
          totalExpenses = newExpenses;
        };
      } else {
        return u;
      }
    });
  };

  // Додати транзакцію
  public shared(msg) func addTransaction(
    amount: Float,
    category: Text,
    isExpense: Bool
  ) : async Text {
    if (amount <= 0) return "Помилка: Сума має бути додатньою";

    let userId = Principal.toText(msg.caller);
    let absAmount = Float.abs(amount);
    
    if (isExpense) {
      let balance = getUserAccount(userId).balance;
      if (absAmount > balance) {
        return "Помилка: Недостатньо коштів! Ваш баланс: " # Float.toText(balance);
      };
    };

    let newTransaction = {
      id = nextId;
      userId;
      amount = absAmount;
      category;
      date = Int.toText(Time.now());
      isExpense;
    };

    transactions := Array.append(transactions, [newTransaction]);
    
    if (isExpense) {
      updateUserAccount(userId, -absAmount, true);
    } else {
      updateUserAccount(userId, absAmount, false);
    };
    
    nextId += 1;
    return "Транзакцію успішно додано!";
  };

  // Отримати баланс користувача
  public shared query(msg) func getBalance() : async Float {
    let userId = Principal.toText(msg.caller);
    getUserAccount(userId).balance;
  };

  // Отримати всі транзакції користувача
  public shared query(msg) func getTransactions() : async [Transaction] {
    let userId = Principal.toText(msg.caller);
    Array.filter(transactions, func (t: Transaction) : Bool { 
      t.userId == userId 
    })
  };

  // Видалити транзакцію (без впливу на загальні показники)
  public shared(msg) func deleteTransaction(id: Nat) : async Bool {
    let userId = Principal.toText(msg.caller);
    let sizeBefore = transactions.size();
    
    transactions := Array.filter(transactions, func (t: Transaction) : Bool { 
      t.id != id or t.userId != userId
    });

    return sizeBefore != transactions.size();
  };

  // Отримати загальний дохід
  public shared query(msg) func getTotalIncome() : async Float {
    let userId = Principal.toText(msg.caller);
    getUserAccount(userId).totalIncome;
  };

  // Отримати загальні витрати
  public shared query(msg) func getTotalExpenses() : async Float {
    let userId = Principal.toText(msg.caller);
    getUserAccount(userId).totalExpenses;
  };

  // Скинути загальний дохід
  public shared(msg) func resetTotalIncome() : async () {
    let userId = Principal.toText(msg.caller);
    users := Array.map(users, func (u: UserAccount) : UserAccount {
      if (u.userId == userId) {
        return {
          userId = u.userId;
          balance = u.balance;
          totalIncome = 0.0;
          totalExpenses = u.totalExpenses;
        };
      } else {
        return u;
      }
    });
  };

  // Скинути загальні витрати
  public shared(msg) func resetTotalExpenses() : async () {
    let userId = Principal.toText(msg.caller);
    users := Array.map(users, func (u: UserAccount) : UserAccount {
      if (u.userId == userId) {
        return {
          userId = u.userId;
          balance = u.balance;
          totalIncome = u.totalIncome;
          totalExpenses = 0.0;
        };
      } else {
        return u;
      }
    });
  };
};
