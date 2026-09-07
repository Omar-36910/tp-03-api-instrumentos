const fs = require('node:fs/promises');

/**
 * Lee y parsea un archivo JSON codificado en UTF-8.
 * @param {string} rutaAbsoluta 
 * @returns {Promise<Array>}
 */
async function leerJSON(rutaAbsoluta) {
  const contenido = await fs.readFile(rutaAbsoluta, 'utf-8');
  return JSON.parse(contenido);
}

module.exports = {
  leerJSON
};