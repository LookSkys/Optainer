import { useState } from "react";

const useVerificarContenedorExistente = () => {
    const [loading, setLoading] = useState(false); // Para manejar el estado de carga
    const [error, setError] = useState(null); // Para manejar errores
    const [existe, setExiste] = useState(false); // Estado para saber si el contenedor existe

    const verificarContenedorExistente = async (contenedor, ubicacion) => {
        setLoading(true); // Inicia la carga
        setError(null); // Limpia errores previos
        try {
            const response = await fetch("https://backend-production-d707.up.railway.app/api/contenedores");

            if (!response.ok) {
                throw new Error('Error al obtener contenedores');
            }

            const data = await response.json();
            const existeContenedor = data.some(item => item.contenedor === contenedor || item.ubicacion === ubicacion);

            setExiste(existeContenedor); // Actualiza el estado si existe o no
            return existeContenedor; // Devuelve el resultado
        } catch (error) {
            setError(error.message); // Captura y muestra el error
            return false; // Si hay error, retorna false
        } finally {
            setLoading(false); // Termina el estado de carga
        }
    };

    return {
        verificarContenedorExistente,
        loading,
        error,
        existe,
    };
};

export default useVerificarContenedorExistente;
