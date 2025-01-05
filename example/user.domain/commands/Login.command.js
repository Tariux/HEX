const { tools } = require("../../../src/utils/ToolManager");
const Auth = require("../models/entities/Auth");

class LoginCommand {
    static descriptor = {
        commandName: 'LoginCommand',
        type: 'REQUEST',
        protocol: 'HTTP',
        loader: ['domain.services.Login'],
        contentType: 'text/json',
        routes: [
            {
                method: 'GET',
                target: '/login',
                handler: 'check',
            },
            {
                method: 'GET',
                target: '/login',
                handler: 'check',
                protocol: 'HTTPS',
            },
            {
                method: 'POST',
                target: '/login',
                handler: 'login',
            },
            {
                method: 'POST',
                target: '/login',
                handler: 'login',
                protocol: 'HTTPS',
            }
        ],
    };
    constructor(services) {
        this.loginService = services.get('Login');
    }

    async login() {
        let validateUser
        try {
            validateUser = await this.loginService.check(this.command.inputData);
        } catch (error) {
            tools.logger.error(error)
            return {
                status: 'fail',
                message: 'Login failed',
                meta: error.message || error,
            };
        }
        if (!validateUser) {
            return {
                status: 'fail',
                message: 'Login failed',
            };
        }
        return {
            status: 'success',
            message: 'Logged in',
        };

    }

    async check() {
        return await this.login();
    }
};


module.exports = LoginCommand;