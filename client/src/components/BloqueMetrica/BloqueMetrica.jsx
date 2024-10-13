import './BloqueMetrica.css'
import combustible from '../../assets/m-combustible.png'
import movimientos from '../../assets/m-movimientos.png'
import tiempo from '../../assets/m-tiempo.png'
import extraccion from '../../assets/m-extraccion.png'

const imagenes = {
    combustible:  combustible,
    movimientos: movimientos,
    tiempo: tiempo,
    extraccion: extraccion
}

export function BloqueMetrica ({imagen,nombreMetrica,cantidadMetrica,descripcionMetrica}) {
    const recImagen = imagenes[imagen]

    return(
        <>
        <div className='contenedor-metrica'>
        <div className="card border-dark card-custom">
            <div className="card-body">
                <img
                src={recImagen}
                alt="Imagen de la metrica"
                className="img-fluid mb-2" // Clase de Bootstrap para asegurar que la imagen sea responsiva
                />
                <h6 className="card-subtitle mb-2 ">{nombreMetrica}</h6>
                <h3 className="card-title fw-bold">{cantidadMetrica}</h3>
                <p  className="card-text ">
                    {descripcionMetrica}
                </p>
            </div>
        </div>

        </div>
        </>
    )
}
