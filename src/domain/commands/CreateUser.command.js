module.exports = class GetUserCommand {

    constructor() {
        this.commandName = 'GetUserCommand';
        this.accessType = 'private';
        this.type = 'REQUEST';
        this.protocol = 'HTTP';
        this.method = 'GET';
        this.target = '/create'
        this.contentType = 'text/json'
    }

    handle() {
        return {
            message: "get GetUserCommand"
        };
    }
}