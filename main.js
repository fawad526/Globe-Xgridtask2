import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Globe from "three-globe";

import countries from "./files/custom.geo.json";
import map from "./files/map.json";
import lines from "./files/lines.json";

var renderer, camera, scene, controls;

let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
var globe, animationRequest;

init();
initGlobe();
onWindowResize();
animate();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  var ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.3);
  scene.add(ambientLight);
  scene.background = new THREE.Color("gray");

  camera = new THREE.PerspectiveCamera();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  var dLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dLight.position.set(-800, 2000, 400);
  camera.add(dLight);

  var dLight1 = new THREE.DirectionalLight(0x7982f6, 1);
  dLight1.position.set(-200, 500, 200);
  camera.add(dLight1);

  var dLight2 = new THREE.DirectionalLight(0x8566cc, 0.5);
  dLight2.position.set(-200, 500, 200);
  camera.add(dLight2);

  camera.position.z = 400;
  camera.position.x = 0;
  camera.position.y = 0;

  scene.add(camera);

  scene.fog = new THREE.Fog(0x535ef3, 400, 2000);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dynamicDampingFactor = 0.01;
  controls.enablePan = false;
  controls.minDistance = 200;
  controls.maxDistance = 500;
  controls.rotateSpeed = 0.8;
  controls.zoomSpeed = 0.1;
  controls.autoRotate = true;

  controls.minPolarAngle = Math.PI / 3.5;
  controls.maxPolarAngle = Math.PI - Math.PI / 3.5;

  window.addEventListener("resize", onWindowResize, false);
  document.addEventListener("mousemove", onMouseMove);
}

function initGlobe() {
  globe = new Globe({
    waitForGlobeReady: true,
    animateIn: true,
  })
    .hexPolygonsData(countries.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .showAtmosphere(true)
    .atmosphereColor("gray")
    .atmosphereAltitude(0.25);

  setTimeout(() => {
    globe
      .arcsData(lines.pulls)
      .arcColor((e) => (e.status ? "#9cff00" : "#ff4000"))
      .arcAltitude((e) => e.arcAlt)
      .arcStroke((e) => (e.status ? 0.7 : 0.3))
      .arcDashLength(0.9)
      .arcDashGap(4)
      .arcDashAnimateTime(1000);

    globe
      .labelsData(map.maps)
      .labelColor(() => "#ffcb21")
      .labelDotRadius(0.3)
      .labelSize((e) => e.size)
      .labelText("city")
      .labelResolution(6)
      .labelAltitude(0.01);

    globe
      .pointsData(map.maps)
      .pointColor(() => "")
      .pointMerge(true)
      .pointAltitude(0.07)
      .pointRadius(0.05);
  }, 1000);

  globe.rotateY(-Math.PI * (5 / 9));
  globe.rotateZ(-Math.PI / 6);
  const globeMaterial = globe.globeMaterial();
  globeMaterial.color = new THREE.Color(0x002c59);
  globeMaterial.emissive = new THREE.Color(0x220038);
  globeMaterial.emissiveIntensity = 0.1;
  globeMaterial.shininess = 0.7;

  scene.add(globe);
}

function onMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  windowHalfX = window.innerWidth / 1.5;
  windowHalfY = window.innerHeight / 1.5;
}

function animate() {
  camera.position.x +=
    Math.abs(mouseX) <= windowHalfX / 2
      ? (mouseX / 2 - camera.position.x) * 0.005
      : 0;
  camera.position.y += (-mouseY / 2 - camera.position.y) * 0.005;
  camera.lookAt(scene.position);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationRequest);
});
