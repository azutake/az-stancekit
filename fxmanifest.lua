fx_version 'bodacious'
games { 'gta5' }

author "azutake"

ui_page "html/index.html"

files {
	"html/*",
	"html/assets/*.js",
	"html/assets/*.css",
	"locales/*.json"
}

client_scripts {
	"localize-core.lua",
	"localize.lua",
	"client.lua"
}
server_scripts {
	"@oxmysql/lib/MySQL.lua",
	"server.lua"
}