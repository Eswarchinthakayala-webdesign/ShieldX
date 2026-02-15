/**
 * ShieldX Cryptographic Substrate
 * Handles browser-side key generation, derivation, and encryption
 */

// Key derivation from password using PBKDF2
async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Generate RSA-4096 Key Pair
async function generateIdentityKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true, // extractable
    ["encrypt", "decrypt"]
  );
}

// Export a key to a format we can store
async function exportKey(key) {
  const exported = await crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(exported);
}

// Import a key back
async function importKey(jwkString, type) {
  const jwk = JSON.parse(jwkString);
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    type === "public" ? ["encrypt"] : ["decrypt"]
  );
}

export const ShieldXCrypto = {
  // Main function to initialize a new secure identity
  async initializeIdentity(password) {
    const keyPair = await generateIdentityKeyPair();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const encryptionKey = await deriveKey(password, salt);
    
    // Export keys
    const publicKeyJwk = await exportKey(keyPair.publicKey);
    const privateKeyJwk = await exportKey(keyPair.privateKey);

    // Encrypt Private Key with AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encryptedPrivateKey = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      encryptionKey,
      enc.encode(privateKeyJwk)
    );

    return {
      publicKey: publicKeyJwk,
      encryptedPrivateKey: b64Encode(new Uint8Array(encryptedPrivateKey)),
      salt: b64Encode(salt),
      iv: b64Encode(iv)
    };
  },

  async decryptPrivateKey(encryptedB64, password, saltB64, ivB64) {
    const salt = b64Decode(saltB64);
    const iv = b64Decode(ivB64);
    const encrypted = b64Decode(encryptedB64);
    
    const encryptionKey = await deriveKey(password, salt);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      encryptionKey,
      encrypted
    );

    const dec = new TextDecoder();
    return dec.decode(decrypted);
  },

  async encryptMessage(message, recipientPublicKeyJwk) {
    const enc = new TextEncoder();
    
    // 1. Import Recipient's Public Key
    const publicKey = await importKey(recipientPublicKeyJwk, "public");

    // 2. Generate transient AES-256 key
    const aesKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    // 3. Encrypt Message with AES
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      enc.encode(message)
    );

    // 4. Wrap (Encrypt) AES Key with Recipient's RSA Public Key
    const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);
    const encryptedAesKey = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      rawAesKey
    );

    return {
      encryptedMessage: b64Encode(encryptedContent),
      encryptedAesKey: b64Encode(encryptedAesKey),
      iv: b64Encode(iv),
      rawAesKey: rawAesKey // Returned for local mirroring
    };
  },

  async mirrorAesKey(rawAesKey, publicKeyJwk) {
    const publicKey = await importKey(publicKeyJwk, "public");
    const encryptedAesKey = await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      rawAesKey
    );
    return b64Encode(encryptedAesKey);
  },

  async decryptMessage(encryptedData, recipientPrivateKeyJwk) {
    // 1. Import Recipient's Private Key
    const privateKey = await importKey(recipientPrivateKeyJwk, "private");

    // 2. Unwrap AES Key using RSA Private Key
    const encryptedAesKey = b64Decode(encryptedData.encryptedAesKey);
    const rawAesKey = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedAesKey
    );

    const aesKey = await crypto.subtle.importKey(
      "raw",
      rawAesKey,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // 3. Decrypt Message using Decrypted AES Key
    const encryptedMessage = b64Decode(encryptedData.encryptedMessage);
    const iv = b64Decode(encryptedData.iv);
    
    const decryptedContent = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      encryptedMessage
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedContent);
  }
};

// Helpers for storage-friendly formats
function b64Encode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function b64Decode(str) {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
