# 🌟 Signal HUD — FiveM ESX HUD

A modern, fully self-hosted, highly customizable HUD for FiveM ESX servers. Segmented tick-rings instead of smooth progress arcs, a glassmorphism look, and zero external CDN dependencies — every font and icon ships inside the resource.

<p align="center">
  <img src="https://github.com/user-attachments/assets/c0dc536e-cf94-4e90-bd00-3f7ae5e5d24c" alt="Signal HUD Showcase 1" width="49%">
  <img src="https://github.com/user-attachments/assets/0cb3f103-2d83-4005-a4ad-57baf7d25f34" alt="Signal HUD Showcase 2" width="49%">
</p>

<p align="center"><b>🇩🇪 <a href="#deutsch">Deutsch</a> &nbsp;|&nbsp; 🇬🇧 <a href="#english">English</a></b></p>

---

## Deutsch

### ✨ Features

* **🎨 Ingame-Editor (`/hud`)** — Spieler können das komplette HUD-Layout anpassen:
  * Drag & Drop über Slider (X/Y-Position) für ID-Tag, Status-Cluster, Bargeld, Bankkonto und Tacho.
  * Frei wählbare HUD-Skalierung (0.5× – 1.5×).
  * Eigener Farbwähler für jeden Status-Ring sowie Bargeld/Bankkonto.
  * Einzelne Elemente (Bargeld, Bank, Tank, Tacho, Ausdauer, Sauerstoff) an- oder abschalten.
  * Alle Einstellungen werden als ein einziger Preference-Blob lokal beim Spieler gespeichert (kein Server-Roundtrip nötig).
* **🔥 Segmentierte Status-Ringe** — Health, Armor, Hunger und Durst sind immer sichtbar.
  * **Ausdauer:** erscheint nur, während gesprintet wird und der Wert sinkt.
  * **Sauerstoff:** erscheint nur beim Tauchen.
* **💔 Cyber-Glitch-Effekt** — fällt das Leben unter `Config.GlitchThreshold` (Standard 25 %), flackert ein RGB-Split am Health-Ring und eine pulsierende rote Vignette legt sich über den Bildschirm.
* **🚗 Dynamischer Tacho** — km/h, Tank-Ring und aktueller Gang; blendet sich automatisch aus, sobald man das Fahrzeug verlässt.
* **🎙️ Voice-Indikator** — leuchtet neben dem Spieler-ID-Tag auf, sobald man spricht.
* **🗺️ Smartes Pause-Menü** — das gesamte HUD blendet sanft aus, sobald `ESC` gedrückt wird.
* **🌍 Lokalisierung** — vollständig übersetzbar, Deutsch und Englisch sind bereits enthalten.
* **📡 Automatischer Versions-Check** — optionales Server-Script (`Config.CheckUpdates`), das beim Start gegen GitHub prüft und Patchnotes in die Konsole schreibt.
* **🛡️ Cleaner Screen** — deaktiviert das native GTA-HUD zuverlässig (Minimap-Health/Armor, Bargeld, Fahndungssterne, Straßennamen).
* **📦 Keine externen Abhängigkeiten zur Laufzeit** — Schriften (Inter, Chakra Petch) und alle Icons liegen als lokale Dateien bei; das HUD funktioniert auch auf Servern ohne ausgehenden Internetzugriff.

### 📦 Abhängigkeiten

* [es_extended](https://github.com/esx-framework/esx_core) (ESX Legacy oder V1.2)
* `esx_status` (für Hunger & Durst)

### 🗂️ Dateistruktur

```
berryHud/
├── fxmanifest.lua
├── config.lua
├── client/
│   ├── main.lua       -- ESX-Init, Sichtbarkeitssystem, /hud-Command
│   ├── hud.lua         -- Status-/Geld-/Tacho-Loops (mit Diffing), Voice-Indikator
│   └── nativehud.lua   -- blendet das native GTA-HUD aus
├── server/
│   └── versioncheck.lua -- optionaler GitHub-Update-Checker
├── locales/
│   ├── en.lua
│   └── de.lua
└── html/
    ├── ui.html
    ├── css/    (base, rings, editor, glitch)
    ├── js/     (icons, state, rings, settings, main)
    └── fonts/  (selbst gehostete Inter & Chakra Petch, woff2)
```

### ⚙️ Installation

1. Lade die neueste Version aus den [Releases](../../releases) herunter oder klone das Repository.
2. Entpacke den Ordner in dein `resources`-Verzeichnis und benenne ihn in `berryHud` um (oder einen Namen deiner Wahl).
3. Füge in deiner `server.cfg` folgende Zeile hinzu:
   ```
   ensure berryHud
   ```
4. *(Optional)* Öffne `config.lua`, um Standardfarben, Skalierung, Sprache (`en`/`de`), globale Feature-Toggles, den Cyber-Glitch-Schwellenwert sowie den Update-Checker anzupassen.
5. Server neu starten — fertig! Mit `/hud` öffnet jeder Spieler seinen persönlichen Editor.

### 🛠️ Konfiguration für Serverbetreiber

`config.lua` ist die einzige Quelle der Wahrheit und wird direkt an die NUI geschickt:

| Option | Standard | Beschreibung |
|---|---|---|
| `Config.Locale` | `'de'` | Sprache (`de`, `en`, oder eigene aus `locales/`) |
| `Config.EnableCash` | `true` | Bargeldanzeige (global, inkl. Editor) |
| `Config.EnableBank` | `true` | Bankanzeige (global, inkl. Editor) |
| `Config.EnableSpeedo` | `true` | Tachoanzeige |
| `Config.EnableFuel` | `true` | Tankanzeige am Tacho |
| `Config.EnableStamina` | `true` | Ausdaueranzeige |
| `Config.EnableOxygen` | `true` | Sauerstoffanzeige beim Tauchen |
| `Config.DefaultScale` | `1.0` | Standard-HUD-Skalierung |
| `Config.GlitchThreshold` | `25` | Ab wie viel % Leben der Cyber-Glitch-Effekt einsetzt |
| `Config.CheckUpdates` | `true` | Aktiviert den GitHub-Versions-Check |
| `Config.Colors` | siehe `config.lua` | Standardfarben für alle Ringe/Badges |

Setzt du z. B. `Config.EnableBank = false`, verschwindet die Bankanzeige komplett — auch aus dem `/hud`-Editor. Neue Sprachen fügst du hinzu, indem du eine Datei in `locales/` erstellst und `Config.Locale` entsprechend setzt.

### 🎮 Befehle

| Befehl | Wirkung |
|---|---|
| `/hud` | Öffnet den Ingame-Editor zur Anpassung von Layout, Farben und sichtbaren Elementen |

### 🤝 Mitwirken

Contributions, Issues und Feature-Requests sind willkommen! Schau einfach auf der Issues-Seite vorbei.

### 💬 Support

Für Support tritt meinem Discord-Server bei: https://discord.gg/H8EevXJdgk

<br>

---

## English

### ✨ Features

* **🎨 Ingame Editor (`/hud`)** — players can fully customize the HUD layout:
  * Drag & drop via sliders (X/Y position) for the ID tag, status cluster, cash, bank, and speedometer.
  * Freely adjustable HUD scale (0.5× – 1.5×).
  * Custom color picker for every status ring plus cash/bank.
  * Toggle individual elements (cash, bank, fuel, speedo, stamina, oxygen) on or off.
  * All settings are saved as a single preference blob locally on the player's machine — no server round-trip required.
* **🔥 Segmented status rings** — Health, Armor, Hunger, and Thirst are always shown.
  * **Stamina:** only appears while sprinting and the value is dropping.
  * **Oxygen:** only appears while diving underwater.
* **💔 Cyber-glitch effect** — when health drops below `Config.GlitchThreshold` (default 25%), an RGB-split flicker plays on the health ring alongside a pulsing red vignette across the screen.
* **🚗 Dynamic speedometer** — km/h, a fuel ring, and the current gear; automatically hides when you step out of a vehicle.
* **🎙️ Voice indicator** — lights up next to the player ID tag while talking.
* **🗺️ Smart pause menu** — the entire HUD fades out smoothly when `ESC` is pressed.
* **🌍 Localization system** — fully translatable; English and German are included out of the box.
* **📡 Automatic version checker** — an optional server script (`Config.CheckUpdates`) that checks GitHub on startup and prints patch notes to the console.
* **🛡️ Clean screen** — reliably disables the native GTA HUD (minimap health/armor, cash, wanted stars, street names).
* **📦 No external runtime dependencies** — fonts (Inter, Chakra Petch) and all icons are bundled as local files, so the HUD works correctly even on servers without outbound internet access.

### 📦 Dependencies

* [es_extended](https://github.com/esx-framework/esx_core) (ESX Legacy or V1.2)
* `esx_status` (for hunger & thirst)

### 🗂️ File structure

```
berryHud/
├── fxmanifest.lua
├── config.lua
├── client/
│   ├── main.lua       -- ESX init, visibility system, /hud command
│   ├── hud.lua         -- status/money/speedo loops (with diffing), voice indicator
│   └── nativehud.lua   -- hides the native GTA HUD
├── server/
│   └── versioncheck.lua -- optional GitHub update checker
├── locales/
│   ├── en.lua
│   └── de.lua
└── html/
    ├── ui.html
    ├── css/    (base, rings, editor, glitch)
    ├── js/     (icons, state, rings, settings, main)
    └── fonts/  (self-hosted Inter & Chakra Petch, woff2)
```

### ⚙️ Installation

1. Download the latest version from the [Releases](../../releases) tab or clone the repository.
2. Extract the folder into your server's `resources` directory and rename it to `berryHud` (or a name of your choice).
3. Add the following line to your `server.cfg`:
   ```
   ensure berryHud
   ```
4. *(Optional)* Open `config.lua` to adjust default colors, scale, language (`en`/`de`), global feature toggles, the cyber-glitch threshold, and the update checker.
5. Restart your server — done! Type `/hud` in-game to let each player open their own editor.

### 🛠️ Configuration for server owners

`config.lua` is the single source of truth and is sent directly to the NUI:

| Option | Default | Description |
|---|---|---|
| `Config.Locale` | `'de'` | Language (`de`, `en`, or a custom one from `locales/`) |
| `Config.EnableCash` | `true` | Cash display (global, including the editor) |
| `Config.EnableBank` | `true` | Bank display (global, including the editor) |
| `Config.EnableSpeedo` | `true` | Speedometer display |
| `Config.EnableFuel` | `true` | Fuel ring on the speedometer |
| `Config.EnableStamina` | `true` | Stamina display |
| `Config.EnableOxygen` | `true` | Oxygen display while diving |
| `Config.DefaultScale` | `1.0` | Default HUD scale |
| `Config.GlitchThreshold` | `25` | Health % below which the cyber-glitch effect triggers |
| `Config.CheckUpdates` | `true` | Enables the GitHub version checker |
| `Config.Colors` | see `config.lua` | Default colors for every ring/badge |

For example, setting `Config.EnableBank = false` removes the bank display entirely — including from the `/hud` editor. Add new languages by creating a file in `locales/` and pointing `Config.Locale` at it.

### 🎮 Commands

| Command | Effect |
|---|---|
| `/hud` | Opens the in-game editor to adjust layout, colors, and visible elements |

### 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

### 💬 Support

Join my Discord server for support: https://discord.gg/H8EevXJdgk
