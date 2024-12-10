import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from './getStarField.js';
import { getFresnelMat } from './getFresnelMat.js';

window.THREE = THREE;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

new OrbitControls(camera, renderer.domElement);
const loader = new THREE.TextureLoader()

const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({map: loader.load('./Textures/earthmap1k.jpg')});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load('./Textures/earthlights1k.jpg'),
    opacity: 0.5,
    blending: THREE.AdditiveBlending
})
const lightMesh = new THREE.Mesh(geometry, lightsMat)
earthGroup.add(lightMesh);

const cloudsMat = new THREE.MeshBasicMaterial({
    alphaMap: loader.load('./Textures/earthcloudmaptrans.jpg'),
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
})
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
// earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
earthGroup.add(glowMesh)

const stars = getStarfield({numStars: 20000});
scene.add(stars);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff);
// scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 2)
scene.add(sunLight);

function animate() {
    requestAnimationFrame(animate);

    earthMesh.rotation.y += 0.001;
    lightMesh.rotation.y += 0.001;
    cloudsMesh.rotation.y += 0.001;
    glowMesh.rotation.y += 0.001;
    renderer.render(scene, camera)
}
animate();