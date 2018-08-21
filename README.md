# steamcli
A humble Steam CLI dashboard in Node.js

Para instalar paquetes 

npm install -g ./

Luego correr aplicacion con 

$ steamer u

Para ayuda

$ steamer --help


Crear carpeta config y archivo userconfig.js con la siguiente data

module.exports = {
  'user': {
    'apiKey': 'YOURAPIKEY',
    'steamids': 'YOURSTEAMIDS'
  }
}
