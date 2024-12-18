import * as THREE from 'three'
import {OrbitControls} from 'jsm/controls/OrbitControls.js';
import spline from './spline.js';
import { EffectComposer } from "jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.4)

const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// Post processing
const renderScene = new RenderPass(scene, camera) // To provide the rendered scene as an input for the next post-processing step
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 1, 0.0002) // resolution, strength, radius, threshold
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Creating a line from the points
const points = spline.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({color: 0xff0000});
const line = new THREE.Line(geometry, material);
// scene.add(line)

// Creating tube geometry from the line
const tubeGeo = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);
const tubeMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true
})
const tube = new THREE.Mesh(tubeGeo, tubeMat);
// scene.add(tube);

// Create edges geometry from the spline
const edges = new THREE.EdgesGeometry(tubeGeo, 0.2);
const lineMat = new THREE.LineBasicMaterial({color: 0x0099ff});
const tubeLines = new THREE.LineSegments(edges, lineMat);
scene.add(tubeLines);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
// scene.add(hemiLight)

// Create boxes
const numBoxes = 55;
const size = 0.075;
const boxGeo = new THREE.BoxGeometry(size, size, size);
for(let i=0; i<numBoxes; i++) {
    const boxMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
    });
    const box = new THREE.Mesh(boxGeo, boxMat);

    const p = (i/numBoxes + Math.random()*0.1) % 1;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    pos.x += Math.random() - 0.4;
    pos.z += Math.random() - 0.4;
    box.position.copy(pos);

    const rote = new THREE.Vector3(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    box.rotation.set(rote.x, rote.y, rote.z);
    const helper = new THREE.BoxHelper(box, 0xffff00);
    scene.add(box);
    // scene.add(helper);
}

//Camera flythrough
function updateCamera(t) {
    const time = t * 0.1;
    const looptime = 5 * 1000;
    const p = (time % looptime) / looptime;
    const pos = tubeGeo.parameters.path.getPointAt(p);
    const lookAt = tubeGeo.parameters.path.getPointAt((p+0.01) % 1);
    camera.position.copy(pos);
    camera.lookAt(lookAt);
}

function animate(t=0) {
    requestAnimationFrame(animate);
    updateCamera(t);
    composer.render(scene, camera);
    controls.update();
}
animate();