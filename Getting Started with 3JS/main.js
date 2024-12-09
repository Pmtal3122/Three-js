import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/Addons.js';
import {OrbitControls} from 'jsm/controls/OrbitControls.js'

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 500);
camera.position.z = 2;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03

const geo = new THREE.IcosahedronGeometry(1.0, 2);
const material = new THREE.MeshStandardMaterial({color: 0xffffff, flatShading: true});
const mesh = new THREE.Mesh(geo, material);
scene.add(mesh)

const wireMat = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001)
mesh.add(wireMesh)

const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
scene.add(hemiLight)

function animate(t=0) {
    requestAnimationFrame(animate);
    mesh.rotation.y = t * 0.0001;
    controls.update()
    renderer.render(scene, camera);
}
animate();