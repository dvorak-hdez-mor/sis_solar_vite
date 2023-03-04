// Global variables

import './style.css'

import * as THREE from 'three';

// import OrbitControls
//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

//
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

// import 3D loader library 
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

// add scene, camera, renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

let controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// renderer properties
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// camera properties
camera.position.setZ(25);
camera.position.setY(1);
camera.position.setX(25);

// earth texture
const earthTexture = new THREE.TextureLoader().load('world.jpg');

// add earth
const earth = new THREE.Mesh(
	new THREE.SphereGeometry(5, 15, 15),
	new THREE.MeshLambertMaterial({
		//color: 0xff00ff,
		map: earthTexture
	})
);
earth.receiveShadow = true;
scene.add(earth);

// add black hole 3D model
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

// add moon
const torusKnot = new THREE.Mesh(
	new THREE.TorusKnotGeometry(2, 0.5, 20, 5),
	new THREE.MeshLambertMaterial({color: 0xf0f0f0})
);
torusKnot.receiveShadow = true;
scene.add(torusKnot);

// add pointLight
const pointLight = new THREE.PointLight(0xffffff);
scene.add(pointLight);

//const ambientLigth = new THREE.AmbientLight(0xffffff);
//scene.add(pointLight, ambientLigth); // add two objects at same time

// debugging
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(50, 10);
//scene.add(lightHelper, gridHelper); // agregando helpers a scene

// add camera controls
//const controls = new OrbitControls(camera, renderer.domElement);

// add background
/*
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
spaceTexture.wrapS = THREE.RepeatWrapping;
spaceTexture.wrapT = THREE.RepeatWrapping;
spaceTexture.repeat.set(4, 4)
scene.background = spaceTexture;
*/

// dynamic background
const bgScene = new THREE.Mesh(
	new THREE.SphereGeometry(320, 20, 20),
	new THREE.MeshBasicMaterial({
		map: (new THREE.TextureLoader).load('space.jpg'),
		side: THREE.DoubleSide
	})
);
scene.add(bgScene);

// add camera listener
const listener = new THREE.AudioListener();
camera.add(listener);

const sound1 = new THREE.Audio(listener);
const stay = document.getElementById('stay');
sound1.setMediaElementSource(stay);
sound1.setVolume(0.5);
stay.play();

// movement properties
var stepEarth = 0;
var stepTorus = 0;

// "flying mode" properties
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

// block mouse when click event
document.addEventListener('click', function(){
	controls.lock();
});

// loop
function animate() {

	requestAnimationFrame(animate);

	renderer.setSize(window.innerWidth, window.innerHeight);

	// Earth rotation
	earth.rotation.y += 0.1;

	// camera modes
	switch (mode){
		case 0:
			// rotate around the earth
			camera.position.x = 60*Math.sin(stepEarth)+20;
			camera.position.z = 60*Math.cos(stepEarth)+20;
			camera.position.y = 5;
			camera.lookAt(0, 0, 0);
			break;
		case 1:
			// top view
			camera.position.x = 0;
			camera.position.z = 0;
			camera.position.y = 60;
			camera.lookAt(0, 0, 0);
			break;
		case 2:
			// lateral view
			camera.position.x = 80;
			camera.position.z = 0;
			camera.position.y = 5;
			camera.lookAt(0, 0, 0);
			break;
		case 3:
			// to earth view
			camera.position.x = 53;
			camera.position.z = 0;
			camera.position.y = 5;
			camera.lookAt(earth.position);
			break;
		case 4:
			// following the earth in the same orbital line
			camera.position.x = 75*Math.sin(stepEarth+0.6);
			camera.position.z = 75*Math.cos(stepEarth+0.6);
			camera.position.y = 10;
			camera.lookAt(earth.position);
			break;
	}

	// black hole rotation
	blackhole.rotation.y += 0.05;

	// Earth movement
	stepEarth += 0.01;
	earth.position.x = 60*Math.sin(stepEarth);
	earth.position.z = 60*Math.cos(stepEarth);

	// moon movement
	stepTorus += 0.08;
	torusKnot.position.x = earth.position.x-10*Math.sin(stepTorus);
	torusKnot.position.z = earth.position.z-10*Math.cos(stepTorus);
	torusKnot.rotation.y -= 0.08;

	//controls.update();

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

	// rendering scene and camera
	renderer.render(scene, camera);
}

animate();
