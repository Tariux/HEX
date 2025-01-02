const { runExternalProgram } = require("./helper");

runExternalProgram('MainServer', "node", ['./debug.js']);
runExternalProgram('SideTestServer', "node", ['./debug2.js']);
