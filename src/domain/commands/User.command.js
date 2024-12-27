const Loader = require("../../infrastructure/application/loader/Loader");

module.exports = class UserCommand {
    constructor() {
        this.descriptor = {
            commandName: 'UserCommand',
            type: 'REQUEST',
            protocol: 'HTTP',
            routes: [
                {
                    method: 'GET',
                    target: '/user/:userId',
                    handler: 'getUser',
                    contentType: 'text/json',
                },
                {
                    method: 'GET',
                    target: '/user',
                    handler: 'createUser',
                    contentType: 'text/json',
                },
            ],
        };

    }

    async getUser() {
        const userService = Loader.get('User' , 'domain.services');
        return userService.createUser();
    }

    async createUser() {
        const userService = Loader.get('User' , 'domain.services');
        return userService.createUser();
    }
};
