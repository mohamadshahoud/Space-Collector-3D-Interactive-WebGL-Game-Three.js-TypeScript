import * as THREE from 'three';

export class GameEnvironment {
    private starfield!: THREE.Points;

    constructor(scene: THREE.Scene) {
        scene.fog = new THREE.FogExp2(0x020208, 0.015);

        this.createStarfield(scene);
    }


    private createStarfield(scene: THREE.Scene): void {
        const starsCount = 2000; 
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 500;     
            positions[i + 1] = (Math.random() - 0.5) * 500; 
            positions[i + 2] = (Math.random() - 0.5) * 500; 
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.7,           
            sizeAttenuation: true 
        });

        this.starfield = new THREE.Points(geometry, material);
        scene.add(this.starfield);
    }

    public update(): void {
        if (this.starfield) {
            this.starfield.rotation.y += 0.0003;
        }
    }
}