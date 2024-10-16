// Mapa del patio de contenedores
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'; 
import { gsap } from 'gsap';
import floorTexturePath from '../assets/textura-pared-grunge.jpg';
import sceneTexturePath from '../assets/scene.jpg';


const ThreeDMap = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    
    // Configuración básica de Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight); // Usar el tamaño del contenedor
    mountRef.current.appendChild(renderer.domElement);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;

    // Crear un degradado
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#3b5998'); // Color de inicio
    gradient.addColorStop(1, '#8b9dc3'); // Color de fin

    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    // Crear una textura a partir del canvas
    const gradientTexture = new THREE.Texture(canvas);
    gradientTexture.needsUpdate = true; // Indica que la textura necesita ser actualizada

    scene.background = gradientTexture; // Asigna la textura como fondo


    camera.position.set(20, 10, 15);  // Cambia las coordenadas para ubicar la cámara
    camera.lookAt(20, 5, 5);  // Apunta la cámara a la coordenada (opcional)

    // Establecer el color de fondo a gris claro
    //renderer.setClearColor(0xd3d3d3); // Color gris claro en hexadecimal

   
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

    // Dimensiones del prisma rectangular refee
    const widthRefee = 4; // Ancho del prisma
    const heightRefee = 1; // Altura del prisma
    const depthRefee = 1; // Profundidad del prisma

    // Crear la geometría del prisma rectangular
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const geometryRefee = new THREE.BoxGeometry(widthRefee, heightRefee, depthRefee);

    // Crear la geometría del borde
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 1 }); // Gris suave

    const edgesGeometryRefee = new THREE.EdgesGeometry(geometryRefee);
    const edgesMaterialRefee = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 1 }); // Gris suave

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

    function createBlockRefee(blockX, blockY, blockZ) {
        const blockGroup = new THREE.Group();
        blockGroup.position.set(blockX, blockY, blockZ);
        scene.add(blockGroup);

        for (let col = 1; col < 2; col++) { // Columnas (de izquierda a derecha)
            for (let row = 1; row < 15; row++) { // Filas (de adelante hacia atrás)
                for (let heightLevel = 1; heightLevel < 6; heightLevel++) { // Alturas (solo espacios vacíos)
                    // Crear un espacio vacío
                    const space = new THREE.Mesh(
                        geometryRefee,
                        new THREE.MeshBasicMaterial({ color: 0xeeeeee, transparent: true, opacity: 0 }) // Material transparente
                    );
                    
                    // Calcular posición
                    const x = col * (widthRefee); // Posición en columna
                    const y = heightLevel * (heightRefee); // Posición en altura
                    const z = -row * (depthRefee) ; // Posición en fila

                    // Establecer posición
                    space.position.set(x, y, z);
                    blockGroup.add(space);

                    // Crear y añadir borde
                    const border = new THREE.LineSegments(edgesGeometryRefee, edgesMaterialRefee);
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
        createBlock(50, 0, 0),
        
        createBlockRefee(-20, 0, 0),
        createBlockRefee(-26, 0, 0),
    ];

    // Array de colores (uno por cada altura)
    const colors = [
        0xffffff,  // blanco para la altura 1 
        0x00ff00,  // Verde para la altura 2
        0xffff00,  // Amarillo para la altura 3
        0xff0000,  // Rojo para la altura 4 
        0x18171c   // Negro para la altura 5
    ];


    // Función para actualizar los colores de los contenedores en cada fila-columna según su altura
    function updateColorsInColumn(block) {
        console.log("Actualizando colores de columnas y filas...");
        // Iterar sobre todas las filas y columnas
        for (let column in columnHeights) {
            for (let row in columnHeights[column]) {
                const maxHeight = columnHeights[column][row]; // Obtener la altura máxima de la fila-columna
                console.log('Lectura de altura Maxima, para el color: ' + maxHeight + ' y con column: ' + column);
                const columnBlock = column % 10;
                // Definir el color basado en la altura máxima
                const color = colors[maxHeight - 1] || 0xeeeeee; // Por defecto a gris si no hay altura
                // Iterar sobre cada altura posible
                for (let heightLevel = 1; heightLevel <= maxHeight; heightLevel++) {
                    // Buscar el contenedor en la posición actual de fila-columna y altura
                    
                    
                    const container = block.children.find(child => {
                        return child instanceof THREE.Mesh &&
                            Math.abs(child.position.x - columnBlock) < 0.1 &&
                            Math.abs(child.position.y - heightLevel) < 0.1 &&
                            Math.abs(child.position.z - row) < 0.1; // Ajusta aquí según sea necesario
                    });

                    console.log(`Buscando contenedor en: Columna: ${columnBlock}, Fila: ${row}, Altura: ${heightLevel}`);
                    console.log('lectura de posicion de container: ' + container);

                    // Si se encuentra el contenedor, cambiar su color
                    if (container) {
                        console.log(`Aplicando color: ${color.toString(16)} a la altura ${heightLevel}`);
                        container.material.color.set(color);
                        container.material.needsUpdate = true; // Asegúrate de que el material esté marcado como modificado
                        block.add(container);
                    } else {
                        console.error(`No se encontró el contenedor para la columna: ${columnBlock}, fila: ${row}, altura: ${heightLevel}`);
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
        const blockId = block.position.x;
        const idContainer = column + blockId;
        
        console.log('lectura de columnHeights:' + columnHeights);
        console.log('lectura de idContainer:' + idContainer);
        // Inicializar la altura si no existe
        if (!columnHeights[idContainer]) {
            columnHeights[idContainer] = {};
        }
        if (!columnHeights[idContainer][row]) {
            columnHeights[idContainer][row] = 0;
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
                columnHeights[idContainer][row] += 1;

            } else {
                console.log('Removing container at:', space.position);
                const existingContainer = block.children.find(child =>
                    child.position.equals(space.position) && child instanceof THREE.Mesh
                );
                if (existingContainer) {
                    block.remove(existingContainer);
                    
                    // Decrementar la altura de la columna
                    columnHeights[idContainer][row] -= 1;
                }
            }

            // Obtener la nueva altura para la fila-columna actual
            //const maxHeight = columnHeights[block][column][row];
            //console.log(`Max height in column (${column}, ${row}): ${maxHeight}`);
            
            
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
        updateContainer(blockGroup[0], { x: 4, y: 1, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 3, y: 2, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 4, y: 1, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 4, y: 2, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 4, y: 3, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[0], { x: 5, y: 1, z: 1}, true); // Añadir contenedor

        updateColorsInColumn(blockGroup[0]); 

        updateContainer(blockGroup[1], { x: 1, y: 1, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[1], { x: 1, y: 2, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[1], { x: 1, y: 3, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[1], { x: 1, y: 4, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[1], { x: 1, y: 1, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[1], { x: 1, y: 2, z: 1}, true); // Añadir contenedor
        
        updateColorsInColumn(blockGroup[1]);

        updateContainer(blockGroup[2], { x: 1, y: 1, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[2], { x: 1, y: 2, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[2], { x: 1, y: 3, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[2], { x: 1, y: 4, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[2], { x: 2, y: 1, z: 1}, true); // Añadir contenedor
        
        updateColorsInColumn(blockGroup[2]);

        updateContainer(blockGroup[3], { x: 1, y: 1, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[3], { x: 1, y: 2, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[3], { x: 1, y: 3, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[3], { x: 1, y: 4, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[3], { x: 1, y: 1, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[3], { x: 1, y: 2, z: 2}, true); // Añadir contenedor

        updateColorsInColumn(blockGroup[3]);

        
        
    }, 2000);

    setTimeout(() => {
        updateContainer(blockGroup[4], { x: 1, y: 1, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 1, y: 2, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 1, y: 3, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 1, y: 4, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 2, y: 1, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 1, y: 5, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 2, y: 2, z: 1}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 2, y: 3, z: 1}, true); // Añadir contenedor

        updateContainer(blockGroup[4], { x: 1, y: 1, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 1, y: 2, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 1, y: 3, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 1, y: 4, z: 2}, true); // Añadir contenedor

        updateContainer(blockGroup[4], { x: 2, y: 1, z: 2}, true); // Añadir contenedor
        updateContainer(blockGroup[4], { x: 2, y: 2, z: 2}, true); // Añadir contenedor


        updateColorsInColumn(blockGroup[4]);
    }, 100);



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


    window.addEventListener('resize', () => {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    function animate() {
        requestAnimationFrame(animate);
        
        controls.update();  // Actualiza los controles en cada cuadro

        renderer.render(scene, camera);
    }

    animate();



    // Cleanup para que no se caiga al cambiar de página
    return () => {
        if (currentMount) {
            // Aquí detienes animaciones y limpias la escena
            currentMount.removeChild(renderer.domElement); // Asegúrate de que el ref exista
          }      
    };
  }, []);

  return <div style={{ width: 'calc(100vw - <navbar-width>)', height: '100vh', overflow: 'hidden' }}>
        <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
        </div>;
};

export default ThreeDMap;
