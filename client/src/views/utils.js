export const parseLocation = (ubicacion) => {
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