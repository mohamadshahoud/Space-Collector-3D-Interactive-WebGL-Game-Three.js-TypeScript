import * as THREE from "three";

export class WebAudioService {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private listener: THREE.AudioListener;
  private static instance: WebAudioService;
  private audioContext: AudioContext;
  // 🌟 إضافة متغير لتتبع مستوى الصوت العام الافتراضي (بين 0.0 و 1.0)
  private masterVolume: number = 0.8; 

  constructor() {
    this.audioContext = new AudioContext();
    this.listener = new THREE.AudioListener();
  }

  public static getInstance(): WebAudioService {
    if (!WebAudioService.instance) {
      WebAudioService.instance = new WebAudioService();
    }
    return WebAudioService.instance;
  }

  public async preloadSounds(): Promise<void> {
    const audioFiles = [
      {
        key: "engine",
        src: new URL("../../assets/Audio/engine.mp3", import.meta.url).href,
      },
      {
        key: "crash",
        src: new URL("../../assets/Audio/crash.mp3", import.meta.url).href,
      },
      {
        key: "bouns",
        src: new URL("../../assets/Audio/bouns.mp3", import.meta.url).href,
      },
      {
        key: "time",
        src: new URL("../../assets/Audio/time.mp3", import.meta.url).href,
      },
      {
        key: "fail",
        src: new URL("../../assets/Audio/game_over.mp3", import.meta.url).href,
      },
      {
        key: "success",
        src: new URL("../../assets/Audio/winner_game.mp3", import.meta.url).href,
      },
    ];

    for (const file of audioFiles) {
      const audio = new Audio(file.src);

      // 🌟 نقوم بحفظ الصوت الأقصى الافتراضي لكل ملف كخاصية مخصصة للاستخدام لاحقاً عند حساب النسبة
      // لمنع تداخل صوت المحرك العالي مع أصوات المفرقعات والمكافآت
      if (file.key === "engine") {
        audio.loop = true;
        audio.volume = 0.2 * this.masterVolume;
      } else {
        audio.volume = 0.9 * this.masterVolume;
      }

      this.sounds.set(file.key, audio);
    }
  }

  public playSound(key: string): void {
    const audio = this.sounds.get(key);
    if (audio) {
      // 🌟 إعادة ضبط حجم الصوت بناءً على الـ Master Volume الحالي قبل التشغيل
      if (key !== "engine") {
        audio.volume = 0.9 * this.masterVolume;
      }
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.error(`Error playing sound for key ${key}:`, err);
      });
    } else {
      console.warn(`Sound key not found in memory: ${key}`);
    }
  }

  public stopSound(key: string): void {
    const audio = this.sounds.get(key);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  public updateEngineSound(currentSpeed: number, maxSpeed: number): void {
    const audio = this.sounds.get("engine");
    if (!audio || audio.paused) return;

    const speedRatio = Math.min(Math.abs(currentSpeed) / (maxSpeed || 0.5), 1);

    // 🌟 دمج الـ masterVolume هنا ليتأثر صوت المحرك ديناميكياً أثناء القيادة وتسارع المركبة
    audio.volume = (0.25 + speedRatio * 0.6) * this.masterVolume;

    audio.playbackRate = 1.0 + speedRatio * 0.45;
  }

  /**
   * 🌟 الدالة المصلحة لتعديل الصوت بشكل حقيقي وتطبيقه فورياً
   * @param volume قيمة بين 0.0 و 1.0 قادمة من شاشة الإعدادات
   */
  public setVolume(volume: number): void {
    this.masterVolume = volume;
    
    // تعديل الـ Listener احتياطاً إذا قمت بالتحول إلى Three.js Audio مستقبلاً
    if (this.listener) {
      this.listener.setMasterVolume(volume);
    }

    // 🔥 تحديث أحجام الأصوات النشطة فوراً في الخلفية (خصوصاً صوت المحرك المستمر)
    const engineAudio = this.sounds.get("engine");
    if (engineAudio) {
      // إذا كان المحرك يعمل، نقوم بتحديث حجم صوته الحالي مع الحفاظ على نسبته
      // سنعطيه حجم مبدئي متناسب مع الـ master الجديد حتى يتم تحديثه في الدورة التالية عبر الـ Update
      engineAudio.volume = 0.25 * this.masterVolume;
    }
    
    console.log(`WebAudioService Master Volume set to: ${volume}`);
  }
}