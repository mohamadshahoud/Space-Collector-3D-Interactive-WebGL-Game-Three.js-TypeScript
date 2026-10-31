import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class GameControls {
    public instance: OrbitControls;

    constructor(camera: THREE.PerspectiveCamera, domElement: HTMLCanvasElement) {
        this.instance = new OrbitControls(camera, domElement);
        this.configureControls();
    }

    private configureControls(): void {
        this.instance.enableRotate = true;
        this.instance.rotateSpeed = 0.8; 

        this.instance.enableZoom = true;
        this.instance.zoomSpeed = 3.2; 
        
        this.instance.minDistance = 5;  
        this.instance.maxDistance = 30;

        this.instance.enableDamping = true;
        this.instance.dampingFactor = 0.05;

        
        this.instance.maxPolarAngle = Math.PI / 0.5; 
    }

    public update(targetPosition: THREE.Vector3): void {
        this.instance.target.copy(targetPosition);
        
        this.instance.update();
    }
}