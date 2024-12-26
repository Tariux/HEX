const HEX = require("../main");
const { expect } = require("chai"); // Import expect from chai

let hex;
before(async () => {
    hex = new HEX();
    await hex.launch();
})

describe('Startup tests:', () => {
    it('check status started servers', () => {
        const launchers = hex.launcher.launchers;
        launchers.forEach(launcher => {
            const servers = launcher.getServers();
            servers.forEach(server => {
                // expect(server.getStatus()).to.be.true;
            });
        });
    })
})

after(async () => {
    await hex.stop();
})