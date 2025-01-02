const { runExternalProgram } = require("./helper");
const path = require('path');

runExternalProgram('user.micro', "node", [path.join(__dirname, './user.micro.js')]);
runExternalProgram('test.micro', "node", [path.join(__dirname, './test.micro.js')]);
