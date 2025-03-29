# 💰 Персональний Фінансовий Менеджер

**Децентралізований додаток** для ведення обліку особистих фінансів.

## Основні функції

- ➕ Додавання транзакцій (доходи та витрати)
- 📊 Перегляд поточного балансу
- 📅 Історія всіх операцій
- 🔄 Скидання фінансової статистики
- 🔐 Зберігання даних на блокчейні

## Технологічний стек

**Клієнтська частина:**
- React.js
- Vite (збірка)
- lit-html (шаблонізація)
- SCSS (стилі)

**Серверна частина:**
- Мова програмування Motoko
- Internet Computer Protocol
- DFX SDK

## Архітектура

Додаток складається з:
1. **Фронтенд** - інтерфейс користувача
- Ключові файли:
- App.js – головний компонент
- main.js – точка входу
- index.html – базовий шаблон
2. **Бекенд-каністер** - логіка роботи з даними
- ain.mo – ядро логіки
- dfx.json – конфігурація
3. **Інтерфейси взаємодії** (DID-файли)
  
Автоматично генеруються при деплої

Як це працює:

Після dfx deploy створюються:

- .did – CIDL-інтерфейс
- .did.js – JS-адаптер для фронтенду
- .d.ts – TypeScript-типи

### 1. Встановіть необхідні інструменти
# DFX (Internet Computer SDK)
```sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"```

# Node.js (LTS версія)
```nvm install --lts```

```nvm use --lts```

### 2. Клонуйте та підготуйте проект
```git clone https://github.com/yourusername/finance-app-ic.git```

```cd finance-app-ic```

```npm install```
