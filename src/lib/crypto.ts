/**
 * Client-side cryptographic hash computation using Web Crypto API.
 * 100% in-browser, no servers or keys transmitted.
 */
export async function computeSha256(input: string | ArrayBuffer): Promise<string> {
  const encoder = new TextEncoder();
  const data = typeof input === 'string' ? encoder.encode(input) : input;
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateClearanceId(rollNumber: string): string {
  const cleanRoll = rollNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `CF-${cleanRoll}-${randomSuffix}`;
}
