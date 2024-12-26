module.exports = class GetUserCommand {

    constructor() {
        this.commandName = 'GetUserCommand';
        this.accessType = 'private';
        this.type = 'REQUEST';
        this.protocol = 'HTTP';
        this.method = 'GET';
        this.target = '/create'
    }

    handle() {
        return "get GetUserCommand";
    }
}