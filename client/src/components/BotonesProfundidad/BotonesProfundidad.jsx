export function BotonesProfundidad ({profundidadActual, cambiarProfundidad}) {
    return(
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
    )
}