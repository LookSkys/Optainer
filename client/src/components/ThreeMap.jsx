// Mapa del patio de contenedores
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import floorTexturePath from '../assets/textura-pared-grunge.jpg';
import { fetchContenedores } from './FetchContainer';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { io } from "socket.io-client";

const ThreeDMap = () => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);  // Ref para el renderer
  const animationFrameRef = useRef(null); // Ref para la animación
  const containerRef = useRef(null);

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
    floor.position.x = 20;
    floor.position.y = 0.5;
    scene.add(floor);

  

    /* // Añadir luz direccional (simula el sol)
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tipo de sombra (suave) */



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

    let containerGeometry; // Variable para almacenar la geometría del modelo

    const loader = new STLLoader();
    const modelPath = new URL('../models/CONTAINER.STL', import.meta.url).href;

    loader.load(
        modelPath,
        (geometry) => {
            // Asigna solo la geometría a containerGeometry
            containerGeometry = geometry;
            containerGeometry.computeBoundingBox();
            // Aquí puedes hacer más ajustes si es necesario
        },
        undefined,
        (error) => {
            console.error('Error al cargar el archivo STL:', error);
        }
    );

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
        createBlock(9, 0, 1),
        createBlock(18, 0, 2),
        createBlock(27, 0, 3),
        createBlock(36, 0, 4),
        createBlock(45, 0, 5),
        createBlock(54, 0, 7),
        createBlock(63, 0, 8),

        createBlockRefee(-20, 0, 6),
        createBlockRefee(-26, 0, 6),
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
        //console.log("Actualizando colores de columnas y filas...");
        const blockId = block.position.x;
        // Iterar sobre todas las claves de columnHeights
        for (let key in columnHeights) {
            // Descomponer la clave en bloque, columna y fila
            const [blockKey, column, row] = key.split('-').map(Number);
            if (blockKey === blockId) {
            const maxHeight = columnHeights[key]; // Obtener la altura máxima para esa clave
            //console.log(`Lectura de altura máxima: ${maxHeight}, para la clave: ${key} (bloque: ${blockKey}, columna: ${column}, fila: ${row})`);
                
            // Definir el color basado en la altura máxima
            const color = colors[maxHeight - 1] || 0xeeeeee; // Por defecto a gris si no hay altura
    
            // Iterar sobre cada altura posible en esa columna y fila
            for (let heightLevel = 1; heightLevel <= maxHeight; heightLevel++) {
                // Buscar el contenedor en la posición actual de bloque, columna, fila y altura
                let col = column -3.1;
                let level = heightLevel -0.5;
                let deep = (-4*row) + 2;

                const container = block.children.find(child => {
                    return child instanceof THREE.Mesh &&
                        Math.abs(child.position.x - col < 0.1)  && // Columna ajustada
                        Math.abs(child.position.y - level) < 0.1 && // Altura actual
                        Math.abs(child.position.z - deep) < 0.1 ; // Fila ajustada
                });
                //console.log(container.position)
                //console.log(`Buscando contenedor en: Bloque: ${blockKey}, Columna: ${column}, Fila: ${row}, Altura: ${heightLevel}`);
                
                // Si se encuentra el contenedor, cambiar su color
                if (container) {
                    //console.log(`Aplicando color: ${color.toString(16)} a la altura ${heightLevel}`);
                    container.material.color.set(color);
                    container.material.needsUpdate = true; // Marcar el material como modificado
                    block.add(container);
                } else {
                    //console.error(`No se encontró el contenedor para la clave: ${key} (bloque: ${blockKey}, columna: ${column}, fila: ${row}, altura: ${heightLevel})`);
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
        const row = Math.floor(z);
        const blockId = block.position.x;
        const key = `${blockId}-${column}-${row}`;
        //console.log(key)
        //console.log('lectura de columnHeights:' + columnHeights);
        //console.log('lectura de idContainer:' + idContainer);
        // Inicializar la altura si no existe
        if (!columnHeights[key]) {
            columnHeights[key] = 0;
        }

        // Buscar el espacio en la posición dada
        const space = block.children.find(child => {
            return child instanceof THREE.Mesh &&
                  child.position.equals(new THREE.Vector3(x, y, z * -4));
        });

        if (space) {
            //console.log('Space found at:', space.position);

            // Actualizar el contenedor
            if (isContained) {
                //console.log('Adding container at:', space.position);
                const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                const container = new THREE.Mesh(containerGeometry, material);

                // Escalar la geometría
                containerGeometry.computeBoundingBox();
                const boundingBox = containerGeometry.boundingBox; // Accede al boundingBox}
                const center = boundingBox.getCenter(new THREE.Vector3());
                if (boundingBox) {
                    const center = boundingBox.getCenter(new THREE.Vector3());
                    const targetDimensions = { x: 1, y: 1, z: -4 }; // Dimensiones deseadas
                    const scaleX = targetDimensions.x / (boundingBox.max.x - boundingBox.min.x);
                    const scaleY = targetDimensions.y / (boundingBox.max.y - boundingBox.min.y);
                    const scaleZ = targetDimensions.z / (boundingBox.max.z - boundingBox.min.z);
                    // Aplicar la escala al modelo
                    container.scale.set(scaleX, scaleY, scaleZ);
                    // Ajustar la posición del contenedor
                    container.position.set(
                        space.position.x - 3.1 , // Usar directamente la posición del espacio
                        space.position.y - 0.5, // Usar directamente la posición del espacio
                        space.position.z + 2 // Usar directamente la posición del espacio
                    );
                
                    //console.log(container.position)
                } else {
                    console.error('boundingBox no está definido');
                }


                // Ajustar la posición
                //container.position.copy(space.position);
                block.add(container);
                
                // Incrementar la altura de la columna
                columnHeights[key] += 1;

            } else {
                //console.log('Removing container at:', space.position);
                const existingContainer = block.children.find(child =>
                    child.position.equals(space.position) && child instanceof THREE.Mesh
                );
                if (existingContainer) {
                    block.remove(existingContainer);
                    
                    // Decrementar la altura de la columna
                    columnHeights[key] -= 1;
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

    async function loadContenedores() {
        const torres = {"A": 0,"B": 1,"C": 2,"D": 3,"E": 4,"F": 5,"G": 6};
        try {
          const contenedoresData = await fetchContenedores();

          const contenedoresOrdenados = contenedoresData
            .filter(contenedor => {
                const { ubicacionParseada } = contenedor;
                return ubicacionParseada.torre in torres; // Filtramos solo torres válidas
            })
            .sort((a, b) => {
                const alturaA = a.ubicacionParseada.z; // Suponiendo que 'z' es la altura
                const alturaB = b.ubicacionParseada.z;
                const torreA = torres[a.ubicacionParseada.torre];
                const torreB = torres[b.ubicacionParseada.torre];

                // Primero comparamos por torre (A, B, C, etc.) y luego por altura
                if (torreA === torreB) {
                    return alturaA - alturaB; // Ordenar por altura si son de la misma torre
                }
                return torreA - torreB; // Ordenar por torre
            });



            contenedoresOrdenados.forEach(contenedor => {
            const { id, ubi, ubicacionParseada, zona, visado} = contenedor;
            //console.log(ubicacionParseada)
            const { torre, z, x, y, original } = ubicacionParseada;
            //console.log(torre, z,x,y)
            
            if(x) {
                if (torre in torres) {
                    const blockIndex = torres[torre];
                    updateContainer(blockGroup[blockIndex], { x: x, y: y, z: z }, true);
                    updateColorsInColumn(blockGroup[blockIndex])
                  }
            }
          });
        } catch (error) {
          console.error("Error al cargar los contenedores: ", error);
        }
      }
  
    const socket = io('http://localhost:5000');
    // Llamar a la función al montar el componente

    loadContenedores();

    socket.on('contenedorActualizado', async (data) => {
        console.log('Nuevo contenedor recibido:', data);
        await loadContenedores(); // Actualiza la escena con los datos nuevos
      });


    // Hacer que el piso reciba sombras
    //floor.receiveShadow = true;


    // Añadir luces
    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambientLight);
                                                        //0x404040
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 20, 20).normalize();
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

    let isRendering = true;
     // Guardamos el renderer para poder accederlo desde el cleanup
     rendererRef.current = renderer;

    function animate() {
        if (!isRendering) return;
        controls.update();  // Actualiza los controles en cada cuadro

        renderer.render(scene, camera);
        animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();


    // Función de limpieza de recursos
    const cleanup = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current); // Detener la animación
        }
        if (rendererRef.current) {
          rendererRef.current.dispose(); // Liberar recursos de renderer
        }
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose(); // Liberar geometrías
            if (object.material) object.material.dispose(); // Liberar materiales
          }
        });
        if (containerRef.current) {
          containerRef.current.innerHTML = ''; // Limpiar el contenedor del DOM
        }
      };

    const handleVisibilityChange = () => {
        isRendering = !document.hidden; // Pausar si la pestaña está oculta
        if (isRendering) {
          animate(); // Reiniciar render loop si se vuelve visible
        }
      };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup para que no se caiga al cambiar de página
    return () => {
        cleanup();
        document.removeEventListener('visibilitychange', handleVisibilityChange);  
    };
  }, []);

  return <div style={{ width: 'calc(100vw - <navbar-width>)', height: '100vh', overflow: 'hidden' }}>
        <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
        </div>;
};

export default ThreeDMap;
