// Presentation/UI/Screens/StartScreen.ts

export class StartScreen {
    private element: HTMLDivElement;

    constructor(onStart: () => void, onOpenSettings: () => void) {
        this.element = document.createElement('div');
        this.element.id = 'welcome-screen';
        this.element.className = 'ui-overlay';
        
        this.element.innerHTML = `
            <div class="welcome-box">
                <h1>Start Game</h1>
                <p class="subtitle">Ready to explore the cosmos?</p>
                <div class="instructions">
                    <h3>Control Instructions:</h3>
                    <ul>
                        <li><strong>W / arrow up:</strong> increase speed</li>
                        <li><strong>S / arrow down:</strong> decrease speed</li>
                        <li><strong>A / D or mouse (left/right):</strong> lateral turning</li>
                        <li><strong>Vertical mouse movement:</strong> steering up/down</li>
                    </ul>
                </div>
                <div class="menu-buttons" style="display: flex; gap: 15px; justify-content: center; margin-top: 20px;">
                    <button id="start-game-btn">Start Game</button>
                    <button id="open-settings-btn">Settings ⚙️</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.element);

        this.element.querySelector('#start-game-btn')?.addEventListener('click', () => {
            this.hide();
            onStart();
        });

        this.element.querySelector('#open-settings-btn')?.addEventListener('click', () => {
            onOpenSettings();
        });
    }

    public show(): void { this.element.style.display = 'flex'; }
    public hide(): void { this.element.style.display = 'none'; }
}