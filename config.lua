Config = {}

-- Spracheinstellungen ('de', 'en', etc.)
Config.Locale = 'de'

-- Globale Sichtbarkeiten (Wenn false, verschwinden sie auch aus dem Editor)
Config.EnableCash = true
Config.EnableBank = true
Config.EnableSpeedo = true
Config.EnableFuel = true
Config.EnableStamina = true -- Ausdaueranzeige
Config.EnableOxygen = true  -- Sauerstoffanzeige beim Tauchen

-- Standard-Layout
Config.DefaultScale = 1.0

-- Ab wie viel % Leben der Cyber-Glitch-Effekt ausgelöst wird
Config.GlitchThreshold = 25

-- Prüft beim Start auf GitHub, ob eine neuere Version verfügbar ist
Config.CheckUpdates = true

-- Standard-Farben (Hex-Codes) - einzige Quelle der Wahrheit, wird an die NUI geschickt
Config.Colors = {
    health  = "#ff2d55",
    armor   = "#007aff",
    hunger  = "#ff9500",
    thirst  = "#5ac8fa",
    stamina = "#ffb347",
    oxygen  = "#87ceeb",
    cash    = "#4cd964",
    bank    = "#00a8ff"
}
