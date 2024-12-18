import * as THREE from 'three';

const objCount = 5000;

function getMeshProps() {
    const arr = [];
    for (let i = 1; i <= objCount; i++) {
        arr.push({
            position: {
                x: Math.random() * 10000 - 5000,
                y: Math.random() * 6000 - 3000,
                z: Math.random() * 8000 - 4000
            },
            rotation: {
                x: Math.random() * 2 * Math.PI,
                y: Math.random() * 2 * Math.PI,
                z: Math.random() * 2 * Math.PI,
            },
            scale: Math.random() * 200 + 100
        })
    }
    return arr;
}

const dummyProps = getMeshProps();

function getMesh(material, needsAnimationColor = false) {
    const size = 0.25;
    const geometry = new THREE.IcosahedronGeometry(size, 1);
    const mesh = new THREE.InstancedMesh(geometry, material, objCount); // Use InstancedMesh if you have to render a large number of objects with the same geometry and material(s) but with different world transformations.

    const dummy = new THREE.Object3D(); // This is the base class for most objects in three.js and provides a set of properties and methods for manipulating objects in 3D space
    const color = new THREE.Color();
    let props;

    for (let i = 0; i < objCount; i++) {
        props = dummyProps[i];

        dummy.position.x = props.position.x;
        dummy.position.y = props.position.y;
        dummy.position.z = props.position.z;
        dummy.rotation.x = props.rotation.x;
        dummy.rotation.y = props.rotation.y;
        dummy.rotation.z = props.rotation.z;
        dummy.scale.set(props.scale, props.scale, props.scale);

        dummy.updateMatrix(); // Updates the local transform.

        mesh.setMatrixAt(i, dummy.matrix); // Set the position, scale and rotation of the object at position 'i'
        if (needsAnimationColor) mesh.setColorAt(i, color.setScalar(0.1 + 0.9 * Math.random())) // Sets all three color components to the value scalar.

    }
    return mesh;
}

export function getFXScene({ renderer, material, clearColor, needsAnimationColor = false }) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, w / h, 1, 10000);
    camera.position.z = 2000;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(clearColor, 0.0002);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 1.0));
    const mesh = getMesh(material, needsAnimationColor);
    scene.add(mesh);

    const fbo = new THREE.WebGLRenderTarget(w, h);
    const rotationSpeed = new THREE.Vector3(0.1, -0.2, 0.15);
    const update = (delta) => {
        mesh.rotation.x += delta * rotationSpeed.x;
        mesh.rotation.y += delta * rotationSpeed.y;
        mesh.rotation.z += delta * rotationSpeed.z;
        if(needsAnimationColor) material.color.setHSL(0.1 + 0.5 * Math.sin(0.0002 * Date.now()), 1, 0.5);
    }

    const render = (delta, rtt) => {
        update(delta);
        renderer.setClearColor(clearColor);

        if(rtt) {
            renderer.setRenderTarget(fbo);
            renderer.clear();
            renderer.render(scene, camera);
        }
        else {
            renderer.setRenderTarget(null);
            renderer.render(scene, camera);
        }
    }

    return { fbo, render, update }
}