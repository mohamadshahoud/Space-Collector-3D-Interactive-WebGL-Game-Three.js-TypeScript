export class SpaceshipState {
    public speed: number;
    public maxSpeed: number;
    public rotationSpeed: number;
    public isDead: boolean;

    constructor(maxSpeed: number = 0.5, rotationSpeed: number = 0.05) {
        this.speed = 0;
        this.maxSpeed = maxSpeed;
        this.rotationSpeed = rotationSpeed;
        this.isDead = false;
    }

    public reset(): void {
        this.speed = 0;
        this.isDead = false;
    }
}