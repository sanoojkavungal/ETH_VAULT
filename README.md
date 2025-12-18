# 🔐 ETH Vault – Time-Locked ETH Deposit dApp

ETH Vault is a decentralized application (dApp) that allows users to deposit ETH with a time lock and withdraw it only after the lock period expires. The project is built using Solidity, ethers.js v6, and MetaMask, and is deployed on the Sepolia test network.

This project demonstrates complete end-to-end Web3 development, including smart contract interaction, wallet connection, and frontend state updates based on blockchain data.

https://eth-vault-eta.vercel.app/

---

## 🚀 Features

- 🔗 Connect MetaMask wallet
- 🌐 Ensures user is connected to Sepolia network
- 💰 Deposit ETH with a custom lock period (in seconds)
- ⏳ ETH remains locked until unlock time
- 🏦 Withdraw ETH only after the lock expires
- 📊 View deposit details:
  - Deposited amount
  - Unlock time
  - Withdrawal status
- 🔄 Auto reload on account or network change

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS (Glassmorphism UI)
- JavaScript (Vanilla)
- ethers.js v6

### Blockchain
- Solidity
- Ethereum (Sepolia Testnet)
- MetaMask

---

## 📂 Project Structure

ETH-Vault/
│
├── index.html # Frontend UI
├── style.css # Styling
├── app.js # Web3 logic using ethers.js
└── README.md # Project documentation

🧪 How to Run the Project Locally
1️⃣ Prerequisites

MetaMask browser extension

Sepolia test ETH (from a faucet)

Live Server / VS Code or any local server

2️⃣ Clone the Repository
git clone https://github.com/sanoojkavungal/ETH_VAULT
cd eth-vault

3️⃣ Run the App

Open index.html using Live Server

Or open it directly in a browser

4️⃣ Use the dApp

Click Connect Wallet

Switch MetaMask to Sepolia network

Enter ETH amount and lock time

Deposit ETH

Withdraw ETH after the unlock time

⚠️ Important Notes

This project is for educational purposes only

Do NOT deploy to Ethereum mainnet without proper security audits

ETH values are stored in wei internally

Unlock time is based on block timestamp
