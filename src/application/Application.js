const CommandDispatcher = require("./command/CommandDispatcher");

class Application {
    constructor() {
        this.dispathcer = new CommandDispatcher(this.logger)
    }
    run() {
        this.dispathcer.autoRegister();


        setTimeout(() => {
            this.dispathcer.dispatch('CreateUserCommand')
        }, 2000);
    }

    logger(message) {
        console.log(`[Application] ${message}`);
    }
}

module.exports = Application;