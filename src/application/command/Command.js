class Command {
    constructor(commandName, accessType = 'public') {
        this.commandName = commandName;
        this.accessType = accessType;
    }

    log(message , args) {
        console.log(`[Command(${this.accessType}): ${this.commandName}] ${message.toString()}` , (args === undefined)  ? '' : args);
    }
}

module.exports = Command;
