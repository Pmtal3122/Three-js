import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000); // Field of view, aspect ratio, fustum near plane, frustum far plane

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adding a cube
const geometry = new THREE.BoxGeometry(1, 1, 1) // This contains all the points and fill of the cube
const material = new THREE.MeshBasicMaterial({color: 0x00ff00}); // Contains an object of properties
const cube = new THREE.Mesh(geometry, material); // Object that contains a geometry and applies a material to it
scene.add(cube);

//By default when calling scene.add(), the thing will be added to (0,0,0). So we move the camera out a bit
camera.position.z = 5;


// Rendering a scene
function animate() {
    cube.rotation.x+= 0.01;
    cube.rotation.y+= 0.01;

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate) //This will create a loop that causes the renderer to draw the scene every time the screen is refreshed

