import React from "react";
import { BarraTorres } from "../components/BarraTorres/BarraTorres";
import { ContenedorAvanzado } from "../components/ContenedorAvanzado/ContenedorAvanzado";

function MapaAvanzadoView () {
    return (
        <div>
            <h2>MAPA AVANZADO</h2> 
            <BarraTorres />
        {/* Fila 5 */}
        <div className="row align-items-center">
            <div className="col-auto">
                <h2 style={{ marginRight: '1px' }}>5</h2>
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto">
                <ContenedorAvanzado />
            </div>
        </div>
        {/* Fila 4 */}
        <div className="row align-items-center"style={{ marginTop: '10px' }}>
            <div className="col-auto">
                <h2 style={{ marginRight: '1px' }}>4</h2>
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto">
                <ContenedorAvanzado />
            </div>
        </div>
        {/* Fila 3 */}
        <div className="row align-items-center" style={{ marginTop: '10px' }}>
            <div className="col-auto">
                <h2 style={{ marginRight: '1px' }}>3</h2>
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto">
                <ContenedorAvanzado />
            </div>
        </div>
        {/* Fila 2 */}
        <div className="row align-items-center" style={{ marginTop: '10px' }}>
            <div className="col-auto">
                <h2 style={{ marginRight: '1px' }}>2</h2>
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto">
                <ContenedorAvanzado />
            </div>
        </div>
        {/* Fila 1 */}
        <div className="row align-items-center" style={{ marginTop: '10px' }}>
            <div className="col-auto">
                <h2 style={{ marginRight: '4px' }}>1</h2>
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto" >
                <ContenedorAvanzado />
            </div>
            <div className="col-auto">
                <ContenedorAvanzado />
            </div>
        </div>
        </div>
      )
}

export default MapaAvanzadoView