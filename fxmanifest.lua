fx_version 'cerulean'
game 'gta5'

author 'vBerryX'
description 'berryHUD'
version '3.0.1'

ui_page 'html/ui.html'

dependencies {
    'es_extended'
}

shared_scripts {
    'config.lua',
    'locales/*.lua'
}

client_scripts {
    'client/main.lua',
    'client/hud.lua',
    'client/nativehud.lua'
}

server_scripts {
    'server/versioncheck.lua'
}

files {
    'html/ui.html',
    'html/css/base.css',
    'html/css/rings.css',
    'html/css/editor.css',
    'html/css/glitch.css',
    'html/js/icons.js',
    'html/js/state.js',
    'html/js/rings.js',
    'html/js/settings.js',
    'html/js/main.js',
    'html/fonts/chakra-petch-500.woff2',
    'html/fonts/chakra-petch-700.woff2',
    'html/fonts/inter-400.woff2',
    'html/fonts/inter-600.woff2'
}