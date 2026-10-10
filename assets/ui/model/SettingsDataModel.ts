export class SettingsDataModel {
    sfxLevel: number;
    musicLevel: number;
    isMuted: boolean;

    constructor(sfxLevel: number = 0.5, musicLevel: number = 0.5, isMuted: boolean = false) {
        this.sfxLevel = sfxLevel;
        this.musicLevel = musicLevel;
        this.isMuted = isMuted;
    }

    // Static method to create an instance from a valid JSON string
    static fromJSON(json: string | null): SettingsDataModel {
        if (!json) return new SettingsDataModel();
        const parsed = JSON.parse(json);
        return new SettingsDataModel(parsed.sfxLevel, parsed.musicLevel, parsed.isMuted);

    }

    // Optionally add toJSON for easy serialization
    toJSON(): string {
        return JSON.stringify({
            sfxLevel: this.sfxLevel,
            musicLevel: this.musicLevel,
            isMuted: this.isMuted,
        });
    }
}
