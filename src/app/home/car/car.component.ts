import { Component, HostListener, OnInit } from '@angular/core';
import { CyberTruck } from 'src/app/models/cyber-truck';
import { Road } from 'src/app/models/road';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import * as dat from 'dat.gui';
@Component({
  selector: 'car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss'],
})
export class CarComponent implements OnInit {
  scene;
  camera;
  renderer;
  textureLoader = new THREE.TextureLoader();
  controls;
  GUI;
  road;
  cybertruck: CyberTruck;
  ambientLight;
  daylight;
  fogColor: any;
  constructor() {}

  ngOnInit() {
    this.init();
    this.spawnObjects();
  }
  adjustWindow = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    console.log(window.innerWidth);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(100, 100);
  };
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.adjustWindow();
  }
  spawnObjects = () => {
    this.scene.add(this.road.mesh);
    this.scene.add(this.cybertruck.mesh);
  };
  updateObjects = () => {
    if (this.scene.getObjectByName(this.cybertruck.mesh.name)) {
      this.cybertruck.move();

      if (this.cybertruck.mesh.position.z > this.road.tileSize)
        this.cybertruck.mesh.position.z -= this.road.tileSize;

      let cybertruckZ = this.cybertruck.mesh.position.z;
      this.daylight.position.z = cybertruckZ;
      this.scene.position.z = -cybertruckZ;
    }
  };
  renderScene = () => {
    this.updateObjects();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderScene);
  };
  init = () => {
    // setup
    let licensePlate = this.textureLoader.load(
        'https://i.ibb.co/R9tkkV0/license-plate.png'
      ),
      grassTile = this.textureLoader.load('https://i.ibb.co/KrgXYY5/grass.jpg'),
      roadTile = this.textureLoader.load('https://i.ibb.co/khVnGNv/road.jpg');

    this.scene = new THREE.Scene();
    this.fogColor = {
      h: 215,
      s: 80,
      l: 80,
    };
    this.scene.fog = new THREE.Fog(
      +`hsl(${this.fogColor.h},${this.fogColor.s}%,${this.fogColor.l}%)`,
      0.01,
      272
    );

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 30, -40);
    this.camera.lookAt(this.scene.position);

    this.renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: false,
    });
    this.renderer.setClearColor(this.scene.fog.color.getStyle());
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;

    let camControls = new OrbitControls(this.camera, this.renderer.domElement);
    camControls.enablePan = false;

    // road
    this.road = new Road(grassTile, roadTile);

    // cybertruck
    this.cybertruck = new CyberTruck(licensePlate);
    this.cybertruck.mesh.name = 'Cybertruck';
    this.cybertruck.mesh.position.y = this.cybertruck.height / 2;

    // ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff);
    this.ambientLight.intensity = 1;
    this.scene.add(this.ambientLight);

    // daylight
    this.daylight = new THREE.PointLight(
      0xffffff,
      this.ambientLight.intensity * 2
    );
    this.daylight.position.set(0, 64, 0);
    this.daylight.castShadow = true;
    this.scene.add(this.daylight);

    // config
    this.controls = {
      daylight: this.ambientLight.intensity,
      speed: this.cybertruck.speed,
      resetCam: () => {
        camControls.reset();
      },
    };
    this.GUI = new dat.GUI();
    this.GUI.add(this.controls, 'daylight', 0.1, 1, 0.01)
      .name('Daylight')
      .onChange((e) => {
        let newVal = this.controls.daylight;
        this.cybertruck.headlight.intensity = (1 - newVal) * 2;
        this.cybertruck.rearlight.intensity = (1 - newVal) * 2;
        this.ambientLight.intensity = newVal;
        this.daylight.intensity = newVal * 2;

        let h = this.fogColor.h,
          s = this.fogColor.s,
          l = newVal * 100;
        this.fogColor.l = l * 0.8;

        let daylightColorStr = `hsl(${h},${s}%,${l.toFixed(0)}%)`,
          fogColorStr = `hsl(${h},${s}%,${this.fogColor.l.toFixed(0)}%)`;

        this.daylight.color = new THREE.Color(daylightColorStr);
        this.renderer.setClearColor(fogColorStr);
        this.scene.fog.color.set(fogColorStr);
      });
    this.GUI.add(this.controls, 'speed', 0, 60, 1)
      .name('Speed (MPH)')
      .onChange((e) => {
        this.cybertruck.speed = this.controls.speed;
      });
    this.GUI.add(this.controls, 'resetCam').name('Reset Camera');

    // first render
    document.body.appendChild(this.renderer.domElement);
    this.renderScene();
  };
}
