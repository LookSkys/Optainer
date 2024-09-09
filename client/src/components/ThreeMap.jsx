// Mapa del patio de contenedores
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import floorTexturePath from '../assets/textura-pared-grunge.jpg';

const ThreeDMap = () => {
  const mountRef = useRef(null);

  useEffect(() => {
   
    
    // Configuración básica de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    camera.position.set(20, 10, 15);  // Cambia las coordenadas para ubicar la cámara
    camera.lookAt(20, 5, 5);  // Apunta la cámara a la coordenada (opcional)

    // Establecer el color de fondo a gris claro
    renderer.setClearColor(0xd3d3d3); // Color gris claro en hexadecimal

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    mountRef.current.appendChild(renderer.domElement);
    const textureLoader = new THREE.TextureLoader();

    // Cargar la textura desde la carpeta pública o la ruta relativa a tu proyecto
    const floorTexture = textureLoader.load(floorTexturePath);

    // Hacer que la textura se repita
    floorTexture.wrapS = THREE.RepeatWrapping; // Repetir en la dirección S (horizontal)
    floorTexture.wrapT = THREE.RepeatWrapping; // Repetir en la dirección T (vertical)
    floorTexture.repeat.set(2, 1); // Repetir la textura cada 4 segmentos en ambas direcciones


    // Crear el material con la textura
    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture
    });

    // Crear el piso y aplicarle el material con la textura
    const floorGeometry = new THREE.PlaneGeometry(150, 100);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);


    // Añadir luz direccional (simula el sol)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1); // Luz blanca con intensidad 1
    sunLight.position.set(50, 100, 50); // Posicionar la luz en un ángulo alto
    sunLight.castShadow = true; // Habilitar sombras
    scene.add(sunLight);

    // Opcional: Configurar sombras para la luz direccional
    sunLight.shadow.mapSize.width = 1024; // Tamaño del mapa de sombras
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;

    // Habilitar sombras en el renderizador
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tipo de sombra (suave)



    // Dimensiones del prisma rectangular
    const width = 1; // Ancho del prisma
    const height = 1; // Altura del prisma
    const depth = 4; // Profundidad del prisma

    // Crear la geometría del prisma rectangular
    const geometry = new THREE.BoxGeometry(width, height, depth);

    // Crear la geometría del borde
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 1 }); // Gris suave

    // Crear un bloque de contenedores (espacios vacíos)
    function createBlock(blockX, blockY, blockZ) {
        const blockGroup = new THREE.Group();
        blockGroup.position.set(blockX, blockY, blockZ);
        scene.add(blockGroup);

        for (let col = 1; col < 6; col++) { // Columnas (de izquierda a derecha)
            for (let row = 1; row < 4; row++) { // Filas (de adelante hacia atrás)
                for (let heightLevel = 1; heightLevel < 6; heightLevel++) { // Alturas (solo espacios vacíos)
                    // Crear un espacio vacío
                    const space = new THREE.Mesh(
                        geometry,
                        new THREE.MeshBasicMaterial({ color: 0xeeeeee, transparent: true, opacity: 0 }) // Material transparente
                    );
                    
                    // Calcular posición
                    const x = col * (width); // Posición en columna
                    const y = heightLevel * (height); // Posición en altura
                    const z = -row * (depth) ; // Posición en fila

                    // Establecer posición
                    space.position.set(x, y, z);
                    blockGroup.add(space);

                    // Crear y añadir borde
                    const border = new THREE.LineSegments(edgesGeometry, edgesMaterial);
                    border.position.copy(space.position);
                    blockGroup.add(border);
                }
            }
        }

        return blockGroup;
    }

    // Crear y añadir el bloque al escenario
    const blockGroup = [
        createBlock(0, 0, 0),
        createBlock(10, 0, 0),
        createBlock(20, 0, 0),
        createBlock(30, 0, 0),
        createBlock(40, 0, 0),
        createBlock(50, 0, 0)
    ];

    // Array de colores (uno por cada altura)
    const colors = [
        0xffffff,  // blanco para la altura 1 
        0x00ff00,  // Verde para la altura 2
        0xffff00,  // Amarillo para la altura 3
        0xff0000,  // Amarillo para la altura 4 
        0x18171c   // Fucsia para la altura 5
    ];


    // Función para actualizar los colores de los contenedores en cada fila-columna según su altura
    function updateColorsInColumn(block) {
        console.log("Actualizando colores de columnas y filas...");

        // Iterar sobre todas las filas y columnas
        for (let column in columnHeights) {
            for (let row in columnHeights[column]) {
                const maxHeight = columnHeights[column][row]; // Obtener la altura máxima de la fila-columna

                // Definir el color basado en la altura máxima
                const color = colors[maxHeight - 1] || 0xeeeeee; // Por defecto a gris si no hay altura
                // Iterar sobre cada altura posible
                for (let heightLevel = 1; heightLevel <= maxHeight; heightLevel++) {
                    // Buscar el contenedor en la posición actual de fila-columna y altura
                    
                    const container = block.children.find(child => {
                        return child instanceof THREE.Mesh &&
                            Math.abs(child.position.x - column) < 0.001 &&
                            Math.abs(child.position.y - heightLevel) < 0.001 &&
                            Math.abs(child.position.z - row) < 0.001; // Ajusta aquí según sea necesario
                    });

                    console.log(`Buscando contenedor en: Columna: ${column}, Fila: ${row}, Altura: ${heightLevel}`);
                    console.log(container.position);

                    // Si se encuentra el contenedor, cambiar su color
                    if (container) {
                        console.log(`Aplicando color: ${color.toString(16)} a la altura ${heightLevel}`);
                        container.material.color.set(color);
                        container.material.needsUpdate = true; // Asegúrate de que el material esté marcado como modificado
                        
                        block.add(container);
                    } else {
                        console.error(`No se encontró el contenedor para la columna: ${column}, fila: ${row}, altura: ${heightLevel}`);
                    }
                }
            }
        }
    }

    // Objeto para mantener la altura actual de cada fila-columna
    const columnHeights = {};

    // Modificar la función `updateContainer`
    function updateContainer(block, position, isContained) {
        const { x, y, z } = position;

        // Convertir a índices de fila y columna
        const column = Math.floor(x);
        const row = Math.floor(-z*4);

        // Inicializar la altura si no existe
        if (!columnHeights[column]) {
            columnHeights[column] = {};
        }
        if (!columnHeights[column][row]) {
            columnHeights[column][row] = 0;
        }

        // Buscar el espacio en la posición dada
        const space = block.children.find(child => {
            return child instanceof THREE.Mesh &&
                  child.position.equals(new THREE.Vector3(x, y, z * -4));
        });

        if (space) {
            console.log('Space found at:', space.position);

            // Actualizar el contenedor
            if (isContained) {
                console.log('Adding container at:', space.position);
                const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                const container = new THREE.Mesh(geometry, material);
                container.position.copy(space.position);
                block.add(container);
                
                // Incrementar la altura de la columna
                columnHeights[column][row] += 1;
                

            } else {
                console.log('Removing container at:', space.position);
                const existingContainer = block.children.find(child =>
                    child.position.equals(space.position) && child instanceof THREE.Mesh
                );
                if (existingContainer) {
                    block.remove(existingContainer);
                    
                    // Decrementar la altura de la columna
                    columnHeights[column][row] -= 1;
                }
            }

            // Obtener la nueva altura para la fila-columna actual
            const maxHeight = columnHeights[column][row];
            console.log(`Max height in column (${column}, ${row}): ${maxHeight}`);
            
            
        } else {
            console.log('Space not found at:', position);
        }

        updateColorsInColumn(block);
    }



    // Ejemplo de actualización de un contenedor (puedes reemplazar esto con datos en tiempo real)
    setTimeout(() => {
        updateContainer(blockGroup[0], { x: 1, y: 1, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 1, y: 2, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 1, y: 3, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 1, y: 4, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 2, y: 1, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 1, y: 5, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 2, y: 2, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 2, y: 3, z: 1}, true); // Añadir contenedor

        updateContainer(blockGroup[0], { x: 1, y: 1, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 1, y: 2, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 1, y: 3, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 1, y: 4, z: 2}, true); // Añadir contenedor

        updateContainer(blockGroup[0], { x: 2, y: 1, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 2, y: 2, z: 2}, true); // Añadir contenedor

        updateColorsInColumn(blockGroup[0]);
    }, 100);

    setTimeout(() => {
        updateContainer(blockGroup[0], { x: 3, y: 1, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 3, y: 2, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 3, y: 1, z: 1}, true); // Añadir contenedor
        updateColorsInColumn(blockGroup[0]);
    }, 1000);

    setTimeout(() => {
        //updateContainer(blockGroup[0], { x: 3, y: 3, z: 2}, false); // Añadir contenedor
        
    }, 3000);



    // Hacer que el piso reciba sombras
    floor.receiveShadow = true;


    // Añadir luces
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);




    // Añadir los controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;  // Suaviza los movimientos
    controls.dampingFactor = 0.05;  // Ajusta el efecto de suavizado
    controls.target.set(21, 5, 2);  // Mantén el foco en el origen (o cualquier punto)



    function animate() {
        requestAnimationFrame(animate);
        
        controls.update();  // Actualiza los controles en cada cuadro

        renderer.render(scene, camera);
    }

    animate();



    // Cleanup para que no se caiga al cambiar de página
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeDMap;
