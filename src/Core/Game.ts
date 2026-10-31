import * as THREE from "three";
import { GameCamera } from "../Presentation/Components/Camera/GameCamera";
import { GameEnvironment } from "../Presentation/Components/Environment/GameEnvironment";
import { SpaceshipMesh } from "../Presentation/Components/Spaceship/SpaceshipMesh";
import { StarComponent } from "../Presentation/Components/Star/StarComponent";
import { BrowserLocalStorage } from "../Infrastructure/Services/BrowserLocalStorage";
import { WebAudioService } from "../Infrastructure/Services/WebAudioService";
import { GameUIManager } from "../Presentation/UI/GameUIManager";
import { AsteroidComponent } from "../Presentation/Components/Asteroid/AsteroidComponent";
import { TimeCrystalComponent } from "../Presentation/Components/TimeCrystal/TimeCrystalComponent";
import { TimeCrystalEntity } from "./Entities/TimeCrystalEntity";
import { AsteroidEntity } from "./Entities/AsteroidEntity";

export class Game {
  private static instance: Game;
  // Core engine components
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private gameCamera!: GameCamera;
  private environment!: GameEnvironment;
  private spaceship!: SpaceshipMesh;
  private storageService!: BrowserLocalStorage;
  private audioService!: WebAudioService;
  private uiManager!: GameUIManager;

  // Game state variables
  private stars: StarComponent[] = [];
  private currentScore = 0;
  private timeLeft = 60;
  private isGameOver = false;
  private sessionHighScore = 0;
  private starsCollected: number = 0;
  private winPercentage: number = 0;

  // Difficulty configurations
  private initialTime = 60;
  private asteroidSpeedFactor = 1.0;

  // Collision detection boxes and obstacle trackers
  private spaceshipBox = new THREE.Box3();
  private starBox = new THREE.Box3();
  private asteroids: AsteroidComponent[] = [];
  private asteroidBox = new THREE.Box3();
  private timeCrystals: TimeCrystalComponent[] = [];
  private crystalBox = new THREE.Box3();

  // Shake, Rebound and Immunity states
  private shakeDuration = 0;
  private shakeIntensity = 0.5;
  private isInvulnerable = false;
  private bounceIntensity = 4.0;

  // Fixed FPS Throttle variables (Targeting 60 FPS)
  private fpsInterval = 1000 / 150;
  private nextFrameTime = 0;

  constructor() {
    this.initEngine();
    this.initLights();
    this.generateStars();
    this.generateAsteroids();
    this.generateTimeCrystals();
    this.bindEvents();
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  private initEngine(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020208);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0";
    this.renderer.domElement.style.left = "0";
    document.body.appendChild(this.renderer.domElement);

    this.gameCamera = new GameCamera();
    this.environment = new GameEnvironment(this.scene);
    this.spaceship = new SpaceshipMesh(this.scene);
    this.storageService = new BrowserLocalStorage();
    this.audioService = WebAudioService.getInstance();
    this.uiManager = new GameUIManager({
      onStart: () => this.start(),
      onRestart: () => this.restartGame(),
      onApplySettings: (settings) => {
        if (this.audioService) {
          this.audioService.setVolume(
            settings.isMuted ? 0 : settings.volume / 100,
          );
        }

        if (settings.difficulty === "easy") {
          this.initialTime = 90;
          this.asteroidSpeedFactor = 0.5;
        } else if (settings.difficulty === "hard") {
          this.initialTime = 45;
          this.asteroidSpeedFactor = 2.0;
        } else {
          this.initialTime = 60;
          this.asteroidSpeedFactor = 1.0;
        }
        this.timeLeft = this.initialTime;

        const timerElement = document.getElementById("timer-val");
        if (timerElement) {
          timerElement.innerText = this.timeLeft.toString();
          timerElement.classList.remove("low-time"); // Reset color style if changing back from hard
        }
      },
    });

    this.sessionHighScore = Number(this.storageService.getHighScore()) || 0;

    
  }

  private initLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 15, 5);
    this.scene.add(dirLight);
  }

  private generateStars(): void {
    const numberOfStars = 60;
    for (let i = 0; i < numberOfStars; i++) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 40 + 1.5;
      const z = -(Math.random() * 300 - 50);

      const star = new StarComponent(this.scene, x, y, z);
      this.stars.push(star);
    }
  }

  private generateAsteroids(): void {
    const numberOfAsteroids = 15;
    for (let i = 0; i < numberOfAsteroids; i++) {
      const x = (Math.random() - 0.5) * 160;
      const y = (Math.random() - 0.5) * 40 + 1.5;
      const z = -(Math.random() * 400 + 50);

      const asteroidEntity = new AsteroidEntity(x, y, z);
      const asteroidComponent = new AsteroidComponent(
        this.scene,
        asteroidEntity,
      );
      this.asteroids.push(asteroidComponent);
    }
  }

  private generateTimeCrystals(): void {
    const numberOfCrystals = 5;
    for (let i = 0; i < numberOfCrystals; i++) {
      const x = (Math.random() - 0.5) * 140;
      const y = (Math.random() - 0.5) * 30 + 1.5;
      const z = -(Math.random() * 350 + 50);

      const crystalEntity = new TimeCrystalEntity(x, y, z, 5);
      const crystalComponent = new TimeCrystalComponent(
        this.scene,
        crystalEntity,
      );
      this.timeCrystals.push(crystalComponent);
    }
  }

  private startTimer(): void {
    this.timeLeft = this.initialTime;
    const timerElement = document.getElementById("timer-val");

    const timerInterval = setInterval(() => {
      if (this.isGameOver) {
        clearInterval(timerInterval);
        return;
      }
      this.timeLeft--;

      if (timerElement) {
        timerElement.innerText = this.timeLeft.toString();
        if (this.timeLeft <= 10) timerElement.classList.add("low-time");
      }

      // Evaluate final results when timer finishes instead of sudden game over
      if (this.timeLeft <= 0) {
        clearInterval(timerInterval);
        this.evaluateFinalResult();
      }
    }, 1000);
  }

  private animate = (timestamp: number = 0): void => {
    if (this.isGameOver) return;

    requestAnimationFrame(this.animate);

    // Check if enough time has passed to render the next frame
    if (timestamp < this.nextFrameTime) return;
    this.nextFrameTime = timestamp + this.fpsInterval;

    // Execute standard logic calls (safe at 0 arguments)
    this.spaceship.update();
    this.environment.update();

    if (this.shakeDuration > 0) {
      this.spaceship.mesh.position.x +=
        (Math.random() - 0.5) * this.shakeIntensity;
      this.spaceship.mesh.position.y +=
        (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeDuration--;
    }

    const maxVel = this.spaceship.maxSpeed || 0.5;
    const speedDisplay = Math.floor(
      (Math.abs(this.spaceship.currentSpeed) / maxVel) * 100,
    );
    this.uiManager.updateSpeed(speedDisplay);
    this.audioService.updateEngineSound(this.spaceship.currentSpeed, maxVel);

    this.spaceshipBox.setFromObject(this.spaceship.mesh);
    const spaceshipCenter = new THREE.Vector3();
    const spaceshipSize = new THREE.Vector3();
    this.spaceshipBox.getCenter(spaceshipCenter);
    this.spaceshipBox.getSize(spaceshipSize);

    spaceshipSize.x *= 0.4;
    spaceshipSize.y *= 0.4;
    spaceshipSize.z *= 0.4;

    this.spaceshipBox.setFromCenterAndSize(spaceshipCenter, spaceshipSize);

    // Absolute win check if all 60 map stars are collected before time runs out
    if (this.stars.length === 0 && !this.isGameOver) {
      this.winPercentage = 100;
      this.triggerWin(this.winPercentage);
      return;
    }

    for (let i = this.stars.length - 1; i >= 0; i--) {
      const star = this.stars[i];
      star.update();
      this.starBox.setFromObject(star.mesh);

      if (this.spaceshipBox.intersectsBox(this.starBox)) {
        this.currentScore += star.data.points;
        this.uiManager.updateScore(this.currentScore);

        if (this.currentScore > this.sessionHighScore) {
          this.sessionHighScore = this.currentScore;
          this.storageService.saveHighScore(this.currentScore);
          this.uiManager.updateHighScore(this.currentScore);
        }

        star.destroy(this.scene);
        this.stars.splice(i, 1);
        this.collectStar();
      }
    }

    // Add this inside the animate loop, right below the asteroids for-loop:
    for (let i = this.timeCrystals.length - 1; i >= 0; i--) {
      const crystal = this.timeCrystals[i];

      // Make the crystal move/animate
      crystal.update();

      // Setup bounding box and check collision with the spaceship
      this.crystalBox.setFromObject(crystal.mesh);

      if (this.spaceshipBox.intersectsBox(this.crystalBox)) {
        // Reward: Add 10 seconds to the timer
        this.timeLeft += 10;
        this.spawnTimeIndicator("+10s", true);

        if (this.audioService) {
          this.audioService.playSound("bouns"); // Or any power-up sound effect
        }

        // Clean up and remove from scene/memory
        crystal.destroy(this.scene);
        this.timeCrystals.splice(i, 1);
      }
    }

    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i];
      asteroid.update();
      this.asteroidBox.setFromObject(asteroid.mesh);
      if (this.spaceshipBox.intersectsBox(this.asteroidBox)) {
        if (!this.isInvulnerable) {
          this.audioService.playSound("crash");
          this.currentScore = Math.max(0, this.currentScore - 20);
          this.uiManager.updateScore(this.currentScore);
          this.timeLeft = Math.max(0, this.timeLeft - 5);
          this.spawnTimeIndicator("-5s", false);
          this.spaceship.currentSpeed = 0;
          this.spaceship.mesh.position.z += this.bounceIntensity;
          this.shakeDuration = 20;
          document.body.classList.add("damage-flash");
          setTimeout(() => document.body.classList.remove("damage-flash"), 400);
          this.isInvulnerable = true;
          setTimeout(() => {
            this.isInvulnerable = false;
          }, 1000);
        }
      }
    }

    this.gameCamera.follow(
      this.spaceship.mesh,
      this.spaceship.currentSpeed * 0.1,
    );
    this.renderer.render(this.scene, this.gameCamera.instance);
  };

  public collectStar(): void {
    this.starsCollected++;

    if (this.audioService) {
      this.audioService.playSound("bouns");
    }

    if (
      this.uiManager &&
      typeof this.uiManager.updateWinProgress === "function"
    ) {
      this.uiManager.updateWinProgress(this.winPercentage, this.starsCollected);
    }
  }

  /** 🏆 Evaluate the tier-based win percentage when time runs out */
  private evaluateFinalResult(): void {
    // 1. If 10 or more stars are collected -> 75% Win
    if (this.starsCollected >= 10) {
      this.winPercentage = 75;
      this.triggerWin(this.winPercentage);
    }
    // 2. If between 5 and 9 stars are collected -> 50% Win
    else if (this.starsCollected >= 5) {
      this.winPercentage = 50;
      this.triggerWin(this.winPercentage);
    }
    // 3. Less than 5 stars -> Defeat and mission failure
    else {
      this.triggerGameOver();
    }
  }

  private triggerWin(percentage: number = 100): void {
    this.isGameOver = true;
    this.audioService.stopSound("engine");
    this.uiManager.triggerWin(percentage, this.starsCollected);
    this.audioService.playSound("success");
  }

  private triggerGameOver(): void {
    this.isGameOver = true;
    this.audioService.stopSound("engine");
    this.uiManager.triggerGameOver();
    this.audioService.playSound("fail");
  }

  public restartGame(): void {
    this.currentScore = 0;
    this.isGameOver = false;
    this.timeLeft = this.initialTime;
    this.starsCollected = 0;
    this.winPercentage = 0;
    this.nextFrameTime = 0; // Reset frame pacing timeline

    this.stars.forEach((s) => s.destroy(this.scene));
    this.asteroids.forEach((a) => a.destroy(this.scene));
    this.timeCrystals.forEach((c) => c.destroy(this.scene));
    this.stars = [];
    this.asteroids = [];
    this.timeCrystals = [];

    this.spaceship.mesh.position.set(0, 1.5, 0);
    this.spaceship.currentSpeed = 0;

    this.generateStars();
    this.generateAsteroids();
    this.generateTimeCrystals();
    this.start();
  }

  public start(): void {
    this.uiManager.updateHighScore(this.sessionHighScore);
    this.uiManager.updateScore(this.currentScore);
    this.uiManager.updateSpeed(0);

    this.audioService
      .preloadSounds()
      .then(() => {
        this.startTimer();
        this.audioService.playSound("engine");
        this.animate(0); // Pass initial timestamp to initialize the throttle loop smoothly
      })
      .catch((err) => {
        console.error("Audio Error, launching anyway:", err);
        this.startTimer();
        this.animate(0);
      });
  }

  private bindEvents(): void {
    window.addEventListener("resize", () => {
      this.gameCamera.handleResize();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener("mousemove", (event: MouseEvent) => {
      this.spaceship.mousePositionNameY =
        -(event.clientY / window.innerHeight) * 2 + 1;
      this.spaceship.mousePositionNameX =
        (event.clientX / window.innerWidth) * 2 - 1;
    });
  }

  private spawnTimeIndicator(text: string, isPositive: boolean): void {
    const indicator = document.createElement("div");
    indicator.innerText = text;
    indicator.classList.add("floating-indicator");
    indicator.classList.add(isPositive ? "indicator-plus" : "indicator-minus");
    document.body.appendChild(indicator);
    setTimeout(() => {
      indicator.remove();
    }, 1000);
  }
}
