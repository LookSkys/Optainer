import React from 'react'
import { BloqueMetrica } from '../components/BloqueMetrica/BloqueMetrica'
import { BloqueTareas } from '../components/BloqueTareas/BloqueTareas'

function MetricasView() {
  return (
    // margen a la izq para que no choque el sidebarlateral
    <div style={{marginLeft: '90px'}} >
      <h2>METRICAS</h2>
      <br />
      <div className='row g-0'>
        <div className='col'>
          <BloqueMetrica 
            imagen={'combustible'} 
            nombreMetrica={'Combustible Ahorrado'} 
            cantidadMetrica={'400 lt'} 
            descripcionMetrica={'12% de aumento respecto al mes pasado'}/>
        </div>
        <div className='col g-0'>
        <BloqueMetrica 
            imagen={'movimientos'} 
            nombreMetrica={'Numero de movimientos disminuidos'} 
            cantidadMetrica={'95/100'} 
            descripcionMetrica={'10% menos que el mes pasado'}/>
        </div>
        <div className='col g-0'>
        <BloqueMetrica 
            imagen={'tiempo'} 
            nombreMetrica={'Tiempo promedio de extraccion'} 
            cantidadMetrica={'200/100Hrs'} 
            descripcionMetrica={'8% de aumento respecto al mes pasado'}/>
        </div>
        <div className='col g-0'>
        <BloqueMetrica 
            imagen={'extraccion'} 
            nombreMetrica={'Numero de movimietos por extraccion'} 
            cantidadMetrica={'10/5'} 
            descripcionMetrica={'2% de aumento respecto al mes pasado'}/>
        </div>
      </div>
      <div className='row'>
        <div className="col">
          <BloqueTareas />
        </div>
        <div className="col"></div>
      </div>
    </div>
  )
}

export default MetricasView