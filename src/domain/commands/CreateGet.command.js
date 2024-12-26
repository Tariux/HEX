module.exports = class CreateUserCommand {

    constructor() {
        this.commandName = 'CreateUserCommand';
        this.accessType = 'private';
        this.type = 'REQUEST';
        this.protocol = 'HTTP';
        this.method = 'GET';
        this.target = '/get';
        this.contentType = 'text/json'

    }

    handle() {
        return {
            message: "create CreateUserCommand"
        };
    }
}