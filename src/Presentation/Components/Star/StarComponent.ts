import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { StarItem } from '../../../Core/Entities/StarItem';

export class StarComponent {
    public mesh: THREE.Group; 
    public data: StarItem;

    constructor(scene: THREE.Scene, x: number, y: number, z: number) {
        this.data = new StarItem(x, y, z);
        

        this.mesh = new THREE.Group();
        this.mesh.position.set(x, y, z);
        scene.add(this.mesh);

        this.loadStarModel();
    }

    private loadStarModel(): void {
        const loader = new GLTFLoader();
        const modelUrl = new URL('../../../assets/Models/glowing_star.glb', import.meta.url).href;

        loader.load(
            modelUrl, 
            (gltf) => {
                const model = gltf.scene;
                
                model.scale.set(0.6, 0.6, 0.6);
                this.mesh.add(model);
            },
            undefined,
            (error) => {
                console.error('An error occurred while loading the star model:', error);
            }
        );
    }

private time: number = Math.random() * 100;

public update(): void {
    this.time += 0.05;

    // Rotate the star slowly for life
    this.mesh.rotation.y += 0.02;
    this.mesh.rotation.x += 0.01;

    // Apply a smooth pulsating scale effect
    const pulseFactor = 1 + Math.sin(this.time) * 0.15; 
    this.mesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
}


    public destroy(scene: THREE.Scene): void {
    scene.remove(this.mesh);
    
    this.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
            } else {
                child.material.dispose();
            }
        }
    });
}
}