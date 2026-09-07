const path = require('node:path');
const express = require('express');
const { leerJSON } = require('./archivos');

const PORT = 3000;
const rutaDatos = path.join(__dirname, '..', 'datos', 'instrumentos.json');

// Colección local que actuará como base de datos en memoria
let instrumentos = [];

async function main() {
  try {
    // 1. Cargar datos iniciales antes de iniciar el servidor
    instrumentos = await leerJSON(rutaDatos);
    console.log('Datos cargados exitosamente desde instrumentos.json');

    const app = express();

    // Middleware obligatorio para procesar el cuerpo JSON en las peticiones POST
    app.use(express.json());

    // GET / - Bienvenida
    app.get('/', (req, res) => {
      return res.status(200).json({
        mensaje: "Bienvenido a la API del Catálogo de Instrumentos Musicales",
        estado: "Disponible"
      });
    });

    // GET /api/instrumentos - Listado completo y filtro opcional por familia
    app.get('/api/instrumentos', (req, res) => {
      const { familia } = req.query;

      if (familia) {
        const familiaBuscada = familia.toLowerCase();
        const instrumentosFiltrados = instrumentos.filter(
          inst => inst.familia.toLowerCase() === familiaBuscada
        );
        return res.status(200).json(instrumentosFiltrados);
      }

      return res.status(200).json(instrumentos);
    });

    // GET /api/instrumentos/:id - Detalle por identificador
    app.get('/api/instrumentos/:id', (req, res) => {
      const id = Number(req.params.id);

      const instrumento = instrumentos.find(inst => inst.id === id);

      if (!instrumento) {
        return res.status(404).json({
          error: "Instrumento no encontrado",
          mensaje: `No existe un recurso registrado con el ID ${req.params.id}`
        });
      }

      return res.status(200).json(instrumento);
    });

    // POST /api/instrumentos - Crear un instrumento en memoria
    app.post('/api/instrumentos', (req, res) => {
      const { nombre, familia, origen, descripcion, disponible } = req.body;

      // Validación estricta: 'disponible' debe ser un booleano (no undefined)
      if (
        !nombre ||
        !familia ||
        !origen ||
        !descripcion ||
        disponible === undefined
      ) {
        return res.status(400).json({
          error: "Solicitud incorrecta",
          mensaje: "Faltan campos obligatorios: nombre, familia, origen, descripcion y disponible son requeridos."
        });
      }

      // Generación dinámica del ID a partir del último registro registrado
      const ultimoId = instrumentos.length > 0 
        ? instrumentos[instrumentos.length - 1].id 
        : 0;
      
      const nuevoInstrumento = {
        id: ultimoId + 1,
        nombre,
        familia,
        origen,
        descripcion,
        disponible: Boolean(disponible)
      };

      // Guardar en la colección de memoria
      instrumentos.push(nuevoInstrumento);

      return res.status(201).json(nuevoInstrumento);
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor HTTP corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exitCode = 1;
  }
}

main();