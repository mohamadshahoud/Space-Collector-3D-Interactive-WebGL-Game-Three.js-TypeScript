// Presentation/UI/Screens/SettingsScreen.ts

export interface GameSettings {
    volume: number;
    isMuted: boolean;
    difficulty: 'easy' | 'normal' | 'hard';
}

export class SettingsScreen {
    private element: HTMLDivElement;
    private currentSettings: GameSettings;

    constructor(onSettingsChanged: (settings: GameSettings) => void) {
        // الإعدادات الافتراضية
        this.currentSettings = {
            volume: 80,
            isMuted: false,
            difficulty: 'normal'
        };

        this.element = document.createElement('div');
        this.element.id = 'settings-screen';
        this.element.className = 'modal';
        this.element.style.display = 'none';
        
        this.element.innerHTML = `
            <div class="modal-content" style="background: #222; padding: 30px; border-radius: 10px; color: #fff; text-align: center;">
                <h1>GAME SETTINGS</h1>
                
                <div class="settings-group" style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 10px;">Volume: <span id="vol-txt">80%</span></label>
                    <input type="range" id="volume-slider" min="0" max="100" value="80" style="width: 80%;">
                </div>

                <div class="settings-group" style="margin: 20px 0;">
                    <label>
                        <input type="checkbox" id="mute-checkbox"> Mute Audio
                    </label>
                </div>

                <div class="settings-group" style="margin: 20px 0;">
                    <label style="margin-right: 10px;">Difficulty:</label>
                    <select id="difficulty-select" style="padding: 5px 10px; background: #333; color: #fff; border: 1px solid #555;">
                        <option value="easy">Easy (Time: 90s)</option>
                        <option value="normal" selected>Normal (Time: 60s)</option>
                        <option value="hard">Hard (Time: 45s)</option>
                    </select>
                </div>

                <button id="close-settings-btn" style="margin-top: 20px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">SAVE & CLOSE</button>
            </div>
        `;

        document.body.appendChild(this.element);
        this.setupEvents(onSettingsChanged);
    }

    private setupEvents(onSettingsChanged: (settings: GameSettings) => void): void {
        const slider = this.element.querySelector('#volume-slider') as HTMLInputElement;
        const checkbox = this.element.querySelector('#mute-checkbox') as HTMLInputElement;
        const select = this.element.querySelector('#difficulty-select') as HTMLSelectElement;
        const volTxt = this.element.querySelector('#vol-txt') as HTMLElement;
        const closeBtn = this.element.querySelector('#close-settings-btn');

        // تحديث النص عند سحب شريط الصوت
        slider.addEventListener('input', () => {
            volTxt.innerText = `${slider.value}%`;
        });

        // عند الضغط على حفظ وإغلاق
        closeBtn?.addEventListener('click', () => {
            this.currentSettings = {
                volume: parseInt(slider.value),
                isMuted: checkbox.checked,
                difficulty: select.value as 'easy' | 'normal' | 'hard'
            };
            
            onSettingsChanged(this.currentSettings); // إرسال الإعدادات للمحرك
            this.hide();
        });
    }

    public show(): void { this.element.style.display = 'flex'; }
    public hide(): void { this.element.style.display = 'none'; }
}