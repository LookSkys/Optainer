import React, { useEffect, useState } from "react";
import { BarraTorres } from "../components/BarraTorres/BarraTorres";
import { ContenedorAvanzado } from "../components/ContenedorAvanzado/ContenedorAvanzado";

function MapaAvanzadoView() {
    // Estado para almacenar los datos de los contenedores
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para saber si está cargando

    // Fetch para obtener los datos desde la API al montar el componente
    useEffect(() => {
        console.log("Fetching data from API...");

        fetch("http://localhost:5000/api/contenedores")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Data fetched successfully:", data); // Log de los datos obtenidos
                setData(data);
                setLoading(false); // Dejar de mostrar el mensaje de carga
            })
            .catch((error) => {
                console.error("Error fetching contenedores:", error); // Mostrar el error si ocurre
                setLoading(false); // Para dejar de mostrar el mensaje de carga aunque haya error
            });
    }, []);

    // Si está cargando, mostrar el mensaje de carga
    if (loading) {
        return <div>Loading...</div>;
    }

    // Si no hay datos después de la carga, mostrar un mensaje de error
    if (!data || data.length === 0) {
        return <div>No se encontraron contenedores.</div>;
    }

    // Renderizado de los contenedores en la vista avanzada
    return (
        <div>
            <h1>Vista Avanzada de Contenedores</h1>
            <ul>
                {data.map((contenedor, index) => (
                    <li key={index}>
                        Contenedor ID: {contenedor.contenedor}, Ubicación: {contenedor.ubicacion}, Visado: {contenedor.visado}
                    </li>
                ))}
            </ul>
            {/* Aquí puedes agregar otros componentes como BarraTorres o ContenedorAvanzado */}
            <BarraTorres />
            <ContenedorAvanzado />
        </div>
    );
}

export default MapaAvanzadoView;
