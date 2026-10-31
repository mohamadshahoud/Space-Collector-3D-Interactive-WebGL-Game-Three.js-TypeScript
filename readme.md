# 🚀 Space Collector 3D — Interactive WebGL Space Game

**Space Collector 3D** is an interactive browser-based 3D space flight and arcade game built with **Three.js**, **TypeScript**, and **Vite**. Designed using **Clean Architecture** principles and Object-Oriented Design Patterns, the game challenges players to pilot a spacecraft through dynamic asteroid fields, collect glowing stars, and capture time-extension crystals before the mission timer expires.

---

## ✨ Key Features

* **🏗️ Clean Architecture & Design Patterns:** Strictly separated into `Core` (Entities & Interfaces), `Infrastructure` (Audio & LocalStorage services), and `Presentation` (3D Meshes, Camera, HUD, and UI Screens) utilizing **Singleton** and **Facade** patterns.
* **🛸 Realistic Flight Mechanics:** Smooth 3D spaceship controls supporting acceleration, friction, lateral banking/rolling, pitch, and yaw driven by combined keyboard (`WASD` / Arrows) and mouse steering.
* **🎥 Dynamic Chase Camera:** Quaternion-based third-person camera following the spacecraft with smooth `lerp` interpolation, speed-reactive Field of View (FOV) warp effects, and scroll-wheel zoom.
* **☄️ Procedural & 3D GLTF Assets:** Combines custom `.glb` 3D models (`spaceship.glb`, `glowing_star.glb`, `clock.glb`) with procedurally deformed `DodecahedronGeometry` asteroids and a 2,000-particle rotating 3D starfield with exponential fog (`FogExp2`).
* **💥 Real-Time AABB Collision & Physics:** Bounding-box (`THREE.Box3`) collision detection featuring knockback rebound physics, screen-flash alerts, camera shake, and temporary invulnerability frames upon asteroid impact.
* **🔊 Dynamic Web Audio Engine:** Velocity-modulated engine sound (`playbackRate` and dynamic volume scaling based on spacecraft speed) alongside sound effects for bonuses, crashes, and mission outcomes.
* **🏆 Tiered Victory System & Persistence:** Configurable difficulty modes (**Easy / Normal / Hard**), tiered win evaluation (50%, 75%, 100% completion rates), and persistent High Score storage via `localStorage`.

---

## 📁 Project Architecture

```text
SPACE_GAME/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
└── src/
    ├── main.ts                                  # Application entry point
    ├── style.css                                # Global stylesheet imports
    ├── assets/
    │   ├── Audio/                               # MP3 sound effects (engine, crash, bonus, etc.)
    │   └── Models/                              # 3D GLB assets (spaceship, star, time crystal)
    ├── Core/                                    # 🟢 Domain Layer (Entities, Engine & Contracts)
    │   ├── Game.ts                              # Singleton core game loop, physics & state machine
    │   ├── GameFacade.ts                        # Facade controller bridging lifecycle & UI
    │   ├── Entities/                            # Pure domain models (Spaceship, Asteroid, Star, TimeCrystal)
    │   └── Interfaces/                          # Service abstractions (IAudioService, IGameStorage)
    ├── Infrastructure/                          # 🟡 Infrastructure Layer
    │   └── Services/
    │       ├── BrowserLocalStorage.ts           # High-score & generic state persistence
    │       └── WebAudioService.ts               # Dynamic audio playback & master volume controller
    └── Presentation/                            # 🔴 Presentation & Rendering Layer
        ├── Components/                          # Three.js 3D wrappers (SpaceshipMesh, GameCamera, etc.)
        └── UI/                                  # HUD & Modal Screens (Start, Settings, Win, GameOver)
```

---

## 🎮 Controls & Gameplay Mechanics

| Input | Action |
| :--- | :--- |
| **`W` / `Up Arrow`** | Accelerate forward |
| **`S` / `Down Arrow`** | Decelerate / Reverse thrust |
| **`A` / `D` or `Left` / `Right`** | Yaw rotation & lateral wing banking (Roll) |
| **`Mouse Movement (X / Y)`** | Smooth pitch (up/down) and yaw steering |
| **`Mouse Wheel`** | Adjust camera FOV zoom |

### Scoring & Objectives
* **⭐ Glowing Stars (`+10 PTS`):** Collect stars to increase your score and unlock victory tiers:
  * **5–9 Stars:** 50% Victory when timer expires.
  * **10+ Stars:** 75% Victory when timer expires.
  * **All 60 Stars:** Instant 100% Victory.
* **⏳ Time Crystals (`+10s`):** Glowing green clock models that extend your remaining mission time.
* **☄️ Moving Asteroids (`-20 PTS` & `-5s`):** Colliding with space rocks reduces your score, deducts 5 seconds, and triggers knockback turbulence.

---

## 🛠️ Getting Started

### Prerequisites
* **Node.js** (v18+ recommended)
* **npm**

### Installation & Run
1. Clone the repository:
   ```bash
   git clone [https://github.com/mohamadshahoud/3D-Space-Game-ThreeJS.git](https://github.com/mohamadshahoud/3D-Space-Game-ThreeJS.git)
   cd 3D-Space-Game-ThreeJS
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in your terminal (typically `http://localhost:5173`) in your browser.