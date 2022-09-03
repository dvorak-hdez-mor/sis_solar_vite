import './style.css'

import * as THREE from 'three';

// importando OrbitControls de examples
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

// Agregando scene, camera, renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

let controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// propiedades de renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// propiedades de camera
camera.position.setZ(25);
camera.position.setY(1);
camera.position.setX(25);
//camera.lookAt(scene);

// agregando cone
//const geometry = new THREE.ConeGeometry(5, 10, 10);
//const material = new THREE.MeshStandardMaterial({color: 0xffff00});
//const cone = new THREE.Mesh(geometry, material);
//scene.add(cone);

// textura cone
const coneTexture = new THREE.TextureLoader().load('./world.jpg');

// alternativa de agregar cone
const cone = new THREE.Mesh(
	new THREE.ConeGeometry(5, 10, 4),
	new THREE.MeshLambertMaterial({
		//color: 0xff00ff,
		map: coneTexture
	})
);
cone.receiveShadow = true;
scene.add(cone);

// cube Texture
const cubeTexture = new THREE.TextureLoader().load('./sun.jpg');

const cube = new THREE.Mesh(
	new THREE.BoxGeometry(5, 5, 5),
	new THREE.MeshMatcapMaterial({
		//color: 0x00ff00
		map: cubeTexture
	})
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

// test capsule
/*
const capsule = new THREE.Mesh(
	new THREE.CapsuleGeometry(2, 5, 2, 8),
	new THREE.MeshLambertMaterial({color:0xff1906})
);
capsule.position.y = 10;
capsule.position.z = -10;
capsule.receiveShadow = true;
scene.add(capsule);
*/

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
//const controls = new OrbitControls(camera, renderer.domElement);
//const controls = new PointerLockControls(camera, document.body);

// agregando fondo a la scene
const spaceTexture = new THREE.TextureLoader().load('./space.jpg');
scene.background = spaceTexture;

// textura cone

// pasos para movimiento de cone
var stepCone = 0;
var stepTorus = 0;

var canFly = false;
var canDown = false;
var canUp = false;

const onkeydown = function(e){
	switch(e.code){
		case 'ArrowUp': // arrow keys 
			canUp = true;
			//camera.position.x += 1;
			break;
		case 'ArrowDown':
			canDown = true;
			//camera.position.z += 1;
			//controls.moveForward(-0.1);
			break;
		case 'Space':
			canFly = !canFly;
			//camera.position.x -= 1;
			break;
	}
};

const onkeyup = function(e){
	switch(e.code){
		case 'ArrowUp':
			canUp = false;
			break;
		case 'ArrowDown':
			canDown = false;
			break;
	}
};

document.addEventListener('keydown', onkeydown);
document.addEventListener('keyup', onkeyup);

// loop infinito
function animate() {

	requestAnimationFrame(animate);

	renderer.setSize(window.innerWidth, window.innerHeight);

	//cone.rotation.x += 0.1;
	cone.rotation.y += 0.1;
	//cone.rotation.z += 0.1;

	// mover en ciertas condiciones con una func ?
	//camera.position.x = cone.position.x - 10;
	//camera.position.z = cone.position.z - 10;
	//camera.position.y = -5;
	
	//camera.position.y = cone.position.y + 10;

	cube.rotation.y += 0.05;

	stepCone += 0.01;
	cone.position.x = 30*Math.sin(stepCone);
	cone.position.z = 30*Math.cos(stepCone);

	stepTorus += 0.08;
	torusKnot.position.x = cone.position.x-10*Math.sin(stepTorus);
	torusKnot.position.z = cone.position.z-10*Math.cos(stepTorus);

	//keycontrols(cone);

	// update de controls
	//controls.update();

	controls.lock();

	if (canFly){
		controls.moveForward(0.1);
	}

	if (canUp){
		controls.getObject().position.y += 0.08;
	}

	if (canDown){
		controls.getObject().position.y -= 0.08;
	}

	// dibujando los elementos scene y camera
	renderer.render(scene, camera);
}

animate();
