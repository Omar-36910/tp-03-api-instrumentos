# Trabajo práctico 03

## Descripción
Aplicación web desarrollada en Node.js utilizando el framework Express que implementa una API HTTP RESTful para administrar temporalmente un catálogo de instrumentos musicales. La aplicación lee los datos iniciales desde un archivo JSON antes de iniciar el servidor y permite consultar, filtrar y registrar nuevos instrumentos en memoria.

## Instalación
Para instalar las dependencias necesarias del proyecto, abre la terminal en la raíz del proyecto y ejecuta:

``bash
npm install

## Ejecucion 
- Para verificar la sintaxis de todos los módulos sin ejecutar el servidor:
  "npm run check"
- Para iniciar el servidor HTTP en el puerto 3000:
  "npm start"
- Cómo detener el servidor:
  Para apagar o interrumpir el servidor en la terminal, presiona la combinación de teclas:
  ° En Windows/Linux: Ctrl + C
  ° En macOS: Cmd + C

## Endpoinds
Método HTTP        Ruta / URL                     Descripción 
GET                /                              Confirma que la API está disponible.
GET                /api/instrumentos              Listado completo de todos los instrumentos registrados.
GET                /api/instrumentos?familia=...  listado por familia(sin distinguir mayúsculas de minúsculas).
GET                /api/instrumentos/:id          Devuelve instrumento específico según su id.  
POST               /api/instrumentos              Registra y agrega un nuevo instrumento a la colección en memoria.

## Ejemplos de solicitudes
Solicitud de creación (POST /api/instrumentos)
 ° URL: http://localhost:3000/api/instrumentos

 ° Encabezado (Header): Content-Type: application/json

 ° Cuerpo (Body) en formato JSON:

 {
  "nombre": "Siku",
  "familia": "Viento",
  "origen": "Altiplano Andino",
  "descripcion": "Zampoña formada por hileras de tubos de caña de diferentes longitudes.",
  "disponible": false
}

Nota: Los campos nombre, familia, origen, descripcion y disponible son de carácter obligatorio. El identificador (id) es autogenerado por el servidor.

## Codigos de estado
° 200 OK: La solicitud fue procesada correctamente. Se utiliza al responder la bienvenida, devolver el listado completo de instrumentos, entregar los resultados de un filtro o mostrar el detalle de un ID existente.

° 201 Created: El recurso fue creado exitosamente en memoria tras una petición POST. La API responde devolviendo el nuevo objeto creado junto con su id asignado.

° 400 Bad Request: La solicitud POST es inválida debido a la falta de algún campo obligatorio (nombre, familia, origen, descripcion o disponible).

° 404 Not Found: El recurso solicitado no fue encontrado. Ocurre al consultar mediante GET /api/instrumentos/:id un identificador numérico que no existe en la colección.

## Persistencia de los datos
Persistencia de los datos
Diferencia entre parámetro de ruta y parámetro de consulta:
- Parámetro de ruta (req.params): Forma parte de la estructura fija de la URL (por ejemplo /api/instrumentos/2). Se utiliza para identificar de manera unívoca un recurso específico en el servidor

- Parámetro de consulta / Query string (req.query): Es un valor opcional al final de la URL precedido por ? (por ejemplo /api/instrumentos?familia=viento). Se utiliza para filtrar, buscar o modificar la lista de datos que se devuelve sin alterar el recurso principal.

## Función de express.json()
Es un middleware integrado en Express que intercepta las peticiones entrantes con encabezado Content-Type: application/json. Se encarga de transformar (parsear) el texto plano enviado en el cuerpo de la solicitud en un objeto JavaScript accesible mediante req.body.

## Por qué las creaciones desaparecen al reiniciar
La aplicación almacena las altas realizadas mediante POST en un arreglo dentro de la memoria RAM mientras el proceso de Node.js se mantenga encendido.

Al reiniciar o detener el servidor, la memoria volátil se limpia. Cuando el servidor vuelve a encenderse, ejecuta nuevamente la función de lectura asíncrona cargando exclusivamente los datos almacenados originalmente en el archivo datos/instrumentos.json. La API no realiza escrituras sobre el archivo JSON ni cuenta con una base de datos persistente.