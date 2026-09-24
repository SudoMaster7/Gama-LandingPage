/** Protocolo legível: GAMA-AAMMDD-XXXX (sem caracteres ambíguos). */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateProtocol(date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");

  return `GAMA-${yy}${mm}${dd}-${suffix}`;
}
