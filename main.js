import './style.css'

import * as THREE from 'three';

// importando OrbitControls de examples
//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

// libreria para cargar modelos 3D en formato glb
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

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
	new THREE.ConeGeometry(5, 10, 10),
	new THREE.MeshLambertMaterial({
		//color: 0xff00ff,
		map: coneTexture
	})
);
cone.receiveShadow = true;
scene.add(cone);

// add blackhole
let blackhole;
let blackholeLoader = new GLTFLoader();
blackholeLoader.load('a_black_hole.glb', function (gltf) {
	//scene.add(gltf.scene);
	blackhole = gltf.scene;
	blackhole.scale.set(10, 10, 10);
	scene.add(blackhole);
}, undefined, function (error){
	console.log('No se cargó el modelo 3D');
});

// cube Texture
const cubeTexture = new THREE.TextureLoader().load('./sun.jpg');

const cube = new THREE.Mesh(
	new THREE.BoxGeometry(30, 30, 30),
	new THREE.MeshMatcapMaterial({
		//color: 0x00ff00
		map: cubeTexture
	})
);
//cube.material.transparent = true;
//cube.material.opacity = 0.5;
//scene.add(cube);

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
/*
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
spaceTexture.wrapS = THREE.RepeatWrapping;
spaceTexture.wrapT = THREE.RepeatWrapping;
spaceTexture.repeat.set(4, 4)
scene.background = spaceTexture;
*/
// fondo espacial
const bgScene = new THREE.Mesh(
	new THREE.SphereGeometry(320, 20, 20),
	new THREE.MeshBasicMaterial({
		map: (new THREE.TextureLoader).load('space.jpg'),
		side: THREE.DoubleSide
	})
);
scene.add(bgScene);

// agregando un listener a la camera
const listener = new THREE.AudioListener();
camera.add(listener);

const sound1 = new THREE.Audio(listener);
const stay = document.getElementById('stay');
sound1.setMediaElementSource(stay);
sound1.setVolume(0.5);
stay.play();

// textura cone

// pasos para movimiento de cone
var stepCone = 0;
var stepTorus = 0;

var canFly = false;
var canDown = false;
var canUp = false;
var animation = 0;

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
		case 'KeyM':
			animation = (animation < 4)?animation + 1 : 0;
			//animation = !animation;
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
	switch (animation){
		case 0:
			// siga a la tierra
			camera.position.x = 60*Math.sin(stepCone)+20;
			camera.position.z = 60*Math.cos(stepCone)+20;
			camera.position.y = 5;
			camera.lookAt(0,0,0);
			break;
		case 1:
			// vista superior
			camera.position.x = 0;
			camera.position.z = 0;
			camera.position.y = 60;
			camera.lookAt(0, 0, 0);
			break;
		case 2:
			// vista lateral
			camera.position.x = 80;
			camera.position.z = 0;
			camera.position.y = 5;
			camera.lookAt(0, 0, 0);
			break;
		case 3:
			camera.position.x = 53;
			camera.position.z = 0;
			camera.position.y = 5;
			camera.lookAt(cone.position);
	}
		//camera.position.y = cone.position.y + 10;

	//cube.rotation.y += 0.05;
	//loader.rotation.y += 0.05;
	blackhole.rotation.y += 0.05;

	stepCone += 0.01;
	cone.position.x = 60*Math.sin(stepCone);
	cone.position.z = 60*Math.cos(stepCone);

	stepTorus += 0.08;
	torusKnot.position.x = cone.position.x-10*Math.sin(stepTorus);
	torusKnot.position.z = cone.position.z-10*Math.cos(stepTorus);
	torusKnot.rotation.y -= 0.08;

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
