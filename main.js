import './style.css'

import * as THREE from 'three';

// importando OrbitControls de examples
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// Agregando scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

// propiedades de renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// propiedades de camera
camera.position.setZ(30);

// agregando cone
//const geometry = new THREE.ConeGeometry(5, 10, 10);
//const material = new THREE.MeshStandardMaterial({color: 0xffff00});
//const cone = new THREE.Mesh(geometry, material);
//scene.add(cone);

// alternativa de agregar cone
const cone = new THREE.Mesh(
	new THREE.ConeGeometry(5, 10, 4),
	new THREE.MeshLambertMaterial({color: 0xff00ff})
);
cone.receiveShadow = true;
scene.add(cone);

const cube = new THREE.Mesh(
	new THREE.BoxGeometry(5, 5, 5),
	new THREE.MeshMatcapMaterial({color: 0x00ff00})
);

//cube.material.transparent = true;
//cube.material.opacity = 0.5;
scene.add(cube);

const torusKnot = new THREE.Mesh(
	new THREE.TorusKnotGeometry(2, 0.5, 20, 5),
	new THREE.MeshLambertMaterial({color: 0xf0f0f0})
);
torusKnot.receiveShadow = true;
scene.add(torusKnot);

// agregando luz blanca (0xffffff)
const pointLight = new THREE.PointLight(0xffffff);
// posicion del punto de luz
//pointLight.position.set(0, 6, 0);
scene.add(pointLight);

const ambientLigth = new THREE.AmbientLight(0xffffff);
//scene.add(pointLight, ambientLigth); // agregando dos objetos a la vez

// creando helpers para debugging
// muestra graficamente el objeto deseado
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(50, 10);
scene.add(lightHelper, gridHelper); // agregando helpers a la scene

// agregando controles de camera para moverse en la scene c/ratón
const controls = new OrbitControls(camera, renderer.domElement);

// agregando fondo a la scene
const spaceTexture = new THREE.TextureLoader().load('./space.jpg');
scene.background = spaceTexture;

// pasos para movimiento de cone
var stepCone = 0;
var stepTorus = 0;

// loop infinito
function animate() {

	requestAnimationFrame(animate);

	cone.rotation.x += 0.01;
	cone.rotation.y += 0.01;
	cone.rotation.z += 0.01;

	stepCone += 0.01;
	cone.position.x = 30*Math.sin(stepCone);
	cone.position.z = 30*Math.cos(stepCone);

	stepTorus += 0.07;
	torusKnot.position.x = cone.position.x-10*Math.sin(stepTorus);
	torusKnot.position.z = cone.position.z-10*Math.cos(stepTorus);

	controls.update();

	// dibujando los elementos scene y camera
	renderer.render(scene, camera);
}

animate();
