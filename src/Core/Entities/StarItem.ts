export class StarItem {
    public position: { x: number; y: number; z: number };
    public points: number;
    public isCollected: boolean;

    constructor(x: number, y: number, z: number, points: number = 10) {
        this.position = { x, y, z };
        this.points = points;
        this.isCollected = false;
    }

    public collect(): void {
        this.isCollected = true;
    }
}