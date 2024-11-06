import './BarraTorres.css'
import { FaAngleLeft,FaAngleRight } from 'react-icons/fa';

export function BarraTorres ({torreActual, anteriorTorre, siguienteTorre}) {
    return(
        <div className="barra-torres">
            <button className='boton-flecha' onClick={anteriorTorre}><FaAngleLeft /></button>
            <div className="torre-n">
                <h6 className='torre-texto'>TORRE {torreActual}</h6>
            </div>
            <button className='boton-flecha' onClick={siguienteTorre}><FaAngleRight /></button>
        </div>
    )
}