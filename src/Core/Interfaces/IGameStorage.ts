export interface IGameStorage {

    saveHighScore(score: number): void;

    getHighScore(): number;

    saveData(key: string, data: any): void;

    getData<T>(key: string): T | null;

    clearAllData(): void;
}