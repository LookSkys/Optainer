import React, { useEffect } from 'react';
import { initRenderer } from '../../threejs/renderer';

const ThreeDView = () => {
    useEffect(() => {
    const renderer = initRenderer();
    // Aquí agregar código para crear la escena y renderizarla.
    }, []);

    return <div id="threejs-container"></div>;
};

export default ThreeDView;
