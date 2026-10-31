// Presentation/UI/Screens/WinScreen.ts

export class WinScreen {
  private element: HTMLDivElement;
  private onPlayAgainCallback: () => void;

  constructor(onPlayAgain: () => void) {
    this.onPlayAgainCallback = onPlayAgain;

    this.element = document.createElement("div");
    this.element.id = "win-screen";
    this.element.className = "modal";
    this.element.style.display = "none";

    document.body.appendChild(this.element);
  }

  public show(percentage: number): void {
    let stars = 0;
    if (percentage === 50) stars = 5;
    else if (percentage === 75) stars = 10;
    else if (percentage === 100) stars = 60;

    this.element.innerHTML = `
        <h1>VICTORY</h1>
        <p class="subtitle">Completion Rate: <span id="win-ratio">${percentage}%</span></p>
        <p>Stars Collected: ${stars} Stars</p>
        <button id="btn-win-replay">PLAY AGAIN</button>
    `;

    this.element
      .querySelector("#btn-win-replay")
      ?.addEventListener("click", () => {
        this.hide();
        this.onPlayAgainCallback(); 
      });

    this.element.style.display = "flex";
  }

  public hide(): void {
    this.element.style.display = "none";
  }
}