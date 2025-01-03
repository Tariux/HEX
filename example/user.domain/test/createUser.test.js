const axios = require("axios");
const { expect } = require("chai");
const { _HEX } = require("hex-micro");
const path = require('path');

const cl = console;
// console = {
//     log: () => {

//     }
// }
describe("Create User API Test Scenario", function () {
    let userId;
    this.timeout(5000);
    before(async function () {
        this.Hex = new _HEX(path.join(__dirname, '../environments'));
        await this.Hex.launch();
    });

    // after(async function () {
    //     await this.Hex.stop();
    // });

    it("should create a user and retrieve userId", async function () {
        const createUserData = {
            firstName: 'test 4 name',
            lastName: 'test 4 last',
            email: 'test3@mail.com',
            phoneNumber: '0987654324',
            password: '0987654322',
            age: '21',
            yyyy: '2025',
            mm: '01',
            dd: '01'
        };
        const response = await axios.post('http://localhost:80/user', createUserData);
        cl.log('response' , response.data)
        expect(response.status).to.equal(200);
        expect(response.data.status).to.equal('success');
        userId = response.data.user;
        cl.log('  userId:', userId); //
    });
});
