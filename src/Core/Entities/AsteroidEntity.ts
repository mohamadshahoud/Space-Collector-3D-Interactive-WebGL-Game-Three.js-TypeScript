export class AsteroidEntity {
  public id: string;
  public position: { x: number; y: number; z: number };
  public speed: { x: number; y: number; z: number };
  public rotationSpeed: { x: number; y: number };
  public radius: number;
  public damagePenalty: number = 20; 

  constructor(x: number, y: number, z: number) {
    this.id = crypto.randomUUID();
    this.position = { x, y, z };
    
    this.radius = Math.random() * 3 + 1.5;

    this.speed = {
      x: (Math.random() - 0.5) * 0.2,
      y: (Math.random() - 0.5) * 0.1,
      z: (Math.random() - 0.5) * 0.2 + 0.1
    };

    this.rotationSpeed = {
      x: Math.random() * 0.02,
      y: Math.random() * 0.02
    };
  }

  public step(): void {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
    this.position.z += this.speed.z;
  }
}