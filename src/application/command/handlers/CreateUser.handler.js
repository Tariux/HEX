const Command = require("../Command");

module.exports = class CreateUserCommand extends Command {

    constructor() {
        super('CreateUserCommand', 'private')
    }

    handle() {
        this.log('Whoaaa, handle run');
    }
}