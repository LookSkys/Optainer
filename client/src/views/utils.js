export const parseLocation = (ubicacion) => {
    if (!ubicacion || typeof ubicacion !== 'string') {
        console.warn('Ubicación no válida:', ubicacion);
        return { torre: null, x: null, y: null, z: null, ubicacionOriginal: ubicacion };
    }

    const [torreProfundidad, , x, y] = ubicacion.split('-');

    // Verificamos que torreProfundidad tenga al menos un carácter
    if (!torreProfundidad || torreProfundidad.length < 2) {
        console.warn('Ubicación no válida:', ubicacion);
        return { torre: null, x: null, y: null, z: null, ubicacionOriginal: ubicacion };
    }

    const torre = torreProfundidad.charAt(0); // La letra D que representa la torre
    const z = parseInt(torreProfundidad.substring(1), 10); // Profundidad (Z)
    const parsedX = parseInt(x, 10); // Eje X
    const parsedY = parseInt(y, 10); // Eje Y

    return {
        torre,
        z,
        x: parsedX,
        y: parsedY,
        ubicacionOriginal: ubicacion
    };
};


// Función para filtrar el contenedor por ID ESTO ES LO NUEVO
export const filtrarContenedorPorId = (data, contenedorId) => {
    return data.find((contenedor) => contenedor.contenedor === contenedorId);
};