import { useState } from "react";
import { FaTruckMoving } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

export function BotonEliminarContenedor ({verificarContenedorExistente, setData, data}) {
    //ESTADOS
    //Estado para las funciones de mostrar y cerrar el modal de eliminar
    const [showModalQuitar, setShowModalQuitar] = useState(false); 
    //Estado para el valor del input del modal
    const [inputValue3, setInputValue3] = useState('');
    //Estado para el ID del contenedor 
    const [contenedorId, setContenedorId] = useState(""); 

    //FUNCIONES
    //Funciones para mostrar y cerrar modal de eliminar
    const handleShowQuitar = () => setShowModalQuitar(true);
    const handleCloseQuitar = () => setShowModalQuitar(false);

    // Función para manejar el cambio del input
    const handleInputChange3 = (event) => {
        setInputValue3(event.target.value);
    };

    //Funcion para ELIMINAR contenedor
    const handleQuitarContenedor = (event) => {
        event.preventDefault();
        console.log("Intentando quitar contenedor con ID:", inputValue3); // Log antes de la solicitud
    
        // La funcion recibe solo un input, el segundo recibe undefined
        verificarContenedorExistente(inputValue3)
        .then(existe => {
            if (!existe) {
                // Si el contenedor no existe, se muestra el toast y no se hace el DELETE con el contenedor
                toast.error('El contenedor NO existe', {
                    duration: 4000,
                    position: 'bottom-right',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
                return console.log("El contenedor no existe D:"); // Salimos de la funcion sin hacer el DELETE
            }
             
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
        })
        .catch(error => console.error("Error eliminando contenedor:", error));
    };

    return(
        <div>
        <button type="button" className="btn btn-danger" onClick={handleShowQuitar} style={{width:'40px', height:'40px',borderRadius: '50%', alignItems: 'center', padding: 0}}>
            <FaTruckMoving />
        </button>

        {/* Modal del boton eliminar */}
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
    <Toaster />                    
        </div>
    )
}