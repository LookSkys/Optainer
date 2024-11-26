import { useEffect, useState } from "react";
import { parseLocation, filtrarContenedorPorId } from "../../utilities/FormatUbicacion"; // Importa las funciones desde utils ACA SE AGREGA LA FUNCION DE FILTRAR POR ID
//import de componentes
import { BotonAgregarContenedor, BarraTorres, BotonEliminarContenedor, BuscadorContenedor, NumerosLateralDerecha, NumerosAbajo, BotonesProfundidad, GrillaContenedores } from "../../components";
import HoraActual from "../../components/HoraActual/HoraActual";


function MapaAvanzadoView({socket}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profundidadActual, setProfundidadActual] = useState(1);
    const [torreActual, setTorreActual] = useState('A'); // Nueva torre actual
    const [contenedorId, setContenedorId] = useState(""); // Estado para el ID del contenedor ESTO SE AGREGA
    const [contenedorResaltado, setContenedorResaltado] = useState(""); // Estado para el contenedor resaltado ESTO SE AGREGA

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
                        return dataActual.filter(c => c.contenedor !== idEliminar);
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
    
    //FUNCIONES
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
        return <div className="d-flex justify-content-center">
        <div className="spinner-border text-danger mt-5" role="status">
          <span className="visually-hidden">Loading...</span>
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

    return (
        <div style={{marginLeft: '95px'}}>
            <div className="row">
                <div className="col"><h2>INVENTARIO AVANZADO</h2></div>
                <div className="col"><HoraActual /></div>
            </div>      
            <BarraTorres torreActual={torreActual} anteriorTorre={retrocederTorre} siguienteTorre={avanzarTorre}/>
            <div className="row">
                <div className="col">
                    <BuscadorContenedor contenedorId={contenedorId} setContenedorId={setContenedorId} filtrarContenedor={filtrarContenedor}/>
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <BotonAgregarContenedor setData={setData} data={data}/> 
                    <BotonEliminarContenedor setData={setData} data={data} contenedorID={contenedorId}/>
                </div>
            </div>
            <div className="row">
                <NumerosLateralDerecha />
                <div className="col-10">
                    <GrillaContenedores grid={grid} contenedorResaltado={contenedorResaltado}/>
                    <NumerosAbajo />
                </div>
                <BotonesProfundidad profundidadActual={profundidadActual} cambiarProfundidad={cambiarProfundidad}/>
            </div>
        </div>
    );
}

export default MapaAvanzadoView;