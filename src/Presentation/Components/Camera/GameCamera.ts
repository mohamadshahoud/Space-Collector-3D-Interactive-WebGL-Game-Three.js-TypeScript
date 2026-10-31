import * as THREE from 'three';

export class GameCamera {
    public instance: THREE.PerspectiveCamera;
    
    private offset = new THREE.Vector3(0, 3, 8); 
    private lookAtOffset = new THREE.Vector3(0, 0, -10);

    private defaultFOV = 55;
    private targetFOV = 75;

    constructor() {
        this.instance = new THREE.PerspectiveCamera(
            this.defaultFOV,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        window.addEventListener('wheel', (e) => this.handleZoom(e), { passive: true });
    }

    private handleZoom(event: WheelEvent): void {
        const zoomStep = 7;
        if (event.deltaY > 0) {
            this.targetFOV = Math.min(this.targetFOV + zoomStep, 90); 
        } else {
            this.targetFOV = Math.max(this.targetFOV - zoomStep, 90); 
        }
    }

    public follow(spaceshipMesh: THREE.Group, currentSpeed: number): void {
        
        const speedEffect = currentSpeed * 0.5; 
        this.instance.fov = THREE.MathUtils.lerp(this.instance.fov, this.targetFOV + speedEffect, 0.05);
        this.instance.updateProjectionMatrix();

        const relativeOffset = this.offset.clone().applyQuaternion(spaceshipMesh.quaternion);
        const cameraPosition = spaceshipMesh.position.clone().add(relativeOffset);

        this.instance.position.lerp(cameraPosition, 0.1);

        const relativeLookAt = this.lookAtOffset.clone().applyQuaternion(spaceshipMesh.quaternion);
        const lookAtPosition = spaceshipMesh.position.clone().add(relativeLookAt);

        this.instance.lookAt(lookAtPosition);
    }

    public handleResize(): void {
        this.instance.aspect = window.innerWidth / window.innerHeight;
        this.instance.updateProjectionMatrix();
    }
}