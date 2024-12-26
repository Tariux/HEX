module.exports = class CreateUserCommand {

    constructor() {
        this.commandName = 'CreateUserCommand';
        this.accessType = 'private';
    }

    handle() {
        console.log('Whoaaa, handle run');
    }
}