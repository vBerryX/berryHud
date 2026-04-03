fx_version 'cerulean'
game 'gta5'

author 'vBerryX'
description 'berryHUD'
version '1.0.0'

ui_page 'html/ui.html'

shared_scripts {
    'config.lua',
    'locales/*.lua'
}

client_scripts {
    'client.lua'
}

server_scripts {
    'server.lua'
}

files {
    'html/ui.html',
    'html/style.css',
    'html/script.js'
}