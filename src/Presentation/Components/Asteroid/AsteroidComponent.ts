import * as THREE from 'three';
import { AsteroidEntity } from '../../../Core/Entities/AsteroidEntity'; 

export class AsteroidComponent {
    public mesh!: THREE.Mesh;
    public entity: AsteroidEntity; 

    constructor(scene: THREE.Scene, entity: AsteroidEntity) {
        this.entity = entity;

        const geometry = new THREE.DodecahedronGeometry(this.entity.radius, 1); 
        
        const positionAttribute = geometry.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
            const vx = positionAttribute.getX(i);
            const vy = positionAttribute.getY(i);
            const vz = positionAttribute.getZ(i);
            
            positionAttribute.setXYZ(
                i,
                vx + (Math.random() - 0.5) * 0.4,
                vy + (Math.random() - 0.5) * 0.4,
                vz + (Math.random() - 0.5) * 0.4
            );
        }
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: 0x554444,
            roughness: 0.9,
            metalness: 0.1,
            flatShading: true 
        });

        this.mesh = new THREE.Mesh(geometry, material);
        
        this.mesh.position.set(this.entity.position.x, this.entity.position.y, this.entity.position.z);
        scene.add(this.mesh);
    }

    public update(): void {
        this.entity.step();

        this.mesh.position.set(this.entity.position.x, this.entity.position.y, this.entity.position.z);

        this.mesh.rotation.x += this.entity.rotationSpeed.x;
        this.mesh.rotation.y += this.entity.rotationSpeed.y;
    }

    public destroy(scene: THREE.Scene): void {
        scene.remove(this.mesh);
        this.mesh.geometry.dispose();
        if (Array.isArray(this.mesh.material)) {
            this.mesh.material.forEach(m => m.dispose());
        } else {
            this.mesh.material.dispose();
        }
    }
}