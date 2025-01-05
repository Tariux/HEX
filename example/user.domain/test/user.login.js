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
    let loginResponse; // Store the login response for later inspection

    this.timeout(10000);

    before(async function () {
        this.Hex = new _HEX(path.join(__dirname, '../environments'));
        await this.Hex.launch();
    });

    after(async function () {
        await this.Hex.stop();
    });

    it("should login", async function () {
        const createUserData = {
            userId: `EmailTest244011@mail.com`,
            password: '12345678',
        };
        loginResponse = await axios.post('http://localhost:80/login', createUserData);
        expect(loginResponse.status).to.equal(200);
        expect(loginResponse.data.status).to.equal('success');
    });

    afterEach(function () {
        // Log session and cookies after each test
        if (loginResponse) {
            cl.log('    cookies:', loginResponse.headers['set-cookie']);
        }
    });
});