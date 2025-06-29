# 🧬 X_Genesis

A **decentralized credential verification platform** powered by **NFTs** and **AI** — enabling students to showcase their verified achievements, institutions to authenticate data, and recruiters to discover top talent globally.

---

## 🌐 Overview

**X_Genesis** revolutionizes academic credential verification by:

- 🎓 Allowing students to upload certificates & projects  
- 🤖 Using AI and institute-level verification to validate authenticity  
- 🪙 Minting **soulbound NFTs** for verified credentials  
- 💼 Enabling recruiters to discover verified candidates via search and filters  

> **No more fake resumes. No more redundant paperwork. Just verified talent on-chain.**

---

## 👥 User Roles

| Role            | Description                                                                           |
|-----------------|---------------------------------------------------------------------------------------|
| 🧑‍🎓 Student       | Uploads credentials, connects wallet, tracks verification, receives NFTs             |
| 🏛️ Institute Admin | Verifies uploaded credentials manually (post-AI filtering)                            |
| 💼 Recruiter       | Searches for verified students via skills, projects, tags, or credentials            |

---

## 🧽 System Flow

### 1. **User Onboarding**
- Sign up as student, recruiter, or institute admin
- Login using email/password + optional wallet connection

### 2. **Credential Upload**
- Students upload certificates or project documents
- Status Flow: `pending` → `ai-verified` → `institute-verified`

### 3. **Verification**
- AI verifies content (plagiarism, formatting, duplication)
- Institute Admin manually confirms authenticity

### 4. **NFT Minting**
- Minted after full verification (AI + Institute)
- **Soulbound NFT** is linked to the student's wallet and stored on-chain
- Metadata stored on **IPFS**

### 5. **Discovery & Validation**
- Recruiters search verified student profiles by tech stack, tags, institution, etc.
- Public credential viewer to verify NFT authenticity

---

## 🧱 Tech Stack

### 🎨 Frontend
- `React`, `Vite`, `Tailwind CSS`
- Wallet Connection: `ethers.js`
- State Management: `Redux`

### ⚙️ Backend
- `Node.js`, `Express.js`
- `MongoDB` + `Mongoose`
- `JWT` Authentication
- `.env` Configuration

### ⛓️ Blockchain
- Smart Contracts: `ERC-721` / `ERC-1155` (Soulbound NFT)
- Wallet & Minting: `Ethers.js`, `Web3.js`
- Metadata stored on `IPFS`

### 🧠 AI Layer *(Optional)*
- NLP for document analysis
- Checks for formatting, duplication, and authenticity

---

🚀 Features
🔐 Role-based authentication system

🧠 AI-assisted credential verification

🪙 NFT minting post verification

💼 Recruiter talent search dashboard

🧾 3D Credential Cards for visual proof

📁 IPFS storage for uploaded documents

🧬 Soulbound identity through NFTs

❓ FAQs
❓ When is the NFT minted?
After both AI and Institute Admin verify the document.

❓ Can a student receive multiple NFTs?
Yes — each verified document mints a separate NFT.

❓ Are the NFTs transferrable?
No — they are Soulbound and permanently tied to the student's identity.

❓ Can students upload more credentials later?
Yes — each credential is independently verified and minted as a new NFT.

🛡️ Security & Privacy
🔒 Passwords and sensitive data are securely encrypted

🗃️ Documents stored securely on IPFS

📜 Wallet authentication follows EIP-4361 (Sign-In with Ethereum)

📌 Roadmap
✅ MVP with role-based auth & NFT minting

⏳ AI-based document screening module

⏳ Recruiter dashboard with dynamic search filters

⏳ Mobile support & deep wallet integrations

⏳ DAO-based governance for credential standards

🤝 Contributing
Contributions are welcome!
Feel free to submit a pull request or open an issue for discussion.