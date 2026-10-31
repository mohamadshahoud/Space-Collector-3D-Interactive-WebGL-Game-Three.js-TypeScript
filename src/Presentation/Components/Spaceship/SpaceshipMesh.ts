import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SpaceshipState } from '../../../Core/Entities/Spaceship';

export class SpaceshipMesh {
    public mesh: THREE.Group;
    public currentSpeed: number = 0;
    private state: SpaceshipState;
    private keysPressed: Record<string, boolean> = {};

   
    private currentRoll: number = 0;
    private maxRoll: number = 0.5; 

    public mousePositionNameY: number = 0; 
    private maxPitch: number = 0.8;        
    private verticalFlySpeed: number = 8;  

    public mousePositionNameX: number = 0;
    private yawSpeed: number = 0.03;       

    private acceleration: number = 0.005; 
    private friction: number = 0.99;     

    constructor(scene: THREE.Scene) {
        this.state = new SpaceshipState();
        this.mesh = new THREE.Group();
        scene.add(this.mesh);

        this.loadSpaceshipModel();

        window.addEventListener('keydown', (e) => this.keysPressed[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.keysPressed[e.key.toLowerCase()] = false);
    }

    public get maxSpeed(): number {
        return this.state.maxSpeed;
    }

    private loadSpaceshipModel(): void {
        const loader = new GLTFLoader();
        const modelUrl = new URL('../../../assets/Models/spaceship.glb', import.meta.url).href;
        loader.load(modelUrl, (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5);
            
            model.rotation.y = Math.PI; 

            this.mesh.add(model);
        }, undefined, (err) => console.error(err));
    }

    public update(): void {
    if (this.mesh.children.length === 0) return;

    if (this.keysPressed['w'] || this.keysPressed['arrowup']) {
        this.currentSpeed = Math.min(this.currentSpeed + this.acceleration, this.state.maxSpeed);
    } 
    else if (this.keysPressed['s'] || this.keysPressed['arrowdown']) {
        this.currentSpeed = Math.max(this.currentSpeed - this.acceleration, -this.state.maxSpeed);
    } 
    else {
        this.currentSpeed *= this.friction;
        if (Math.abs(this.currentSpeed) < 0.001) this.currentSpeed = 0;
    }

    
    const targetPitch = -this.mousePositionNameY * this.maxPitch;
    this.mesh.rotation.x = THREE.MathUtils.lerp(this.mesh.rotation.x, targetPitch, 0.05);

    if (Math.abs(this.mousePositionNameX) > 0.02) { 
        const speedFactor = this.currentSpeed / this.state.maxSpeed;
        this.mesh.rotation.y -= this.mousePositionNameX * this.yawSpeed * speedFactor;
    }

    this.mesh.translateZ(-this.currentSpeed);

    this.mesh.position.y = THREE.MathUtils.clamp(this.mesh.position.y, -200, 120);

    let targetRoll = 0;
    if (this.keysPressed['a'] || this.keysPressed['arrowleft'] || this.mousePositionNameX < -0.1) {
        if (this.keysPressed['a'] || this.keysPressed['arrowleft']) {
            this.mesh.rotation.y += this.state.rotationSpeed;
        }
        targetRoll = -this.maxRoll;
    }
    else if (this.keysPressed['d'] || this.keysPressed['arrowright'] || this.mousePositionNameX > 0.1) {
        if (this.keysPressed['d'] || this.keysPressed['arrowright']) {
            this.mesh.rotation.y -= this.state.rotationSpeed;
        }
        targetRoll = this.maxRoll;
    }

    this.currentRoll = THREE.MathUtils.lerp(this.currentRoll, targetRoll, 0.05);
    this.mesh.children[0].rotation.z = this.currentRoll;
}
}