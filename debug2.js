const path = require('path');

const hex = require("./main");
const hexApp = new hex(path.join(__dirname, './src/domain2/environments'));
hexApp.launch();
// hexApp.stop();