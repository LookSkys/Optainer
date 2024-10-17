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
        <div style={{marginLeft: '95px'}}>
            <h2>VISTA AVANZADA</h2>
            <BarraTorres torreActual={torreActual} anteriorTorre={retrocederTorre} siguienteTorre={avanzarTorre}/>
            {/* Título de la torre con botones para cambiar */}
            
            {/* Botones de profundidad */}
            {/* <div>
                {[1, 2, 3].map((nivel) => (
                    <div className="row">
                    <button type="button" className="btn btn-danger boton-profundidad "
                        key={nivel}
                        onClick={() => cambiarProfundidad(nivel)}
                        disabled={profundidadActual === nivel}
                    >
                        {nivel}
                    </button>
                    </div>
                ))}
            </div> */}
            

            {/* Cuadrícula 2D con el eje Y invertido */}
            <div className="row">
                <div className="col-1">
                    <br /><h2>5</h2> <br /><br /><br />
                    <h2>4</h2> <br /><br /><br />
                    <h2>3</h2> <br /><br /><br />
                    <h2>2</h2> <br /> <br /> <br />
                    <h2>1</h2> 
                </div>
                <div className="col-10">
                    <div className="grid-container">
                    {grid.slice().reverse().map((fila, filaIndex) => ( // Invierte las filas aquí
                        <div key={filaIndex} className="grid-row">
                            {fila.map((contenedor, colIndex) => (
                                <div key={colIndex} className="grid-cell">
                                    {contenedor ? (
                                        <>
                                            <div>Contenedor: <br /> {contenedor.contenedor}</div>
                                            <div> <br />Ubicación: <br /> {contenedor.ubicacionParseada.ubicacionOriginal}</div>
                                        </>
                                    ) : (
                                        "Vacío"
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                    </div>
                    {/* Fila con numeros abajo */}
                    <div className="row">
                        <div className="col text-center">
                            <h2>1</h2>
                        </div>
                        <div className="col text-center">
                            <h2>2</h2>
                        </div>
                        <div className="col text-center">
                            <h2>3</h2>
                        </div>
                        <div className="col text-center">
                            <h2>4</h2>
                        </div>
                        <div className="col text-center">
                            <h2>5</h2>
                        </div>
                    </div>
                </div>
                <div className="col-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div>
                    {[1, 2, 3].map((nivel) => (
                        <div className="row">
                        <button type="button" className="btn btn-danger boton-profundidad "
                            key={nivel}
                            onClick={() => cambiarProfundidad(nivel)}
                            disabled={profundidadActual === nivel}
                        >
                            {nivel}
                        </button>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        
        </div>
    );
}

export default MapaAvanzadoView;
