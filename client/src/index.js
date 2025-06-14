import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from "gsap";

// Configuración básica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Establecer el color de fondo a gris claro
renderer.setClearColor(0xd3d3d3); // Color gris claro en hexadecimal

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Dimensiones del prisma rectangular
const width = 1; // Ancho del prisma
const height = 1; // Altura del prisma
const depth = 4; // Profundidad del prisma

// Crear la geometría del prisma rectangular
const geometry = new THREE.BoxGeometry(width, height, depth);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// Crear la geometría del borde
const edgesGeometry = new THREE.EdgesGeometry(geometry);
const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 1 }); // Gris suave

// Crear un bloque de contenedores
function createBlock(blockX, blockY, blockZ) {
    const blockGroup = new THREE.Group();
    blockGroup.position.set(blockX, blockY, blockZ);
    scene.add(blockGroup);

    for (let col = 1; col < 6; col++) { // Columnas (de izquierda a derecha)
        for (let row = 1; row < 4; row++) { // Filas (de adelante hacia atrás)
            for (let heightLevel = 1; heightLevel < 6; heightLevel++) { // Alturas
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

/*
blockGroup.children.forEach(child => {
    if (child instanceof THREE.Mesh) {
        console.log(`Position of space: ${child.position.x}, ${child.position.y}, ${child.position.z}`);
    }
});
*/

function updateContainer(block, position, isContained) {
    const { x, y, z } = position;

    // Buscar el espacio en la posición dada
    const space = block.children.find(child => {
        return child instanceof THREE.Mesh &&
               child.position.equals(new THREE.Vector3(x, y, z*-4));
    });

    if (space) {
        console.log('Space found at:', space.position);

        // Encontrar el borde asociado
        const border = block.children.find(child => {
            return child instanceof THREE.LineSegments &&
                   child.position.equals(new THREE.Vector3(x, y, z));
        });

        // Actualizar el contenedor
        if (isContained) {
            console.log('Adding container at:', space.position);
            // Crear y añadir contenedor
            const container = new THREE.Mesh(geometry, material);
            container.position.copy(space.position);
            block.add(container);
            
            // Eliminar borde
            if (border) {
                block.remove(border);
            }
        } else {
            console.log('Removing container at:', space.position);
            // Eliminar contenedor existente
            const existingContainer = block.children.find(child => child.position.equals(space.position) && child instanceof THREE.Mesh);
            if (existingContainer) {
                block.remove(existingContainer);
            }

            // Reañadir borde
            if (!border) {
                const newBorder = new THREE.LineSegments(edgesGeometry, edgesMaterial);
                newBorder.position.copy(space.position);
                block.add(newBorder);
            }
        }
    } else {
        console.log('Space not found at:', position);
    }
}

// Ejemplo de actualización de un contenedor (puedes reemplazar esto con datos en tiempo real)
setTimeout(() => {
    updateContainer(blockGroup[0], { x: 1, y: 1, z: 1}, true); // Añadir contenedor
    updateContainer(blockGroup[0], { x: 1, y: 2, z: 1}, true); // Añadir contenedor
    updateContainer(blockGroup[0], { x: 1, y: 3, z: 1}, true); // Añadir contenedor
    updateContainer(blockGroup[0], { x: 1, y: 4, z: 1}, true); // Añadir contenedor
    updateContainer(blockGroup[0], { x: 1, y: 5, z: 1}, false); // Añadir contenedor
    updateContainer(blockGroup[1], { x: 2, y: 1, z: 2}, false); // Quitar contenedor
}, 2000);


// Añadir luces
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);



// Calcular el centro de todos los bloques
const totalBlocks = blockGroup.length;
const centerX = (blockGroup[0].position.x + blockGroup[totalBlocks - 1].position.x) / 2;
const centerY = 2.5 * height; // Altura media del bloque
const centerZ = 0;

// Posicionar la cámara en una vista aérea y orientarla hacia el centro
camera.position.set(centerX, centerY * 3, centerZ * 2);
camera.lookAt(centerX, centerY, centerZ);



// Añadir controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Ajustar el tamaño del renderizador cuando la ventana cambia de tamaño
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


/*
function transitionCamera() {
    gsap.to(camera.position, {
        duration: 2,
        x: centerX + 10,
        y: centerY * 2,
        z: centerZ * 1.5,
        onUpdate: () => {
            camera.lookAt(centerX, centerY, centerZ);
            controls.update();
        }
    });
}

// Llamar a la transición de la cámara después de 3 segundos
setTimeout(transitionCamera, 1000);
*/