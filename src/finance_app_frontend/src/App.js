import { html, render } from 'lit-html';
import { finance_app_backend } from 'declarations/finance_app_backend';

class FinanceApp {
  constructor() {
    this.state = {
      balance: 0,
      totalIncome: 0,
      totalExpenses: 0,
      transactions: [],
      amount: '',
      category: '',
      isExpense: true,
      message: '',
      loading: false
    };
    
    this.init();
  }

  async init() {
    await this.fetchData();
  }

  async fetchData() {
    this.setState({ loading: true });
    try {
      const [balance, transactions, totalIncome, totalExpenses] = await Promise.all([
        finance_app_backend.getBalance(),
        finance_app_backend.getTransactions(),
        finance_app_backend.getTotalIncome(),
        finance_app_backend.getTotalExpenses()
      ]);
      this.setState({ 
        balance, 
        transactions, 
        totalIncome: totalIncome || 0, 
        totalExpenses: totalExpenses || 0 
      });
    } catch (error) {
      console.error("Не вдалося завантажити дані:", error);
      this.setState({ message: "Не вдалося завантажити дані. Спробуйте пізніше." });
    } finally {
      this.setState({ loading: false });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { amount, category, isExpense } = this.state;
    
    this.setState({ loading: true, message: '' });
    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        this.setState({ message: "Сума має бути додатнім числом" });
        return;
      }

      const result = await finance_app_backend.addTransaction(
        amountNum,
        category,
        isExpense
      );
      
      this.setState({ 
        message: result,
        amount: '',
        category: ''
      });
      await this.fetchData();
    } catch (error) {
      this.setState({ message: "Помилка: " + error });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDelete = async (id) => {
    this.setState({ loading: true });
    try {
      const success = await finance_app_backend.deleteTransaction(id);
      this.setState({ 
        message: success ? "Транзакцію видалено" : "Не вдалося видалити"
      });
      await this.fetchData();
    } catch (error) {
      this.setState({ message: "Помилка видалення: " + error });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleResetIncome = async () => {
    this.setState({ loading: true });
    try {
      await finance_app_backend.resetTotalIncome();
      this.setState({ 
        message: "Загальний дохід успішно скинуто",
        totalIncome: 0
      });
    } catch (error) {
      this.setState({ message: "Помилка скидання: " + error });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleResetExpenses = async () => {
    this.setState({ loading: true });
    try {
      await finance_app_backend.resetTotalExpenses();
      this.setState({ 
        message: "Загальні витрати успішно скинуто",
        totalExpenses: 0
      });
    } catch (error) {
      this.setState({ message: "Помилка скидання: " + error });
    } finally {
      this.setState({ loading: false });
    }
  };

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    const { 
      balance, 
      transactions, 
      amount, 
      category, 
      isExpense, 
      message, 
      loading,
      totalIncome,
      totalExpenses
    } = this.state;
    
    const body = html`
      <div class="app-container">
        <div class="finance-app">
          <h1>Фінансовий менеджер</h1>
          
          <div class="balance-card">
            <h2>Поточний баланс</h2>
            <div class=${balance >= 0 ? 'positive' : 'negative'}>
              ₴${balance.toFixed(2)}
            </div>
            
            <div class="totals-grid">
              <div class="total-column income">
                <h3>Загальний дохід</h3>
                <div>₴${totalIncome.toFixed(2)}</div>
                <button 
                  @click=${this.handleResetIncome}
                  class="reset-btn"
                  ?disabled=${loading}
                >
                  Скинути
                </button>
              </div>
              
              <div class="total-column expense">
                <h3>Загальні витрати</h3>
                <div>₴${totalExpenses.toFixed(2)}</div>
                <button 
                  @click=${this.handleResetExpenses}
                  class="reset-btn"
                  ?disabled=${loading}
                >
                  Скинути
                </button>
              </div>
            </div>
          </div>

          <div class="transaction-card">
            <h2>Нова транзакція</h2>
            <form @submit=${this.handleSubmit}>
              <div class="toggle-group">
                <button type="button" 
                  class=${isExpense ? 'active' : ''}
                  @click=${() => this.setState({ isExpense: true })}>
                  Витрата
                </button>
                <button type="button"
                  class=${!isExpense ? 'active' : ''}
                  @click=${() => this.setState({ isExpense: false })}>
                  Дохід
                </button>
              </div>
              
              <div class="form-group">
                <input
                  type="number"
                  .value=${amount}
                  @input=${(e) => this.setState({ amount: e.target.value })}
                  placeholder="Сума"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div class="form-group">
                <input
                  type="text"
                  .value=${category}
                  @input=${(e) => this.setState({ category: e.target.value })}
                  placeholder="Категорія"
                  required
                />
              </div>
              
              <button type="submit" ?disabled=${loading} class="submit-btn">
                ${loading ? "Обробка..." : "Додати транзакцію"}
              </button>
            </form>
            
            ${message ? html`<div class="message ${message.includes('Помилка') ? 'error' : 'success'}">${message}</div>` : ''}
          </div>

          <div class="transactions-card">
            <h2>Історія транзакцій</h2>
            ${transactions.length === 0 
              ? html`<p class="empty">Ще немає транзакцій</p>`
              : html`
                <table>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Категорія</th>
                      <th>Сума</th>
                      <th>Дія</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${transactions.map(tx => html`
                      <tr>
                        <td>${new Date(parseInt(tx.date) / 1000000).toLocaleDateString()}</td>
                        <td>${tx.category}</td>
                        <td class=${tx.isExpense ? 'expense' : 'income'}>
                          ${tx.isExpense ? '-' : '+'}₴${tx.amount.toFixed(2)}
                        </td>
                        <td>
                          <button 
                            @click=${() => this.handleDelete(tx.id)}
                            class="delete-btn"
                          >
                            Видалити
                          </button>
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              `}
          </div>
        </div>
      </div>

      <style>
        .app-container {
          padding: 20px;
          font-family: 'Arial', sans-serif;
          background: #f5f7fa;
          min-height: 100vh;
        }
        
        .finance-app {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 20px;
        }
        
        h1 {
          color: #2c3e50;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .balance-card, .transaction-card, .transactions-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .positive {
          color: #27ae60;
          font-size: 24px;
          font-weight: bold;
        }
        
        .negative {
          color: #e74c3c;
          font-size: 24px;
          font-weight: bold;
        }
        
        .totals-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        .total-column {
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        
        .total-column.income {
          background-color: rgba(39, 174, 96, 0.1);
          border: 1px solid rgba(39, 174, 96, 0.3);
        }
        
        .total-column.expense {
          background-color: rgba(231, 76, 60, 0.1);
          border: 1px solid rgba(231, 76, 60, 0.3);
        }
        
        .total-column h3 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }
        
        .total-column div {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .total-column.income div {
          color: #27ae60;
        }
        
        .total-column.expense div {
          color: #e74c3c;
        }
        
        .toggle-group {
          display: flex;
          margin-bottom: 15px;
        }
        
        .toggle-group button {
          flex: 1;
          padding: 10px;
          border: none;
          background: #ecf0f1;
          cursor: pointer;
        }
        
        .toggle-group button.active {
          background: #3498db;
          color: white;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        
        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .submit-btn:disabled {
          background: #95a5a6;
        }
        
        .reset-btn {
          background: #7f8c8d;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .reset-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        .income {
          color: #27ae60;
        }
        
        .expense {
          color: #e74c3c;
        }
        
        .delete-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        }
        
        .message {
          padding: 10px;
          margin-top: 15px;
          border-radius: 4px;
        }
        
        .error {
          background: #ffebee;
          color: #e74c3c;
        }
        
        .success {
          background: #e8f5e9;
          color: #27ae60;
        }
        
        .empty {
          text-align: center;
          color: #7f8c8d;
        }
      </style>
    `;

    render(body, document.getElementById('root'));
  }
}

export default FinanceApp;
