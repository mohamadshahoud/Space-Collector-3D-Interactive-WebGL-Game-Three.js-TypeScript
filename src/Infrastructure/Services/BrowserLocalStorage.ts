import { IGameStorage } from '../../Core/Interfaces/IGameStorage';

export class BrowserLocalStorage implements IGameStorage {
    // Unique key for persisting the player's highest score
    private readonly HIGH_SCORE_KEY = 'space_game_high_score';

    // Compares and saves a new high score if it exceeds the currently stored record
    public saveHighScore(score: number): void {
        const currentHighScore = this.getHighScore();
        if (score > currentHighScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, score.toString());
            console.log(`New High Score Saved: ${score}`);
        }
    }

    // Retrieves the saved high score, returning 0 if no record exists
    public getHighScore(): number {
        const score = localStorage.getItem(this.HIGH_SCORE_KEY);
        return score ? parseInt(score, 10) : 0;
    }

    // Serializes and saves generic objects/data to localStorage by key
    public saveData(key: string, data: any): void {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
        } catch (error) {
            console.error('Error saving data to LocalStorage', error);
        }
    }

    // Fetches and parses generic serialized data back into its typed object format
    public getData<T>(key: string): T | null {
        try {
            const data = localStorage.getItem(key);
            if (!data) return null;
            return JSON.parse(data) as T;
        } catch (error) {
            console.error('Error reading data from LocalStorage', error);
            return null;
        }
    }

    // Completely wipes all saved entries and records from the browser storage
    public clearAllData(): void {
        localStorage.clear();
        console.log('Game storage cleared.');
    }
}