# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## End-to-End Encryption

BitChat uses end-to-end encryption for chat messages using [crypto-js](https://www.npmjs.com/package/crypto-js).

- **Encryption:** Messages are encrypted on the client before sending and decrypted after receiving.
- **Shared Secret:** For demonstration, a hardcoded shared secret (`BitChatSuperSecretKey`) is used. In production, use unique keys per chat and a secure key exchange (e.g., Diffie-Hellman, RSA).
- **Server:** The server stores and relays only encrypted messages. It never decrypts them.

### How it works

1. Before sending, messages are encrypted with AES using the shared secret.
2. Received messages are decrypted with the same secret.
3. Only users with the secret can read the messages.

### Security Note

Do NOT use hardcoded secrets in production. Implement secure key management and exchange.
