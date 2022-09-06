// declaracion de variables globales

import './style.css'

import * as THREE from 'three';

// importando OrbitControls de examples
//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

//
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

// textura earth
const earthTexture = new THREE.TextureLoader().load('world.jpg');

// agregando earth
const earth = new THREE.Mesh(
	new THREE.SphereGeometry(5, 15, 15),
	new THREE.MeshLambertMaterial({
		//color: 0xff00ff,
		map: earthTexture
	})
);
earth.receiveShadow = true;
scene.add(earth);

// agregando modelo 3D blackhole
let blackhole;
let blackholeLoader = new GLTFLoader();
blackholeLoader.load('a_black_hole.glb', function (gltf) {
	//scene.add(gltf.scene);
	blackhole = gltf.scene;
	blackhole.scale.set(10, 10, 10);
	scene.add(blackhole);
}, undefined, function (error){
	console.log('No se cargó el modelo 3D');
	console.log(error);
});

/*
// textura sol
const cubeTexture = new THREE.TextureLoader().load('./sun.jpg');

// objeto sol
const cube = new THREE.Mesh(
	new THREE.BoxGeometry(30, 30, 30),
	new THREE.MeshMatcapMaterial({
		//color: 0x00ff00
		map: cubeTexture
	})
);
*/

// agregando luna
const torusKnot = new THREE.Mesh(
	new THREE.TorusKnotGeometry(2, 0.5, 20, 5),
	new THREE.MeshLambertMaterial({color: 0xf0f0f0})
);
torusKnot.receiveShadow = true;
scene.add(torusKnot);

// agregando luz blanca central
const pointLight = new THREE.PointLight(0xffffff);
scene.add(pointLight);

//const ambientLigth = new THREE.AmbientLight(0xffffff);
//scene.add(pointLight, ambientLigth); // agregando dos objetos a la vez

// creando helpers para debugging
// muestra graficamente el objeto deseado
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(50, 10);
//scene.add(lightHelper, gridHelper); // agregando helpers a scene

// agregando controles de camera para moverse en la scene
//const controls = new OrbitControls(camera, renderer.domElement);

// agregando fondo a la scene
/*
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
spaceTexture.wrapS = THREE.RepeatWrapping;
spaceTexture.wrapT = THREE.RepeatWrapping;
spaceTexture.repeat.set(4, 4)
scene.background = spaceTexture;
*/

// fondo dinamico
const bgScene = new THREE.Mesh(
	new THREE.SphereGeometry(320, 20, 20),
	new THREE.MeshBasicMaterial({
		map: (new THREE.TextureLoader).load('space.jpg'),
		side: THREE.DoubleSide
	})
);
scene.add(bgScene);

// agregando un listener a la camera (para escuchar musica)
const listener = new THREE.AudioListener();
camera.add(listener);

const sound1 = new THREE.Audio(listener);
const stay = document.getElementById('stay');
sound1.setMediaElementSource(stay);
sound1.setVolume(0.5);
stay.play();

// pasos para movimiento de los cuerpos celestes
var stepEarth = 0;
var stepTorus = 0;

// atributos de modo de vuelo
var canFly = false;
var canDown = false;
var canUp = false;
var mode = 0;

const onkeydown = function(e){
	switch(e.code){
		case 'ArrowUp':
		case 'KeyW':
			canUp = true;
			//camera.position.x += 1;
			break;
		case 'ArrowDown':
		case 'KeyS':
			canDown = true;
			break;
		case 'Space':
			canFly = !canFly;
			//camera.position.x -= 1;
			break;
		case 'KeyM':
			mode = (mode < 5)?mode + 1 : 0;
	}
};

const onkeyup = function(e){
	switch(e.code){
		case 'ArrowUp':
		case 'KeyW':
			canUp = false;
			break;
		case 'ArrowDown':
		case 'KeyS':
			canDown = false;
	}
};

document.addEventListener('keydown', onkeydown);
document.addEventListener('keyup', onkeyup);

// cuando detecte click del raton, bloquear controles
document.addEventListener('click', function(){
	controls.lock();
});

// loop infinito
function animate() {

	requestAnimationFrame(animate);

	renderer.setSize(window.innerWidth, window.innerHeight);

	// rotacion de la tierra
	earth.rotation.y += 0.1;

	// Movimientos de camara dependiendo del modo
	switch (mode){
		case 0:
			// rotando alrededor de la tierra
			camera.position.x = 60*Math.sin(stepEarth)+20;
			camera.position.z = 60*Math.cos(stepEarth)+20;
			camera.position.y = 5;
			camera.lookAt(0, 0, 0);
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
			// vista hacia la tierra
			camera.position.x = 53;
			camera.position.z = 0;
			camera.position.y = 5;
			camera.lookAt(earth.position);
			break;
		case 4:
			// siguiendo a la tierra en la misma orbita solar
			camera.position.x = 75*Math.sin(stepEarth+0.6);
			camera.position.z = 75*Math.cos(stepEarth+0.6);
			camera.position.y = 10;
			camera.lookAt(earth.position);
			break;
	}

	// Rotación del blackhole
	blackhole.rotation.y += 0.05;

	// Movimiento de la tierra
	stepEarth += 0.01;
	earth.position.x = 60*Math.sin(stepEarth);
	earth.position.z = 60*Math.cos(stepEarth);

	// Movimiento de la luna
	stepTorus += 0.08;
	torusKnot.position.x = earth.position.x-10*Math.sin(stepTorus);
	torusKnot.position.z = earth.position.z-10*Math.cos(stepTorus);
	torusKnot.rotation.y -= 0.08;

	// update de controls
	//controls.update();

	//(lockC)?controls.lock():0;
	if (controls.isLocked === true){
		controls.lock();
	}

	if (canFly){
		controls.moveForward(0.1);
	}

	if (canUp){
		controls.getObject().position.y += 0.1;
	}

	if (canDown){
		controls.getObject().position.y -= 0.1;
	}

	// dibujando los elementos scene y camera
	renderer.render(scene, camera);
}

animate();
