import { API_HOST } from "@env";

// Hardcoded para garantir que funcione
const HOST = API_HOST || "http://10.10.9.142:3001";

/**
 * Converte o nome do arquivo da capa para URL completa
 * @param {string} capaUrl - Nome do arquivo (ex: "1764115214771-photo.jpeg") ou URL completa
 * @returns {string|null} - URL completa ou null se não houver capa
 */
export const getCapaUrl = (capaUrl) => {
  console.log(`[getCapaUrl] Input: ${capaUrl}, HOST: ${HOST}`);

  if (!capaUrl) {
    console.log(`[getCapaUrl] capa_url is empty/null`);
    return null;
  }

  // Se já for uma URL completa, retorna como está
  if (capaUrl.startsWith("http://") || capaUrl.startsWith("https://")) {
    console.log(`[getCapaUrl] Already full URL: ${capaUrl}`);
    return capaUrl;
  }

  // Constrói a URL completa
  const fullUrl = `${HOST}/capas/${capaUrl}`;
  console.log(`[getCapaUrl] Built URL: ${fullUrl}`);
  return fullUrl;
};
