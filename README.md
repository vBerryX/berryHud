# 🌟 Signal HUD for FiveM (ESX)

A modern, fully self-hosted, highly customizable HUD for FiveM ESX servers. "Signal HUD" replaces smooth progress arcs with a segmented tick-ring look inspired by technical dashboard instrumentation, and ships with zero external CDN dependencies - fonts and icons are bundled with the resource.
A modern, highly customizable, and lightweight HUD for FiveM ESX servers. Designed with a sleek **Glassmorphism** aesthetic, this HUD keeps the player's screen clean while offering maximum functionality. 


![My_HUD Showcase](https://github.com/user-attachments/assets/c0dc536e-cf94-4e90-bd00-3f7ae5e5d24c)
![My_HUD Showcase](https://github.com/user-attachments/assets/0cb3f103-2d83-4005-a4ad-57baf7d25f34)



## ✨ Features

* **🎨 Ingame Editor (`/hud`):** Players can customize their HUD layout completely.
  * Drag & Drop functionality (Adjust X/Y axis via sliders).
  * Scale the UI size perfectly to their monitor.
  * Custom Color Picker for all status rings and money displays.
  * Toggle specific elements (Cash, Bank, Fuel, Speedo, Stamina, Oxygen) on or off.
  * All settings are saved locally per player in a single preference blob.
* **🔥 Segmented Status Rings:** Health, Armor, Hunger, Thirst always shown.
  * **Stamina:** Only appears when the player is sprinting and stamina drops.
  * **Oxygen:** Only appears when the player dives underwater.
* **💔 Cyber-Glitch Effect:** If a player's health drops below `Config.GlitchThreshold` (default 25%), an RGB-split flicker plays on the health ring plus a pulsing red vignette across the screen.
* **🚗 Dynamic Speedometer:** KM/H, fuel ring and current gear, automatically hides when stepping out of a vehicle.
* **🎙️ Voice Indicator:** Lights up next to the player ID tag while talking.
* **🗺️ Smart Pause Menu:** The entire HUD hides smoothly when the player presses `ESC` to view the pause map.
* **🌍 Locales System:** Fully translatable (English and German included by default).
* **📡 Auto Version Checker:** Optional (`Config.CheckUpdates`) server script that checks GitHub for updates and prints patch notes to the server console.
* **🛡️ Clean Screen:** Automatically and cleanly disables the default GTA 5 HUD (minimap health/armor, cash, wanted stars, street names).
* **📦 No External Dependencies at Runtime:** Fonts (Inter, Chakra Petch) and all icons are bundled as local files - the HUD works correctly even on servers without outbound internet access.

## 📦 Dependencies

* [es_extended](https://github.com/esx-framework/esx_core) (ESX Legacy or V1.2)
* `esx_status` (For Hunger & Thirst)

## 🗂️ File Structure

```
berryHud/
├── fxmanifest.lua
├── config.lua
├── client/
│   ├── main.lua        -- ESX init, visibility system, /hud command
│   ├── hud.lua          -- status/money/speedo loops (with diffing), voice indicator
│   └── nativehud.lua    -- hides the native GTA HUD
├── server/
│   └── versioncheck.lua -- optional GitHub update checker
├── locales/
│   ├── en.lua
│   └── de.lua
└── html/
    ├── ui.html
    ├── css/ (base, rings, editor, glitch)
    ├── js/ (icons, state, rings, settings, main)
    └── fonts/ (self-hosted Inter & Chakra Petch, woff2)
```

## ⚙️ Installation

1. Download the latest version from the [Releases](../../releases) tab or clone the repository.
2. Extract the folder into your server's `resources` directory and rename it to `berryHud` (or your preferred name).
3. Open your `server.cfg` and add the following line:
   ensure berryHud
4. (Optional) Open `config.lua` to adjust default colors, scale, language (`en` or `de`), global feature toggles, the Cyber-Glitch threshold, and the update checker.
5. Restart your server and enjoy! Type `/hud` in-game to open the editor.

## 🛠️ Configuration for Server Owners

`config.lua` lets you enforce certain rules. Don't want players to see their bank balance? Just set `Config.EnableBank = false` - this removes the bank display from the HUD and the `/hud` editor. `Config.GlitchThreshold` controls at what health percentage the critical-health effect triggers. `Config.CheckUpdates` toggles the GitHub version checker on/off.

You can add new languages by creating a new file in `locales/` and setting `Config.Locale` accordingly.

for support Join my DC Server: https://discord.gg/H8EevXJdgk

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
