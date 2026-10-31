import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { TimeCrystalEntity } from '../../../Core/Entities/TimeCrystalEntity'; 

export class TimeCrystalComponent {
    public mesh!: THREE.Group;
    public entity: TimeCrystalEntity;
    private isLoaded = false;
    private rotationSpeed: number;

    constructor(scene: THREE.Scene, entity: TimeCrystalEntity) {
        this.entity = entity;
        
        this.mesh = new THREE.Group();
        this.mesh.position.set(this.entity.position.x, this.entity.position.y, this.entity.position.z);
        scene.add(this.mesh);

        this.rotationSpeed = 0.02 + Math.random() * 0.01;
        const loader = new GLTFLoader();
        const modelUrl = new URL('../../../assets/Models/clock.glb', import.meta.url).href;
        
        loader.load(
            modelUrl, 
            (gltf: GLTF) => { 
                const model = gltf.scene;

                model.scale.set(11.5, 11.5, 11.5); 
                model.rotation.y = Math.PI;

                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
                        if (child.material && !Array.isArray(child.material)) {
                            const mat = child.material as THREE.MeshStandardMaterial;
                            if ('emissive' in mat) {
                                mat.emissive = new THREE.Color(0x00ff88);
                                mat.emissiveIntensity = 0.3;
                            }
                        }
                    }
                });

                this.mesh.add(model);
                this.isLoaded = true;
            },
            (xhr: ProgressEvent) => { 
                console.log(`Clock model ${(xhr.loaded / xhr.total * 100)}% loaded`);
            },
            (error: ErrorEvent | unknown) => { 
                console.error('An error happened while loading the GLB model:', error);
            }
        );
    }

    public update(): void {
        if (this.isLoaded) {
            this.mesh.rotation.y += this.rotationSpeed;
            
            const time = Date.now() * 0.003;
            this.mesh.position.y = this.entity.position.y + Math.sin(time) * 0.01;
            
            this.entity.position.x = this.mesh.position.x;
            this.entity.position.y = this.mesh.position.y;
            this.entity.position.z = this.mesh.position.z;
        }
    }

    public destroy(scene: THREE.Scene): void {
        scene.remove(this.mesh);
        
        this.mesh.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                if (object.geometry) object.geometry.dispose();
                
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach((mat) => {
                            if (typeof mat.dispose === 'function') mat.dispose();
                        });
                    } else {
                        if (typeof object.material.dispose === 'function') {
                            object.material.dispose();
                        }
                    }
                }
            }
        });
    }
}