const axios = require("axios");
const { expect } = require("chai");
const { _HEX } = require("hex-micro");
const path = require('path');

const cl = console;
console = {
    log: () => {

    }
}
describe("User Login API Test Scenario", function () {
    let userId;

    this.timeout(5000);
    before(async function () {
        this.Hex = new _HEX(path.join(__dirname, '../environments'));
        await this.Hex.launch();
    });

    after(async function () {
        await this.Hex.stop();
    });

    let random = Math.random() * 1000000;
    random = Math.round(random)

    it("should login", async function () {
        const createUserData = {
            userId: `EmailTest244011@mail.com`,
            password: '12345678',
        };
        const response = await axios.post('http://localhost:80/login', createUserData);
        expect(response.status).to.equal(200);
        expect(response.data.status).to.equal('success');
        cl.log('  login response:', response.data);
    });

});
