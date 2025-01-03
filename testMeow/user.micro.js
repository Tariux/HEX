const path = require('path');
const { _HEX } = require("..");
const hexApp = new _HEX(path.join(__dirname, './app.user.managment/environments'));
hexApp.launch();
// hexApp.stop();