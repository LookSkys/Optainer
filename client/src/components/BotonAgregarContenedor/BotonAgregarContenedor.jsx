import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import useVerificarContenedorExistente from "../../hooks/useVerificarContenedorExistente";

export function BotonAgregarContenedor ({ setData, data}) {
    //ESTADOS
    //Estado para las funciones de mostrar y cerrar el modal de agregar
    const [showModalAgregar, setShowModalAgregar] = useState(false); 
    //Estados para los valores de los inputs del modal
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');

    const { verificarContenedorExistente, loading, error, existe } = useVerificarContenedorExistente(); // Usamos el hook

    //FUNCIONES
    //Funciones para mostrar y cerrar modal de agregar
    const handleShowAgregar = () => setShowModalAgregar(true);
    const handleCloseAgregar = () => setShowModalAgregar(false);    

    // Función para manejar el cambio en el primer input
    const handleInputChange1 = (event) => {
        setInputValue1(event.target.value);
    };

    // Función para manejar el cambio en el segundo input
    const handleInputChange2 = (event) => {
        setInputValue2(event.target.value);
    };    

    //Funcion para AGREGAR contenedor
    const handleAgregarContenedor = (event) => {
        event.preventDefault();
        
        // Log para ver los datos de los inputs por consola
        console.log("inputValue1:", inputValue1, "inputValue2:", inputValue2);
        
        // Se verifica si el contenedor ya existe antes de intentar agregarlo
        verificarContenedorExistente(inputValue1, inputValue2)
            .then(existe => {
                if (existe) {
                    // Si el contenedor ya existe se muestra el toast y no se hace el POST
                    toast.error('El contenedor ya existe', {
                        duration: 4000,
                        position: 'bottom-right',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    });
                    return console.log("El contenedor ya existe D:"); // Salimos de la función sin hacer el POST
                } 
    
                // Si no existe el contenedor en la BD se hace la solicitud POST
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
                    
                    // Toast con mensaje de éxito
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
            })
            .catch(error => {
                console.error("Error al verificar existencia del contenedor:", error); // Log del error
            });
    };

    return(
        <div>
            <button type="button" className="btn btn-danger" onClick={handleShowAgregar} style={{width:'40px', height:'40px', marginRight: '5px', borderRadius: '50%', alignItems:'center', padding: 0}}>
            <FaPlus />
            </button>

        {/* Modal del boton agregar */}
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
        <Toaster />
        </div>
    )
}