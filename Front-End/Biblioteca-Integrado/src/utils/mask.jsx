export const maskRA = (text) => {
  let cleaned = text.replace(/\D/g, ""); // remove tudo que não é número
  if (cleaned.length > 7) cleaned = cleaned.slice(0, 7); // limita a 7 dígitos

  let masked = cleaned;

  if (cleaned.length > 2) {
    masked = cleaned.slice(0, 2) + "." + cleaned.slice(2);
  }

  if (cleaned.length === 7) {
    masked = masked.slice(0, 7) + "-" + cleaned.slice(6);
  }

  return masked;
};
export const unmaskRA = (text) => {
  return text.replace(/\D/g, "");
};
