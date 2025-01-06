const axios = require("axios");
const { expect } = require("chai");
const { _HEX } = require("hex-micro");
const path = require('path');

const cl = console;
// console = {
//     log: () => {

//     }
// }
describe("User CRUD API Test Scenario", function () {
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

    it("should create a user and retrieve userId", async function () {
        const createUserData = {
            firstName: 'Name ' + random,
            lastName: 'Last ' + random,
            email: `EmailTest${random}@mail.com`,
            phoneNumber: '09876' + random,
            password: '12345678',
            yyyy: '2025',
            mm: '01',
            dd: '01'
        };
        const response = await axios.post('http://localhost:80/user', createUserData);
        expect(response.status).to.equal(200);
        expect(response.data.status).to.equal('success');
        userId = response.data.user;
        cl.log('  random identety:', random); //
        cl.log('  userId:', userId); //
    });

    // it("should update the user", async function () {
    //     const updateUserData = {
    //         firstName: 'Updated Name ' + Math.round(random),
    //         lastName: 'Updated Last ' + Math.round(random),
    //         email: `EmailTest${random}@mail.com`,
    //         phoneNumber: '09876' + Math.round(random),
    //     };
    //     const response = await axios.put(`http://localhost:80/user?uid=${userId}`, updateUserData);
    //     expect(response.status).to.equal(200);
    //     expect(response.data.status).to.equal('success');
    // });

    it("should get the user", async function () {
        const response = await axios.get(`http://localhost:80/user?uid=${userId}`);
        expect(response.status).to.equal(200); // 
        expect(response.data.status).to.equal('success');
    });

    it("should get all users", async function () {
        const response = await axios.get('http://localhost:80/users');
        expect(response.data.status).to.equal('success');
    });

    it("should delete the user", async function () {
        const response = await axios.delete(`http://localhost:80/user?uid=${userId}`);
        expect(response.data.status).to.equal('success');
    });

});
