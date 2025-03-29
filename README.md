# 💰 Personal Finance Manager

**A decentralized application** for tracking personal finances.

## Key Features

- ➕ Add transactions (income & expenses)
- 📊 View current balance
- 📅 Full transaction history
- 🔄 Reset financial statistics
- 🔐 Blockchain data storage

## Technology Stack

**Client-side:**
- React.js
- Vite (build tool)
- lit-html (templating)
- SCSS (styling)

**Server-side:**
- Motoko programming language
- Internet Computer Protocol
- DFX SDK

## Architecture

The application consists of:
1. **Frontend** - User interface
   - Key files:
   - App.js - Main component
   - main.js - Entry point
   - index.html - Base template

2. **Backend Canister** - Data logic
   - main.mo - Core logic
   - dfx.json - Configuration

3. **Interaction Interfaces** (DID files)
   Automatically generated during deployment

How it works:

After `dfx deploy`, these files are generated:
- .did - CIDL interface
- .did.js - JS adapter for frontend
- .d.ts - TypeScript types

## Installation Guide

### 1. Install required tools
```sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"```

### 2. Clone and prepare the project
```git clone https://github.com/yourusername/finance-app-ic.git```

```cd finance-app-ic```

```npm install```

### 3. Start local network
```dfx start --background --clean```

### 4. Deploy the application
```dfx deploy```

```npm run dev```
