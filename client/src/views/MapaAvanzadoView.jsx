import React, { useEffect, useState } from "react";
import { BarraTorres } from "../components/BarraTorres/BarraTorres";
import { ContenedorAvanzado } from "../components/ContenedorAvanzado/ContenedorAvanzado";
import './MapaAvanzadoView.css'; // Importa el archivo CSS aquí
import { parseLocation, filtrarContenedorPorId } from "./utils"; // Importa las funciones desde utils ACA SE AGREGA LA FUNCION DE FILTRAR POR ID


function MapaAvanzadoView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profundidadActual, setProfundidadActual] = useState(1);
    const [torreActual, setTorreActual] = useState('A'); // Nueva torre actual
    const [contenedorId, setContenedorId] = useState(""); // Estado para el ID del contenedor ESTO SE AGREGA
    const [contenedorResaltado, setContenedorResaltado] = useState(""); // Estado para el contenedor resaltado ESTO SE AGREGA
    const [showModalAgregar, setShowModalAgregar] = useState(false); //Estado para las funciones de mostrar y cerrar el modal de agregar
    const [showModalQuitar, setShowModalQuitar] = useState(false);  //Estado para las funciones de mostrar y cerrar el modal de quitar


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
        setContenedorResaltado(""); // Restablecer el contenedor resaltado al cambiar de torre ESTO SE AGREGA
        setContenedorId(""); // Limpiar el ID del contenedor al cambiar de torre ESTO SE AGREGA
    };

    // Función para cambiar la profundidad
    const cambiarProfundidad = (nuevaProfundidad) => {
        setProfundidadActual(nuevaProfundidad);

    };

    // Función de filtrado TODA ESTA FUNCION
    const filtrarContenedor = () => {
        const contenedorEncontrado = filtrarContenedorPorId(data, contenedorId);
        if (contenedorEncontrado) {
            setTorreActual(contenedorEncontrado.ubicacionParseada.torre);
            setProfundidadActual(contenedorEncontrado.ubicacionParseada.z);
            setContenedorResaltado(contenedorId); // Establecer el contenedor resaltado
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
        setContenedorId(""); // Limpiar el ID del contenedor al cambiar de torre ESTO SE AGREGA
        setContenedorResaltado(""); // Restablecer el contenedor resaltado al cambiar de torre ESTO SE AGREGA
    };

    // Función para cambiar la torre (retroceder)
    const retrocederTorre = () => {
        setTorreActual((prevTorre) => {
            const currentIndex = torres.indexOf(prevTorre);
            return torres[(currentIndex - 1 + torres.length) % torres.length]; // Retrocede en el array de torres
        });
        setContenedorId(""); // Limpiar el ID del contenedor al cambiar de torre ESTO SE AGREGA
        setContenedorResaltado(""); // Restablecer el contenedor resaltado al cambiar de torre ESTO SE AGREGA        
    };

    //Funciones para mostrar y cerrar modal de agregar
    const handleShowAgregar = () => setShowModalAgregar(true);
    const handleCloseAgregar = () => setShowModalAgregar(false);

    //Funciones para mostrar y cerrar modal de quitar
    const handleShowQuitar = () => setShowModalQuitar(true);
    const handleCloseQuitar = () => setShowModalQuitar(false);

    return (
        <div style={{marginLeft: '95px'}}>
            <h2>VISTA AVANZADA</h2>
            <BarraTorres torreActual={torreActual} anteriorTorre={retrocederTorre} siguienteTorre={avanzarTorre}/>

                <div className="row">
                    <div className="col">
                    {/* Campo de búsqueda para el ID del contenedor ESTE ES EL BOTON DE FILTRADO CON EL TEXTFIELD */}
                    <div className="d-flex align-items-center">
                    <h6 style={{marginLeft:'10px',marginRight:'15px'}}>Buscar contenedor por ID:</h6>
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
                {/* BOTONES PARA AGREGAR Y QUITAR CONTENEDORES */}
                {/* Botón para mostrar el modal de Agregar */}
                <button type="button" className="btn btn-danger" onClick={handleShowAgregar}>
                    ➕ Agregar contenedor
                </button>                
                {/* Modal de Agregar contenedor */}
                {showModalAgregar && (
                    <>
                        <div className="modal show fade d-block" tabIndex="-1" style={{ display: 'block' }} role="dialog">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5">Agregar contenedor</h1>
                                        <button type="button" className="btn-close" onClick={handleCloseAgregar} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Contenido del modal */}
                                        <h6>ID</h6>
                                        <input
                                        type="text"
                                        placeholder="Ingresa el ID del contenedor"                                    
                                        />
                                        <h6 style={{marginTop: '12px'}}>Ubicacion</h6>
                                        <input
                                        type="text"
                                        placeholder="Ingresa el ID del contenedor"                                    
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseAgregar}>
                                            Cerrar
                                        </button>
                                        <button type="button" className="btn btn-success">
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Modal backdrop */}
                        <div className="modal-backdrop fade show" onClick={handleCloseAgregar}></div>
                    </>
                )}
                    </div>
                    <div className="col">
                    {/* Botón para mostrar el modal de Quitar */}
                <button type="button" className="btn btn-danger" onClick={handleShowQuitar}>
                    ➖ Quitar contenedor
                </button>               
                {/* Modal de Quitar contenedor */}
                {showModalQuitar && (
                    <>
                        <div className="modal show fade d-block" tabIndex="-1" style={{ display: 'block' }} role="dialog">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5">Quitar contenedor</h1>
                                        <button type="button" className="btn-close" onClick={handleCloseQuitar} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        {/* Contenido del modal */}
                                        <h6>ID</h6>
                                        <input
                                        type="text"
                                        placeholder="Ingresa el ID del contenedor"                                    
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseQuitar}>
                                            Cerrar
                                        </button>
                                        <button type="button" className="btn btn-danger">
                                            Quitar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Modal backdrop */}
                        <div className="modal-backdrop fade show" onClick={handleCloseQuitar}></div>
                    </>
                )}
            
                    </div>
                </div>





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
                {grid.slice().reverse().map((fila, filaIndex) => (
                    <div key={filaIndex} className="grid-row">
                        {fila.map((contenedor, colIndex) => {
                            const isHighlighted = contenedor && contenedor.contenedor === contenedorResaltado; // Comprobar si es el contenedor resaltado DESDE ACA
                            return (
                                <div
                                    key={colIndex}
                                    className={`grid-cell ${isHighlighted ? "highlight" : ""}`} // Aplicar clase 'highlight' si es el contenedor buscado HASTA ACA
                                >
                                    {contenedor ? (
                                        <>
                                            <div>ID: {contenedor.contenedor}</div>
                                            <div>Ubicación: {contenedor.ubicacionParseada.ubicacionOriginal}</div>
                                        </>
                                    ) : (
                                        "Vacío"
                                    )}
                                </div>
                            );
                        })}
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
                            <div className="row" key={nivel}>
                                <button 
                                    type="button" 
                                    className={`btn boton-profundidad ${profundidadActual === nivel ? 'boton-seleccionado' : 'boton-no-seleccionado'}`}
                                    onClick={() => cambiarProfundidad(nivel)}
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
