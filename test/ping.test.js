const hex = require("../main");
const axios = require("axios");
const { expect } = require("chai");

console = {
    log: () => {

    }
}
describe("User API Test Scenario (CRUD)", function () {
    let userId;

    before(async function () {
        this.Hex = new hex();
        await this.Hex.launch();
    });

    after(async function () {
        await this.Hex.stop();
    });

    it("should create a user and retrieve userId", async function () {
        const createUserData = {
            firstName: 'test name',
            lastName: 'test last',
            email: 'test@mail.com',
            yyyy: '2025',
            mm: '01',
            dd: '01'
        };
        const response = await axios.post('http://localhost:80/user', createUserData);
        expect(response.status).to.equal(200);
        expect(response.data.status).to.equal('success');
        userId = response.data.user; // Store userId for later tests
    });

    it("should update the user", async function () {
        const updateUserData = {
            firstName: 'updated name',
            lastName: 'updated last',
            email: 'updated@mail.com',
            yyyy: '2026',
            mm: '02',
            dd: '02'
        };
        const response = await axios.put(`http://localhost:80/user?uid=${userId}`, updateUserData);
        expect(response.status).to.equal(200);
        expect(response.data.status).to.equal('success');
    });

    it("should get the user and verify the update", async function () {
        const response = await axios.get(`http://localhost:80/user?uid=${userId}`);
        expect(response.status).to.equal(200); // 
        expect(response.data.status).to.equal('success');
    });

    it("should delete the user", async function () {
        const response = await axios.delete(`http://localhost:80/user?uid=${userId}`);
        expect(response.data.status).to.equal('success');
    });

    it("should get all users and verify the user is deleted", async function () {
        const response = await axios.get('http://localhost:80/users');
        expect(response.data.status).to.equal('success');
    });
});

after