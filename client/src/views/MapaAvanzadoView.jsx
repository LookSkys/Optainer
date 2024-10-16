import React, { useEffect, useState } from "react";
import { BarraTorres } from "../components/BarraTorres/BarraTorres";
import { ContenedorAvanzado } from "../components/ContenedorAvanzado/ContenedorAvanzado";
import './MapaAvanzadoView.css'; // Importa el archivo CSS aquí
import { parseLocation } from "./utils";

function MapaAvanzadoView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profundidadActual, setProfundidadActual] = useState(1);
    const [torreActual, setTorreActual] = useState('A'); // Nueva torre actual

    // Array con las torres extendidas
    const torres = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    useEffect(() => {
        fetch("http://localhost:5000/api/contenedores")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const parsedData = data.map((contenedor) => ({
                    ...contenedor,
                    ubicacionParseada: parseLocation(contenedor.ubicacion)
                }));
                setData(parsedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching contenedores:", error);
                setLoading(false);
            });
    }, []);

    // Función para cambiar la torre
    const cambiarTorre = (nuevaTorre) => {
        setTorreActual(nuevaTorre);
    };

    // Función para cambiar la profundidad
    const cambiarProfundidad = (nuevaProfundidad) => {
        setProfundidadActual(nuevaProfundidad);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data || data.length === 0) {
        return <div>No se encontraron contenedores.</div>;
    }

    // Filtrar los contenedores que correspondan a la torre y profundidad actual
    const contenedoresFiltrados = data.filter(
        (contenedor) =>
            contenedor.ubicacionParseada.torre === torreActual &&
            contenedor.ubicacionParseada.z === profundidadActual
    );

    // Crear la cuadrícula
    const gridSize = 5;
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

    // Asignar contenedores a la cuadrícula
    contenedoresFiltrados.forEach((contenedor) => {
        const { x, y } = contenedor.ubicacionParseada;
        if (x <= gridSize && y <= gridSize) {
            grid[y - 1][x - 1] = contenedor;
        }
    });

    // Función para cambiar la torre (avanzar)
    const avanzarTorre = () => {
        setTorreActual((prevTorre) => {
            const currentIndex = torres.indexOf(prevTorre);
            return torres[(currentIndex + 1) % torres.length]; // Avanza en el array de torres
        });
    };

    // Función para cambiar la torre (retroceder)
    const retrocederTorre = () => {
        setTorreActual((prevTorre) => {
            const currentIndex = torres.indexOf(prevTorre);
            return torres[(currentIndex - 1 + torres.length) % torres.length]; // Retrocede en el array de torres
        });
    };

    return (
        <div>
            <h1>Vista Avanzada de Contenedores</h1>
            
            {/* Título de la torre con botones para cambiar */}
            <div>
                <button onClick={retrocederTorre}>Anterior Torre</button>
                <h2>Torre {torreActual}</h2>
                <button onClick={avanzarTorre}>Siguiente Torre</button>
            </div>

            {/* Botones de profundidad */}
            <div>
                {[1, 2, 3].map((nivel) => (
                    <button
                        key={nivel}
                        onClick={() => cambiarProfundidad(nivel)}
                        disabled={profundidadActual === nivel}
                    >
                        Profundidad {nivel}
                    </button>
                ))}
            </div>

            {/* Cuadrícula 2D con el eje Y invertido */}
            <div className="grid-container">
                {grid.slice().reverse().map((fila, filaIndex) => ( // Invierte las filas aquí
                    <div key={filaIndex} className="grid-row">
                        {fila.map((contenedor, colIndex) => (
                            <div key={colIndex} className="grid-cell">
                                {contenedor ? (
                                    <>
                                        <div>ID: {contenedor.contenedor}</div>
                                        <div>Ubicación: {contenedor.ubicacionParseada.ubicacionOriginal}</div>
                                    </>
                                ) : (
                                    "Vacío"
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Componentes adicionales */}
            <BarraTorres />
            <ContenedorAvanzado />
        </div>
    );
}

export default MapaAvanzadoView;
