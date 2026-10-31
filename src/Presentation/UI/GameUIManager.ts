// Presentation/UI/GameUIManager.ts
import { StartScreen, SettingsScreen, GameOverScreen, WinScreen } from './Screens';
import { GameHUD } from './GameHUD';
import { GameSettings } from './Screens/SettingsScreen';

export class GameUIManager {
    private startScreen: StartScreen;
    private settingsScreen: SettingsScreen;
    private gameOverScreen: GameOverScreen;
    private winScreen: WinScreen;
    private hud: GameHUD;

    constructor(callbacks: { 
        onStart: () => void, 
        onRestart: () => void,
        onApplySettings: (settings: GameSettings) => void 
    }) {
        this.hud = new GameHUD();

        this.settingsScreen = new SettingsScreen((settings) => {
            callbacks.onApplySettings(settings);
        });

        this.startScreen = new StartScreen(
            () => {
                this.hud.show();
                callbacks.onStart();
            },
            () => this.settingsScreen.show()
        );

        this.gameOverScreen = new GameOverScreen(() => {
            this.hud.show();
            callbacks.onRestart();
        });

        this.winScreen = new WinScreen(() => {
            this.hud.show();
            callbacks.onRestart();
        });
    }



    public triggerGameOver(): void {
        this.hud.hide();
        this.gameOverScreen.show();
    }

    public triggerWin(percentage: number, starsCollected: number): void {
        this.hud.hide();
        this.winScreen.show(percentage); 
    }
    public updateSpeed(speed: number): void { 
        if (this.hud && this.hud.speedVal) {
            this.hud.speedVal.innerText = Math.round(speed).toString(); 
        }
    }

    public updateScore(score: number): void { 
        if (this.hud && this.hud.scoreVal) {
            this.hud.scoreVal.innerText = score.toString(); 
        }
    }

    public updateHighScore(score: number): void { 
        if (this.hud && this.hud.highscoreVal) {
            this.hud.highscoreVal.innerText = score.toString(); 
        }
    }

    public updateWinProgress(percentage: number, starsCollected: number): void {
        console.log(`Progress: ${starsCollected} stars, Win potential: ${percentage}%`);
    }
}