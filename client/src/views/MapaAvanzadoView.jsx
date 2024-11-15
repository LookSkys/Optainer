import { useEffect, useState } from "react";
import { BarraTorres } from "../components/BarraTorres/BarraTorres";
import './MapaAvanzadoView.css'; // Importa el archivo CSS aquí
import { parseLocation, filtrarContenedorPorId } from "./utils"; // Importa las funciones desde utils ACA SE AGREGA LA FUNCION DE FILTRAR POR ID
import { FaSearch, FaPlus, FaTruckMoving } from "react-icons/fa";
import {Toaster, toast} from 'react-hot-toast'

function MapaAvanzadoView({socket}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profundidadActual, setProfundidadActual] = useState(1);
    const [torreActual, setTorreActual] = useState('A'); // Nueva torre actual
    const [contenedorId, setContenedorId] = useState(""); // Estado para el ID del contenedor ESTO SE AGREGA
    const [contenedorResaltado, setContenedorResaltado] = useState(""); // Estado para el contenedor resaltado ESTO SE AGREGA
    const [showModalAgregar, setShowModalAgregar] = useState(false); //Estado para las funciones de mostrar y cerrar el modal de agregar
    const [showModalQuitar, setShowModalQuitar] = useState(false);  //Estado para las funciones de mostrar y cerrar el modal de quitar
    // Estado para almacenar los valores de los dos inputs
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [inputValue3, setInputValue3] = useState('');


    // Array con las torres extendidas
    const torres = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    useEffect(() => {
        fetch("https://backend-production-d707.up.railway.app/api/contenedores")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const parsedData = data.map((contenedor) => {
                    console.log("Ubicación de contenedor antes de parsear:", contenedor.ubicacion);
                    const ubicacionParseada = parseLocation(contenedor.ubicacion);
                    if (!ubicacionParseada) {
                        console.warn("Ubicación no parseada para contenedor:", contenedor);
                        return null;  // Manejo de valor nulo
                    }
                    return {
                        ...contenedor,
                        ubicacionParseada
                    };
                }).filter(Boolean); // Filtra valores nulos
                setData(parsedData);
                setLoading(false);
                console.log("Datos de contenedores obtenidos:", parsedData);
            })
            .catch((error) => {
                console.error("Error fetching contenedores:", error);
                setLoading(false);
            });
    }, []);
    
    

    useEffect(() => {
        if (socket) {
            socket.on('contenedorActualizado', (nuevoContenedor) => {
                console.log("Contenedor actualizado recibido:", nuevoContenedor);
                
                if (nuevoContenedor.tipo === "eliminar") {
                    const idEliminar = nuevoContenedor.id;
                    console.log("ID del contenedor a eliminar:", idEliminar);
    
                    setData((dataActual) => {
                        // Busca el contenedor en data usando el ID para obtener su ubicación
                        const contenedorAEliminar = dataActual.find(c => c.contenedor === idEliminar);
    
                        if (contenedorAEliminar) {
                            const ubicacionAEliminar = contenedorAEliminar.ubicacion;
                            console.log("Ubicación del contenedor a eliminar:", ubicacionAEliminar);
    
                            // Filtrar data para eliminar el contenedor según la ubicación en lugar del ID
                            return dataActual.filter(c => c.ubicacion !== ubicacionAEliminar);
                        } else {
                            console.warn("Contenedor con ID no encontrado para eliminación:", idEliminar);
                            return dataActual; // Sin cambios si no encuentra el ID
                        }
                    });
                    console.log("Contenedor eliminado con ID:", idEliminar);
                    return;
                }


                // Acceder al objeto interno dentro de `nuevoContenedor`
                const { Contenedor, Ubicación, Zona, Visado, _id } = nuevoContenedor.contenedor || {};
    
                // Crear el objeto normalizado
                const contenedorNormalizado = {
                    contenedor: Contenedor,
                    ubicacion: Ubicación,
                    zona: Zona,
                    visado: Visado,
                    _id: _id,
                };
    
                console.log("Contenedor después de normalización:", contenedorNormalizado);
                console.log("Ubicación recibida para parseo Socket:", contenedorNormalizado.ubicacion);
    
                // Validar si `ubicacion` está definido
                if (!contenedorNormalizado.ubicacion) {
                    console.warn("Ubicación no definida después de la normalización. No se puede parsear.");
                    return;
                }
    
                const ubicacionParseada = parseLocation(contenedorNormalizado.ubicacion);
                if (!ubicacionParseada) {
                    console.warn("Ubicación inválida para contenedor:", contenedorNormalizado);
                    return;
                }
    
                setData((dataActual) => {
                    const index = dataActual.findIndex(c => c.contenedor === contenedorNormalizado.contenedor);
    
                    if (index >= 0) {
                        // Si el contenedor existe, actualiza su ubicación
                        const nuevaData = [...dataActual];
                        nuevaData[index] = {
                            ...contenedorNormalizado,
                            ubicacionParseada
                        };
                        return nuevaData;
                    } else {
                        // Si es un nuevo contenedor, agrégalo
                        return [...dataActual, {
                            ...contenedorNormalizado,
                            ubicacionParseada
                        }];
                    }
                });
            });
        }
        return () => {
            if (socket) {
                socket.off('contenedorActualizado');
            }
        };
    }, [socket]);
    
    
    
    
    
      

    // Función para cambiar la torre
    // const cambiarTorre = (nuevaTorre) => {
    //     setTorreActual(nuevaTorre);
    //     setContenedorResaltado(""); // Restablecer el contenedor resaltado al cambiar de torre ESTO SE AGREGA
    //     setContenedorId(""); // Limpiar el ID del contenedor al cambiar de torre ESTO SE AGREGA
    // };

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
            console.log("Contenedor encontrado:", contenedorEncontrado); // Log del contenedor encontrado
        } else {
            alert("Contenedor no encontrado");
            console.warn("Contenedor no encontrado con ID:", contenedorId); // Log de contenedor no encontrado
        }
    };

    if (loading) {
        return <div class="d-flex justify-content-center">
        <div class="spinner-border text-danger mt-5" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>;
    }

    if (!data || data.length === 0) {
        return <div>No se encontraron contenedores.</div>;
    }

    // Filtrar los contenedores que correspondan a la torre y profundidad actual
    const contenedoresFiltrados = data.filter((contenedor) => {
        if (contenedor.ubicacionParseada) {
            return contenedor.ubicacionParseada.torre === torreActual &&
                contenedor.ubicacionParseada.z === profundidadActual;
        }
        return false;
    });

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

    //Funciones para el cambio del texto de los inputs del modal de AGREGAR/ELIMINAR CONTENEDOR
        // Función para manejar el cambio en el primer input
        const handleInputChange1 = (event) => {
            setInputValue1(event.target.value);
        };

        // Función para manejar el cambio en el segundo input
        const handleInputChange2 = (event) => {
            setInputValue2(event.target.value);
        };

        // Función para manejar el cambio en el tercer input
        const handleInputChange3 = (event) => {
            setInputValue3(event.target.value);
        };
        
    //FUNCIONES PARA AGREGAR Y QUITAR CONTENEDORES DE LA BD
    //AGREGAR
    const handleAgregarContenedor = (event) => {
        event.preventDefault();
        
        // Agrega un log para verificar los valores de los inputs
        console.log("inputValue1:", inputValue1, "inputValue2:", inputValue2);
        
        const nuevoContenedor = {
            contenedor: inputValue1,
            ubicacion: inputValue2
        };
        
        console.log("Intentando agregar contenedor:", nuevoContenedor); // Log antes de hacer la solicitud
        console.log("Ubicación del contenedor a agregar:", nuevoContenedor.ubicacion);
        fetch("https://backend-production-d707.up.railway.app/api/contenedores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoContenedor)
            
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al agregar contenedor');
            }
            return response.json();
        })
        .then(data => {
            setData(prevData => [...prevData, data]); // Usamos prevData para evitar un posible error de estado
            setInputValue1("");
            setInputValue2("");
            handleCloseAgregar(); // Cierra el modal después de actualizar
            //Toast con mensaje de exito 
            toast.success('Contenedor agregado correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        })
        .catch(error => {
            console.error("Error agregando contenedor:", error); // Log del error
        });
    };
    

    //QUITAR
    const handleQuitarContenedor = (event) => {
        event.preventDefault();
        console.log("Intentando quitar contenedor con ID:", inputValue3); // Log antes de la solicitud
    
        fetch(`https://backend-production-d707.up.railway.app/api/contenedores/${inputValue3}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar contenedor');
            }
            return response.json();
        })
        .then(() => {
            // Filtramos el contenedor eliminado de los datos que tenemos en el estado
            setData(prevData => prevData.filter(contenedor => contenedor.id !== contenedorId));
            setInputValue3("");
            handleCloseQuitar(); // Cierra el modal después de eliminar
            //Toast con mensaje de exito 
            toast('Contenedor eliminado correctamente', {
                duration: 4000,
                position: 'bottom-right',
                // Custom Icon
                icon: '🗑️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        })
        .catch(error => console.error("Error eliminando contenedor:", error));
    };
    
    

    return (
        <div style={{marginLeft: '95px'}}>
            <h2>INVENTARIO AVANZADO</h2>
            <BarraTorres torreActual={torreActual} anteriorTorre={retrocederTorre} siguienteTorre={avanzarTorre}/>
            <div className="row">
    {/* Buscador centrado */}
    <div className="col-md-6 d-flex align-items-center justify-content-center" style={{ marginBottom: '20px' }}>
        <div className="d-flex align-items-center">
            <input
                type="text"
                placeholder="Ingresa el ID del contenedor"
                value={contenedorId}
                onChange={(e) => setContenedorId(e.target.value)}
                style={{
                    padding: '8px 12px',
                    borderRadius: '30px',
                    border: '1px solid #ccc',
                    marginRight: '10px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    width: '250px',
                }}
            />
            <button
                onClick={filtrarContenedor}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1d1e1e',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: 0,
                    overflow: 'hidden',
                }}
            >
                <FaSearch style={{ fontSize: '20px', margin: 0 }} />
            </button>
        </div>
    </div>

    {/* Botones a la derecha */}
    <div className="col-md-6 d-flex justify-content-center align-items-center">
        <button type="button" className="btn btn-danger" onClick={handleShowAgregar} style={{width:'40px', height:'40px', marginRight: '5px', borderRadius: '50%', alignItems:'center', padding: 0}}>
            <FaPlus />
        </button>
        <button type="button" className="btn btn-danger" onClick={handleShowQuitar} style={{width:'40px', height:'40px',borderRadius: '50%', alignItems: 'center', padding: 0}}>
            <FaTruckMoving />
        </button>
    </div>

    {/* Modales de Agregar y Quitar */}
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
                            <form onSubmit={handleAgregarContenedor}>
                                <div className="mb-3">
                                <label htmlFor="inputData1" className="form-label">ID:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputData1"
                                    value={inputValue1}
                                    onChange={handleInputChange1}
                                    required
                                />
                                </div>
                                <div className="mb-3">
                                <label htmlFor="inputData2" className="form-label">Ubicacion:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputData2"
                                    value={inputValue2}
                                    onChange={handleInputChange2}
                                    required
                                />
                                </div>
                                <button type="submit" className="btn btn-success">Agregar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={handleCloseAgregar}></div>
        </>
    )}

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
                            <form onSubmit={handleQuitarContenedor}>
                                <div className="mb-3">
                                <label htmlFor="inputData3" className="form-label">ID:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputData3"
                                    value={inputValue3}
                                    onChange={handleInputChange3}
                                    required
                                />
                                </div>
                                <button type="submit" className="btn btn-danger">Quitar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={handleCloseQuitar}></div>
        </>
    )}
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
            <Toaster />
        </div>
    );
}

export default MapaAvanzadoView;
