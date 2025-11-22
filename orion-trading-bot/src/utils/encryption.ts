// API Key encryption and secure storage utilities
import CryptoJS from 'crypto-js';

// Get encryption key from environment - required for production security
const getEncryptionKey = (): string => {
  const key = import.meta.env.VITE_ENCRYPTION_KEY;
  if (!key) {
    // For demo/development, use a warning and default key
    // In production, this should throw an error
    if (import.meta.env.MODE === 'production') {
      throw new Error('VITE_ENCRYPTION_KEY environment variable must be set in production');
    }
    console.warn('VITE_ENCRYPTION_KEY not set. Using default key for development only.');
    return 'dev-default-key-not-for-production-use';
  }
  return key;
};

/**
 * Encrypt sensitive data (like API keys)
 * @param plainText - The text to encrypt
 * @returns Encrypted string
 */
export const encryptData = (plainText: string): string => {
  try {
    const key = getEncryptionKey();
    return CryptoJS.AES.encrypt(plainText, key).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt sensitive data
 * @param cipherText - The encrypted text
 * @returns Decrypted string
 */
export const decryptData = (cipherText: string): string => {
  try {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error('Decryption resulted in empty string');
    }
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Securely store API key in localStorage (encrypted)
 * @param userId - User identifier
 * @param apiKey - The API key to store
 */
export const storeApiKey = (userId: string, apiKey: string): void => {
  try {
    const encrypted = encryptData(apiKey);
    localStorage.setItem(`orion_api_key_${userId}`, encrypted);
  } catch (error) {
    console.error('Failed to store API key:', error);
    throw error;
  }
};

/**
 * Retrieve and decrypt API key from localStorage
 * @param userId - User identifier
 * @returns Decrypted API key or null if not found
 */
export const retrieveApiKey = (userId: string): string | null => {
  try {
    const encrypted = localStorage.getItem(`orion_api_key_${userId}`);
    if (!encrypted) {
      return null;
    }
    return decryptData(encrypted);
  } catch (error) {
    console.error('Failed to retrieve API key:', error);
    return null;
  }
};

/**
 * Remove API key from storage
 * @param userId - User identifier
 */
export const removeApiKey = (userId: string): void => {
  localStorage.removeItem(`orion_api_key_${userId}`);
};

/**
 * Validate API key format
 * @param apiKey - The API key to validate
 * @returns True if valid format
 */
export const validateApiKey = (apiKey: string): boolean => {
  // Basic validation: non-empty, reasonable length, and alphanumeric+special chars
  if (!apiKey || apiKey.length < 20 || apiKey.length > 256) {
    return false;
  }
  
  // Must contain at least some alphanumeric characters (not just spaces)
  const hasContent = /[a-zA-Z0-9]/.test(apiKey);
  
  // Should not contain obviously invalid characters like control characters
  const hasInvalidChars = /[\x00-\x1F\x7F]/.test(apiKey);
  
  return hasContent && !hasInvalidChars;
};
