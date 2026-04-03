# 🌟 Premium Glassmorphism HUD for FiveM (ESX)

A modern, highly customizable, and lightweight HUD for FiveM ESX servers. Designed with a sleek **Glassmorphism** aesthetic, this HUD keeps the player's screen clean while offering maximum functionality. 

## ✨ Features

* **🎨 Ingame Editor (`/hud`):** Players can customize their HUD layout completely.
  * Drag & Drop functionality (Adjust X/Y axis via sliders).
  * Scale the UI size perfectly to their monitor.
  * Custom Color Picker for all status rings and money displays.
  * Toggle specific elements (Money, Bank, Fuel) on or off.
  * All settings are saved locally for each player.
* **🔥 Dynamic Status Rings:** * Health, Armor, Hunger, and Thirst.
  * **Stamina:** Only appears when the player is sprinting and stamina drops.
  * **Oxygen:** Only appears when the player dives underwater.
* **💔 Cyber-Glitch Effect:** If a player's health drops below 25%, the HUD container triggers a highly immersive visual glitch/shatter effect to indicate critical health.
* **🚗 Dynamic Speedometer:** Clean KM/H and fuel display. Automatically hides when stepping out of a vehicle.
* **🗺️ Smart Pause Menu:** The entire HUD hides smoothly when the player presses `ESC` to view the pause map.
* **🌍 Locales System:** Fully translatable (English and German included by default).
* **📡 Auto Version Checker:** Built-in server script that checks GitHub for updates and prints patch notes directly to your server console.
* **🛡️ Clean Screen:** Automatically and cleanly disables the default GTA 5 HUD (minimap health/armor, cash, wanted stars, street names).

## 📦 Dependencies

* [es_extended](https://github.com/esx-framework/esx_core) (ESX Legacy or V1.2)
* `esx_status` (For Hunger & Thirst)
* *Note: Can easily be converted to QBCore with basic Lua knowledge.*

## ⚙️ Installation

1. Download the latest version from the [Releases](../../releases) tab or clone the repository.
2. Extract the folder into your server's `resources` directory and rename it to `my_hud` (or your preferred name).
3. Open your `server.cfg` and add the following line:
   ensure berryHud
4. (Optional) Open the config.lua to adjust default colors, scale, language ('en' or 'de'), and global feature toggles.
5. Restart your server and enjoy! Type /hud in-game to open the editor.



🛠️ Configuration for Server Owners
The config.lua allows you to enforce certain rules. Don't want players to see their bank balance on the street? Just set Config.EnableBank = false. This will completely remove the bank display from the game and the /hud editor.

You can also add new languages by simply creating a new file in the locales/ folder and changing Config.Locale in your config.

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page.
