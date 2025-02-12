const crypto = require("crypto");
// Define encryption algorithm, key, and IV size
const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32); // 256-bit key (save securely)
const iv = crypto.randomBytes(16); // 128-bit IV
/**
 * Encrypts a plain text string
 * @param {string} text - Text to encrypt
 * @returns {Object} - Contains encryptedData, iv, and key
 */
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    key: key.toString("hex"),
  };
}

/**
 * Decrypts an encrypted string
 * @param {string} encryptedData - Data to decrypt
 * @param {string} keyHex - Encryption key in hex
 * @param {string} ivHex - IV in hex
 * @returns {string} - Decrypted text
 */
function decrypt(encryptedData, keyHex, ivHex) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(keyHex, "hex"),
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Export the functions for reuse
module.exports = { encrypt, decrypt };
