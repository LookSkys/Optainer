import React, { useEffect, useState } from "react";
import { BarraTorres } from "../components/BarraTorres/BarraTorres";
import { ContenedorAvanzado } from "../components/ContenedorAvanzado/ContenedorAvanzado";
import './MapaAvanzadoView.css'; // Importa el archivo CSS aquí
import { parseLocation, filtrarContenedorPorId } from "./utils"; // Importa las funciones desde utils

function MapaAvanzadoView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profundidadActual, setProfundidadActual] = useState(1);
    const [torreActual, setTorreActual] = useState('A'); // Nueva torre actual
    const [contenedorId, setContenedorId] = useState(""); // Estado para el ID del contenedor
    const [contenedorResaltado, setContenedorResaltado] = useState(""); // Estado para el contenedor resaltado
    const [showModalAgregar, setShowModalAgregar] = useState(false); // Estado para modal de agregar
    const [showModalQuitar, setShowModalQuitar] = useState(false); // Estado para modal de quitar

    const torres = ['A', 'B', 'C', 'D', 'E', 'F', 'G']; // Torres extendidas

    useEffect(() => {
        fetch("http://localhost:5000/api/contenedores")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Datos originales obtenidos:", data); // Log de datos obtenidos

                const parsedData = data.map((contenedor) => {
                    const ubicacion = contenedor.Ubicación || "";
                    const parsedUbicacion = parseLocation(ubicacion);
                    
                    console.log(`Contenedor ID: ${contenedor.Contenedor}, Ubicación: ${ubicacion}, Ubicación parseada:`, parsedUbicacion); // Log de cada contenedor y su ubicación
                    return {
                        ...contenedor,
                        ubicacionParseada: parsedUbicacion
                    };
                });

                console.log("Datos parseados:", parsedData); // Log de datos parseados
                setData(parsedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching contenedores:", error);
                setLoading(false);
            });
    }, []);

    const cambiarTorre = (nuevaTorre) => {
        setTorreActual(nuevaTorre);
        setContenedorResaltado(""); // Limpiar resaltado al cambiar de torre
        setContenedorId(""); // Limpiar ID del contenedor al cambiar de torre
    };

    const cambiarProfundidad = (nuevaProfundidad) => {
        setProfundidadActual(nuevaProfundidad);
    };

    const filtrarContenedor = () => {
        const contenedorEncontrado = filtrarContenedorPorId(data, contenedorId);
        if (contenedorEncontrado) {
            setTorreActual(contenedorEncontrado.ubicacionParseada.torre);
            setProfundidadActual(contenedorEncontrado.ubicacionParseada.z);
            setContenedorResaltado(contenedorId); // Resaltar contenedor encontrado
        } else {
            alert("Contenedor no encontrado");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data || data.length === 0) {
        return <div>No se encontraron contenedores.</div>;
    }

    const contenedoresFiltrados = data.filter(
        (contenedor) =>
            contenedor.ubicacionParseada.torre === torreActual &&
            contenedor.ubicacionParseada.z === profundidadActual
    );

    const gridSize = 5;
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));

    contenedoresFiltrados.forEach((contenedor) => {
        const { x, y } = contenedor.ubicacionParseada;
        if (x <= gridSize && y <= gridSize) {
            grid[y - 1][x - 1] = contenedor;
        }
    });

    const avanzarTorre = () => {
        setTorreActual((prevTorre) => {
            const currentIndex = torres.indexOf(prevTorre);
            return torres[(currentIndex + 1) % torres.length]; // Avanza entre las torres
        });
        setContenedorId(""); // Limpiar ID del contenedor al cambiar de torre
        setContenedorResaltado(""); // Limpiar resaltado al cambiar de torre
    };

    const retrocederTorre = () => {
        setTorreActual((prevTorre) => {
            const currentIndex = torres.indexOf(prevTorre);
            return torres[(currentIndex - 1 + torres.length) % torres.length]; // Retrocede entre las torres
        });
        setContenedorId(""); // Limpiar ID del contenedor al cambiar de torre
        setContenedorResaltado(""); // Limpiar resaltado al cambiar de torre
    };

    const handleShowAgregar = () => setShowModalAgregar(true);
    const handleCloseAgregar = () => setShowModalAgregar(false);
    const handleShowQuitar = () => setShowModalQuitar(true);
    const handleCloseQuitar = () => setShowModalQuitar(false);

    return (
        <div style={{ marginLeft: '95px' }}>
            <h2>VISTA AVANZADA</h2>
            <BarraTorres torreActual={torreActual} anteriorTorre={retrocederTorre} siguienteTorre={avanzarTorre} />

            <div className="row">
                <div className="col">
                    <div className="d-flex align-items-center">
                        <h6 style={{ marginLeft: '10px', marginRight: '15px' }}>Buscar contenedor por ID:</h6>
                        <input
                            type="text"
                            placeholder="Ingresa el ID del contenedor"
                            value={contenedorId}
                            onChange={(e) => setContenedorId(e.target.value)}
                        />
                        <button onClick={filtrarContenedor}>Buscar</button>
                    </div>
                </div>
                <div className="col">
                    <button type="button" className="btn btn-danger" onClick={handleShowAgregar}>
                        ➕ Agregar contenedor
                    </button>
                    {showModalAgregar && (
                        <>
                            <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5">Agregar contenedor</h1>
                                            <button type="button" className="btn-close" onClick={handleCloseAgregar} aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <h6>ID</h6>
                                            <input type="text" placeholder="Ingresa el ID del contenedor" />
                                            <h6 style={{ marginTop: '12px' }}>Ubicacion</h6>
                                            <input type="text" placeholder="Ingresa la ubicación del contenedor" />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={handleCloseAgregar}>
                                                Cerrar
                                            </button>
                                            <button type="button" className="btn btn-success">Agregar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-backdrop fade show" onClick={handleCloseAgregar}></div>
                        </>
                    )}
                </div>
                <div className="col">
                    <button type="button" className="btn btn-danger" onClick={handleShowQuitar}>
                        ➖ Quitar contenedor
                    </button>
                    {showModalQuitar && (
                        <>
                            <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5">Quitar contenedor</h1>
                                            <button type="button" className="btn-close" onClick={handleCloseQuitar} aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <h6>ID</h6>
                                            <input type="text" placeholder="Ingresa el ID del contenedor" />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={handleCloseQuitar}>
                                                Cerrar
                                            </button>
                                            <button type="button" className="btn btn-danger">Quitar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-backdrop fade show" onClick={handleCloseQuitar}></div>
                        </>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="col-1">
                    {[5, 4, 3, 2, 1].map((num) => (
                        <h2 key={num}>{num}</h2>
                    ))}
                </div>
                <div className="col-10">
                    <div className="grid-container">
                        {grid.slice().reverse().map((row, rowIndex) => (
                            <div key={rowIndex} className="grid-row">
                                {row.map((contenedor, colIndex) => (
                                    <div
                                        key={colIndex}
                                        className={`grid-cell ${
                                            contenedor && contenedor._id === contenedorResaltado ? "resaltado" : ""
                                        }`}
                                    >
                                        {contenedor ? (
                                            <ContenedorAvanzado contenedor={contenedor} />
                                        ) : (
                                            <div className="grid-cell-placeholder"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-1">
                    {[5, 4, 3, 2, 1].map((num) => (
                        <h2 key={num}>{num}</h2>
                    ))}
                </div>
            </div>

            <div className="row justify-content-center">
                {[1, 2, 3].map((num) => (
                    <button
                        key={num}
                        type="button"
                        className={`btn btn-${num === profundidadActual ? "primary" : "secondary"} mx-2`}
                        onClick={() => cambiarProfundidad(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MapaAvanzadoView;
