const path = require('path');
const { _HEX } = require("..");
const hexApp = new _HEX(path.join(__dirname, './example.domain/environments'));
hexApp.launch();
// hexApp.stop();