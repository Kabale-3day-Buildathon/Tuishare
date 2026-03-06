# Tuishare 🎓

> Direct student-sponsor sponsorship platform powered by Stellar blockchain.

Tuishare eliminates the middleman between students who need education funding and sponsors who want to give directly. Smart contracts ensure funds go straight to verified institutions — transparent, trustless, and scam-proof.

## Problem
- Students can't access sponsors without going through slow, bureaucratic NGOs
- Sponsors face scams and zero accountability when trying to fund education directly

## Solution
A blockchain-powered platform where:
1. Students register with verified enrollment documents
2. Sponsors fund specific student needs (tuition, books) via Stellar USDC
3. Smart contracts release funds directly to institutions — not student wallets
4. Both parties get full on-chain transparency

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue.js 3 + Vite |
| Backend | Node.js / Express.js |
| Blockchain | Stellar (Soroban smart contracts) |
| Payments | XLM / USDC on Stellar |
| Wallet | Freighter Wallet SDK |
| Database | PostgreSQL |

## Project Structure

```
Tuishare/
├── frontend/       # Vue.js 3 + Vite
├── backend/        # Node.js / Express API
└── contracts/      # Soroban smart contracts (Rust)
```

## Getting Started

### Prerequisites
- Node.js >= 18
- Rust + Soroban CLI
- Freighter Wallet browser extension

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Contracts
```bash
cd contracts
cargo build
soroban contract build
```

## SDG Alignment
This project contributes to **UN SDG #4 — Quality Education**.

## License
MIT
