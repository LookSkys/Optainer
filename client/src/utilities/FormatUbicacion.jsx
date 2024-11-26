export const parseLocation = (ubicacion) => {
    //console.log("Ubicación recibida para parseo:", ubicacion);
    if (!ubicacion || typeof ubicacion !== 'string' || !ubicacion.includes('-')) {
        console.warn("Ubicación inválida detectada:", ubicacion);
        return null; // Retorna null si la ubicación no es válida
    }

    const [torreProfundidad, , x, y] = ubicacion.split('-');
    const torre = torreProfundidad.charAt(0);
    const z = parseInt(torreProfundidad.substring(1), 10);

    return {
        torre,
        z,
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        ubicacionOriginal: ubicacion
    };
};


// Función para filtrar el contenedor por ID ESTO ES LO NUEVO
export const filtrarContenedorPorId = (data, contenedorId) => {
    return data.find((contenedor) => contenedor.contenedor === contenedorId);
};