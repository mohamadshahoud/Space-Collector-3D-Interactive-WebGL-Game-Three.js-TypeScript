export interface IAudioService {
    
    preloadSounds(): Promise<void>;
    
    playSound(soundName: string): void;
    
    stopSound(soundName: string): void;

    toggleMute(): void;
}