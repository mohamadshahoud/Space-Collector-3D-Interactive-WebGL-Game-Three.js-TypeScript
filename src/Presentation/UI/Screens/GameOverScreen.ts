// Presentation/UI/Screens/GameOverScreen.ts
export class GameOverScreen {
    private element: HTMLDivElement;

    constructor(onRetry: () => void) {
        this.element = document.createElement('div');
        this.element.id = 'game-over-screen';
        this.element.className = 'modal';
        this.element.style.display = 'none';
        this.element.innerHTML = `
            <h1>TIME EXPIRED</h1>
            <p>MISSION FAILED. TRY AGAIN.</p>
            <button>RETRY</button>
        `;

        document.body.appendChild(this.element);
        this.element.querySelector('button')?.addEventListener('click', () => {
            this.hide();
            onRetry();
        });
    }

    public show(): void { this.element.style.display = 'flex'; }
    public hide(): void { this.element.style.display = 'none'; }
}