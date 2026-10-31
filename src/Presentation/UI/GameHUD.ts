// Presentation/UI/GameHUD.ts
export class GameHUD {
    public element: HTMLDivElement;
    public timerVal!: HTMLElement;
    public speedVal!: HTMLElement;
    public scoreVal!: HTMLElement;
    public highscoreVal!: HTMLElement;

    constructor() {
        this.element = document.createElement('div');
        this.element.id = 'game-hud';
        this.element.style.display = 'none';
        this.element.innerHTML = `
            <div class="hud-item" style="border-left-color: #ff4444 !important;"><span class="label">TIME LEFT</span><span id="timer-val" class="value">60</span></div>
            <div class="hud-item"><span class="label">SPEED</span><span id="speed-val" class="value">0</span></div>
            <div class="hud-item" style="border-left-color: #ffd700 !important;"><span class="label">SCORE</span><span id="score-val" class="value">0</span></div>
            <div class="hud-item" style="border-left-color: #ff00ea !important;"><span class="label">RECORD</span><span id="highscore-val" class="value">0</span></div>
        `;
        document.body.appendChild(this.element);

        this.timerVal = this.element.querySelector('#timer-val')!;
        this.speedVal = this.element.querySelector('#speed-val')!;
        this.scoreVal = this.element.querySelector('#score-val')!;
        this.highscoreVal = this.element.querySelector('#highscore-val')!;
    }

    public show(): void { this.element.style.display = 'flex'; }
    public hide(): void { this.element.style.display = 'none'; }
}