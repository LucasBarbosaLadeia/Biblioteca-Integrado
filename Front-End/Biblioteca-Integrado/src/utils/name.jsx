// Utilitário para formatação de nomes
// Retorna "Primeiro Último" a partir de um nome completo
// Ignora preposições comuns em português ao escolher o último sobrenome

export const getFirstAndLast = (fullName) => {
  if (!fullName || typeof fullName !== "string") return "";

  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];

  const skip = new Set(["de", "da", "do", "das", "dos", "e"]);

  // Primeiro nome
  const first = parts[0];
  // Último sobrenome relevante (ignora preposições)
  let last = parts[parts.length - 1];
  for (let i = parts.length - 1; i >= 1; i--) {
    const p = parts[i].toLowerCase();
    if (!skip.has(p)) {
      last = parts[i];
      break;
    }
  }

  return `${first} ${last}`;
};

export default getFirstAndLast;
