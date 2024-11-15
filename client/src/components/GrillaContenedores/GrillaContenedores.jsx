export function GrillaContenedores ({grid, contenedorResaltado}) {

    return(
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
    )
}