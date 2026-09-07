import crypto from "crypto";

// Standard CCAvenue 16-byte IV
const CCAVENUE_IV = Buffer.from([
  0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
]);

/**
 * Encrypt plaintext using AES-128-CBC with the MD5 hash of the CCAvenue working key.
 */
export function ccavenueEncrypt(plainText: string, workingKey: string): string {
  const m = crypto.createHash("md5");
  m.update(workingKey);
  const key = m.digest();

  const cipher = crypto.createCipheriv("aes-128-cbc", key, CCAVENUE_IV);
  let encoded = cipher.update(plainText, "utf8", "hex");
  encoded += cipher.final("hex");
  return encoded;
}

/**
 * Decrypt ciphertext using AES-128-CBC with the MD5 hash of the CCAvenue working key.
 */
export function ccavenueDecrypt(encText: string, workingKey: string): string {
  const m = crypto.createHash("md5");
  m.update(workingKey);
  const key = m.digest();

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, CCAVENUE_IV);
  let decoded = decipher.update(encText, "hex", "utf8");
  decoded += decipher.final("utf8");
  return decoded;
}

/**
 * Parse the decrypted query-string response from CCAvenue into a key-value object.
 */
export function parseCcavenueResponse(decryptedText: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pairs = decryptedText.split("&");

  for (const pair of pairs) {
    if (!pair) continue;
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) {
      params[pair.trim()] = "";
    } else {
      const key = pair.substring(0, eqIndex).trim();
      const val = pair.substring(eqIndex + 1).trim();
      try {
        params[key] = decodeURIComponent(val.replace(/\+/g, " "));
      } catch {
        params[key] = val;
      }
    }
  }

  return params;
}

/**
 * Assemble plain-text parameters for CCAvenue payment initiation.
 */
export function buildCcavenuePayload(params: Record<string, string | number | undefined | null>): string {
  return Object.entries(params)
    .filter(([_, val]) => val !== undefined && val !== null && val !== "")
    .map(([key, val]) => `${key}=${String(val).replace(/&/g, " and ")}`)
    .join("&");
}
