import { parseLocation } from "../views/utils";

export async function fetchContenedores() {
    try {
        // Realizamos la solicitud a la API
        const response = await fetch("https://optainerback.vercel.app/api/contenedores");

        // Verificamos que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error(`Error al hacer la petición: ${response.status}`);
        }

        // Parseamos la respuesta como JSON
        const data = await response.json();
        const parsedData = data.map((contenedor) => ({
            ...contenedor,
            ubicacionParseada: parseLocation(contenedor.ubicacion)
        }));
        // Procesamos los datos recibidos (ubicaciones de contenedores)
        //console.log('Datos recibidos de contenedores:', parsedData);

        return parsedData
    } catch (error) {
        console.error('Error al obtener los datos de contenedores:', error);
    }
}
