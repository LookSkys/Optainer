// Mapa del patio de contenedores
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import floorTexturePath from '../assets/textura-pared-grunge.jpg';

const ThreeDMap = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    camera.position.set(20, 10, 10);
    camera.lookAt(20, 8, 5);

    renderer.setClearColor(0xd3d3d3);
    renderer.setSize(window.innerWidth, window.innerHeight);

    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load(floorTexturePath);

    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(2, 1);

    const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
    const floorGeometry = new THREE.PlaneGeometry(150, 100);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Añadir luces
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(50, 100, 50);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Dimensiones del prisma rectangular
    const width = 1; 
    const height = 1; 
    const depth = 4; 

    // Geometría del prisma y los bordes
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 1 });

    // Crear bloque de contenedores
    function createBlock(blockX, blockY, blockZ) {
      const blockGroup = new THREE.Group();
      blockGroup.position.set(blockX, blockY, blockZ);
      scene.add(blockGroup);

      for (let col = 1; col < 6; col++) {
        for (let row = 1; row < 4; row++) {
          for (let heightLevel = 1; heightLevel < 6; heightLevel++) {
            const space = new THREE.Mesh(
              geometry,
              new THREE.MeshBasicMaterial({ color: 0xeeeeee, transparent: true, opacity: 0 })
            );

            const x = col * (width);
            const y = heightLevel * (height);
            const z = -row * (depth);
            space.position.set(x, y, z);
            blockGroup.add(space);

            const border = new THREE.LineSegments(edgesGeometry, edgesMaterial);
            border.position.copy(space.position);
            blockGroup.add(border);
          }
        }
      }

      return blockGroup;
    }

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
      0x00ff00,  // verde para la altura 2
      0xffff00,  // amarillo para la altura 3
      0xff0000,  // rojo para la altura 4 
      0x18171c   // fucsia para la altura 5
    ];

    const columnHeights = {};

    // Función para actualizar contenedores
    function updateContainer(block, position, isContained) {
      const { x, y, z } = position;
      const column = Math.floor(x);
      const row = Math.floor(-z * 4);

      if (!columnHeights[column]) {
        columnHeights[column] = {};
      }
      if (!columnHeights[column][row]) {
        columnHeights[column][row] = 0;
      }

      const space = block.children.find(child =>
        child instanceof THREE.Mesh &&
        child.position.equals(new THREE.Vector3(x, y, z * -4))
      );

      if (space) {
        if (isContained) {
          const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
          const container = new THREE.Mesh(geometry, material);
          container.position.copy(space.position);
          block.add(container);
          columnHeights[column][row] += 1;
        } else {
          const existingContainer = block.children.find(child =>
            child.position.equals(space.position) && child instanceof THREE.Mesh
          );
          if (existingContainer) {
            block.remove(existingContainer);
            columnHeights[column][row] -= 1;
          }
        }

        const maxHeight = columnHeights[column][row];
      }
    }

    setTimeout(() => {
      updateContainer(blockGroup[0], { x: 1, y: 1, z: 1 }, true); // Añadir contenedor
      updateContainer(blockGroup[0], { x: 1, y: 2, z: 1 }, true);
      updateContainer(blockGroup[0], { x: 1, y: 3, z: 1 }, true);
    }, 1000);

    // Añadir controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(20, 8, 5);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup para que no se caiga al cambiar de página
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeDMap;
