import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// La scene sert a contenir tous les objets que l'on veut afficher
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const renderer = new THREE.WebGLRenderer();
// On set le size du renderer
renderer.setSize(window.innerWidth, window.innerHeight);
// On ajoute le renderer a la page
document.body.appendChild(renderer.domElement);
// La camera servira a determiner ce que l'on voit et comment on le voit
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 20, 100 );
controls.update();
// On cree un cube
// Geometry sert a definir la forme du cube
const geometry = new THREE.BoxGeometry();
// Material sert a definir la couleur ou texture du cube

const loaderTexture = new THREE.TextureLoader();
const texture = loaderTexture.load('cubo.png');

function handleDeviceMotion(event) {
    const accelerationX = event.acceleration.x;
    const accelerationY = event.acceleration.y;
    const accelerationZ = event.acceleration.z;

    cube.position.x += accelerationX * 0.1;
    cube.position.y += accelerationY * 0.1;
    cube.position.z += accelerationZ * 0.1;
}

window.addEventListener('devicemotion', handleDeviceMotion);


const particleGeometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({ color: 0x0000FF, size: 0.1 });


const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * 100 - 50;
    const y = Math.random() * 100 - 50;
    const z = Math.random() * 100 - 50;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);


const material = new THREE.MeshBasicMaterial();
material.map = texture;

const materialRoom = new THREE.MeshBasicMaterial();
const textureRoom = loaderTexture.load('textureHouse.jpeg');
materialRoom.map = textureRoom;

// On cree le cube avec la geometry et le material
const cube = new THREE.Mesh(geometry, material);

const loader = new OBJLoader();

// load a resource
loader.load(
    // resource URL
    'room.obj',
    // called when resource is loaded
    function ( object ) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = materialRoom;
            }
        });
        scene.add( object );
    },
    // called when loading is in progresses
    function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

        console.log( 'An error happened' );

    }
);

// On ajoute le cube a la scene
scene.add(cube);
cube.position.x = 0;
cube.position.y = 3;
cube.position.z = 0;
camera.position.z = 10;

// On cree une fonction qui va etre appellee a chaque frame
const animate = function () {
    // On demande au browser d'appeler la fonction animate a chaque frame
    requestAnimationFrame(animate);

    // On fait tourner le cube sur lui meme
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update();
    // On render la scene avec la camera
    renderer.render(scene, camera);
}



// On appelle la fonction animate une premiere fois
animate();

