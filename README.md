# XEscrow

XEscrow is a decentralized escrow platform built on the Solana blockchain. It was developed as part of the Solana Radar Hackathon. The platform facilitates secure transactions by holding funds in an escrow token account until predefined conditions are met, ensuring trust between the parties involved in the transaction.

## Project Structure

The project is divided into four main components:

1. **ComingSoon** (Landing Page)  
2. **Account** (Personal User Account, Interaction with Solana blockchain)  
3. **ApiAccount** (API to manage user accounts, Interaction with Solana blockchain)  
4. **SmartContract** (Rust-based Solana Smart Contract for Escrow transactions)

### 1. ComingSoon (Landing Page)

- **Tech Stack**: Vue.js 3, Vite, TypeScript  
- **Description**: A simple landing page that introduces the XEscrow platform to users.

### 2. Account (Personal User Account, Interaction with Solana blockchain)

- **Tech Stack**: Vue.js 3, Vite, TypeScript  
- **Description**: The user account interface where users can manage their settings, interact with the Solana blockchain, perform escrow transactions, and view transaction history. This is the core of the user experience on the platform.

### 3. ApiAccount (API to Manage Accounts)

- **Tech Stack**: TypeScript, PostgreSQL, Sequelize, Passport.js, Redis  
- **Description**: The API layer for handling user account data, including account creation, transaction history, and communication with the Solana blockchain. 
  - **Sequelize**: ORM for interacting with the PostgreSQL database, managing user data securely.
  - **Passport.js**: Middleware for handling user authentication, including secure login and session management.
  - **Redis**: Used for caching and enhancing user experience by storing session data, reducing database load, and improving application performance.

### 4. SmartContract (Rust-based Escrow Smart Contract)

- **Tech Stack**: Rust  
- **Description**: The Solana-based smart contract that handles escrow transactions. This contract is responsible for securely transacting funds between token accounts and ensuring that conditions for releasing the funds are met before completing the transaction. Written in Rust, it interacts directly with the Solana blockchain.
