import React, { useState, useEffect } from 'react';

const HoraActual = () => {
  const [hora, setHora] = useState('');

  // Función para obtener la hora actual y formatearla manualmente
  const obtenerHora = () => {
    const now = new Date();
    const horas = now.getHours().toString().padStart(2, '0');  // Formatea las horas con dos dígitos
    const minutos = now.getMinutes().toString().padStart(2, '0'); // Formatea los minutos con dos dígitos
    return `${horas}:${minutos}`; // Combina horas y minutos
  };

  useEffect(() => {
    // Función para actualizar la hora cada segundo
    const intervalId = setInterval(() => {
      setHora(obtenerHora());
    }, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <h2>{hora}</h2>
    </div>
  );
};

export default HoraActual;
