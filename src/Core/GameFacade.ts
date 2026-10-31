import { Game } from './Game';

export class GameFacade {
    private game: Game;
    private welcomeScreen: HTMLElement | null;
    private startButton: HTMLElement | null;

    constructor() {
        // Instantiate the core game engine
        this.game = Game.getInstance();
        
        // Cache DOM elements for the entry welcome layout
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.startButton = document.getElementById('start-game-btn');
    }

    // Attach trigger listener to the start button or boot directly if missing
    public initialize(): void {
        if (this.startButton) {
            // Use { once: true } to guarantee the listener fires exactly once
            this.startButton.addEventListener('click', () => this.startGame(), { once: true });
        } else {
            this.startGame();
        }
    }

    // Hide instructions viewport cleanly and kick off game loop processes
    private startGame(): void {
        if (this.welcomeScreen) {
            // Apply important rule programmatically to override any persistent CSS layout flexes
            this.welcomeScreen.style.setProperty('display', 'none', 'important');
        }

        // Fire the lifecycle entry method of the game core
        this.game.start();
    }

    // Explicitly fallback layout view to reveal the instructions screen
    public showWelcomeScreen(): void {
        if (this.welcomeScreen) {
            this.welcomeScreen.style.setProperty('display', 'flex', 'important');
        }
    }
}