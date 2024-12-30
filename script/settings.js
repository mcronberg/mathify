// settings.js - ES6 Module to handle user settings in localStorage

const SETTINGS_KEY = "mathify_settings";

export default class Settings {
    constructor() {
        this.defaultSettings = {
            name: "User",
            timer: true, // Add timer setting
            penaltyWait: 3, // Add penalty wait setting in seconds
            enableMaxTime: true,  // Add this setting
            maxAnswerTime: {
                1: 2,  // Level 1: 2 seconds
                2: 3,  // Level 2: 3 seconds
                3: 30  // Level 3: 30 seconds
            }
        };

        this.settings = this.loadSettings();
    }

    // Load settings from localStorage or return default settings
    loadSettings() {
        const storedSettings = localStorage.getItem(SETTINGS_KEY);
        return storedSettings ? JSON.parse(storedSettings) : { ...this.defaultSettings };
    }

    // Save updated settings to localStorage
    saveSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    }

    // Delete settings from localStorage
    deleteSettings() {
        localStorage.removeItem(SETTINGS_KEY);
    }

    // Get the current settings
    getSettings() {
        return { ...this.defaultSettings, ...this.settings };
    }

    // Get specific setting
    getSetting(key) {
        return this.settings[key] !== undefined ? this.settings[key] : this.defaultSettings[key];
    }

    // Reset settings to default values
    resetSettings() {
        this.settings = { ...this.defaultSettings };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    }
}
