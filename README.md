# ShieldX Protocol

![ShieldX](https://img.shields.io/badge/ShieldX-Secure_Protocol-ff1e1e?style=for-the-badge&logo=shield)
![Status](https://img.shields.io/badge/Status-Active_Mesh-000000?style=for-the-badge)

ShieldX is a next-generation decentralized identity and secure communication platform. It leverages client-side cryptography to forge unique identity shards, ensuring that your private keys never leave your device unencrypted.

## 🚀 Features

- **Zero-Knowledge Identity**: Users generate Identity Shards (Public/Private Keys) locally.
- **Client-Side Encryption**: Private keys are encrypted with a user-defined passphrase before storage (`AES-256-GCM`).
- **Secure Mesh Network**: Peer-to-peer style identity verification.
- **System Optics Dashboard**: Real-time visualization of node status, privacy mode, and network connectivity.
- **EmailJS Integration**: Automated delivery of Identity Recovery Kits (Public Key + Passphrase backup).
- **Stealth Mode**: Toggle visibility on the public mesh.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend/DB**: Supabase (PostgreSQL, Auth)
- **Cryptography**: Web Crypto API (RSA-OAEP, AES-GCM)
- **mail**: EmailJS (Client-side delivery)

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Eswarchinthakayala-webdesign/ShieldX.git
    cd ShieldX
    ```

    *Or if initializing an existing local repository:*
    ```bash
    git init
    git remote add origin https://github.com/Eswarchinthakayala-webdesign/ShieldX.git
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 📧 EmailJS Configuration

ShieldX uses EmailJS to send welcome emails and recovery details.
The configuration is located in `src/pages/InitializeIdentityPage.jsx`.

Ensure you have your **Service ID**, **Template ID**, and **Public Key** updated in the code:
- `service_ha6wjpt`
- `template_j1ctgph`
- `mJ8q6uBoj9Eg_OYot`

*Note: For production, we recommend moving these to environment variables.*

## 🔐 Security Architecture

- **Identity Forging**: Upon initialization, a `4096-bit` (or similar strong) RSA key pair is generated.
- **Private Key**: Encrypted immediately using the user's `Passphrase` via `AES-GCM` with a unique salt and IV.
- **Storage**: Only the *Encrypted* Private Key and *Public* Key are stored in the Supabase `profiles` table.
- **Session**: Decrypted keys exist only in the browser's memory during the active session.

## ⚠️ Important Warning

**The Recovery Passphrase is critical.** If lost, the private key cannot be decrypted, and the identity shard is permanently inaccessible. We provide an option to email this passphrase as a backup, but users should be aware of the security implications of storing secrets in email.

## 📄 License

ShieldX Protocol is proprietary software. All rights reserved.
