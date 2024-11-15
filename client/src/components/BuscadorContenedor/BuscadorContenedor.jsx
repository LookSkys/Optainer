import { FaSearch } from "react-icons/fa";
import './BuscadorContenedor.css'

export function BuscadorContenedor ({contenedorId, setContenedorId, filtrarContenedor}) {


    return(
        <div>
            <div className="col-md-14 d-flex align-items-center justify-content-center margen-abajo">
                <div className="d-flex align-items-center">
                    <input className="buscador-contenedor"
                        type="text"
                        placeholder="Ingresa el ID del contenedor"
                        value={contenedorId}
                        onChange={(e) => setContenedorId(e.target.value)}
                        />
                    <button className="boton-buscador-contenedor"
                        onClick={filtrarContenedor}
                        >
                        <FaSearch className="icono-buscar"/>
                    </button>
                </div>
            </div>            
        </div>
    )
}