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
