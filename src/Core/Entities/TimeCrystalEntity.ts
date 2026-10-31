export class TimeCrystalEntity {
  public id: string;
  public position: { x: number; y: number; z: number };
  public timeBonus: number; 
  public isCollected: boolean = false;

  constructor(x: number, y: number, z: number, timeBonus: number = 5) {
    this.id = crypto.randomUUID(); 
    this.position = { x, y, z };
    this.timeBonus = timeBonus;
  }

  public collect(): number {
    if (this.isCollected) return 0;
    this.isCollected = true;
    return this.timeBonus;
  }
}