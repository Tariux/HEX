const Command = require("../Command");

module.exports = class CreateUserPublicCommand extends Command {

    constructor() {
        super('CreateUserPublicCommand', 'public')
    }

    handle() {
        console.log('Whoaaa, handle run but public');
    }
}