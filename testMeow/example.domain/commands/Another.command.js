class AnotherCommand {
    static descriptor = {
        commandName: 'AnotherCommand',
        type: 'REQUEST',
        protocol: 'HTTP',
        contentType: 'text/json',
        routes: [
            {
                method: 'GET',
                target: '/test',
                handler: 'test',
            },
        ],
    };
    constructor(services) {
    }

    async test() {
        return {
            status: 'success',
            message: 'test successfullyasdasdasd',
        };
    }

};


module.exports = AnotherCommand;