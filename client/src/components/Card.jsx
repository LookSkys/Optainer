//EJEMPLO DE COMPONENTE TARJETA
import React from 'react'
import "./Card.css"
import { Link } from 'react-router-dom'

function Card({title,description}) {
  return (
    <div className='Cardd'>
        <Link to={title}><h2>{title}</h2></Link>
        <p>{description}</p>
    </div>
  )
}

export default Card