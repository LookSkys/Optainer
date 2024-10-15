import './BarraTorres.css'
import { FaAngleLeft,FaAngleRight } from 'react-icons/fa';

export function BarraTorres () {
    return(
        <div className="barra-torres">
            <button className='boton-flecha'><FaAngleLeft /></button>
            <div className="torre-n">
                <h6 className='torre-texto'>TORRE A</h6>
            </div>
            <button className='boton-flecha'><FaAngleRight /></button>
        </div>
    )
}