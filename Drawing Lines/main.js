import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 500);
camera.position.set(0, 0, 100);
camera.lookAt(0,0,0);

const scene = new THREE.Scene();

// Create a blue line basic material
const material = new THREE.LineBasicMaterial({color: 0x00ffff});

// Create a geometry with some vertices
const points = [];
points.push(new THREE.Vector3(-10, 0, 0))
points.push(new THREE.Vector3(0, 10, 0))
points.push(new THREE.Vector3(10, 0, 0))
const geometry = new THREE.BufferGeometry().setFromPoints(points)
// Note: The lines are not closed, i.e. Point 3 and Point1 are not joined

// Form a line
const line = new THREE.Line(geometry, material)

// Add to the scene and call it a render
scene.add(line)
renderer.render(scene, camera);