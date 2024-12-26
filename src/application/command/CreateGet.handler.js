module.exports = class CreateUserCommand {

    constructor() {
        this.commandName = 'CreateUserCommand';
        this.accessType = 'private';
        this.type = 'REQUEST';
        this.protocol = 'HTTP';
        this.method = 'GET';
        this.target = '/get'
    }

    handle() {
        return "create CreateUserCommand";
    }
}