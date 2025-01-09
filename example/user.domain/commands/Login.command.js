const { log } = require("util");
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
                method: 'POST',
                target: '/check',
                handler: 'check',
            },
            {
                method: 'POST',
                target: '/check',
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
        delete validateUser.errors;
        this.command.session.createSession(validateUser, 3600, true);

        return {
            status: 'success',
            message: 'Logged in',
        };
    }

    async check() {
        try {
            const sessions = this.command.session.getSession(true);
            if (!sessions || !sessions.data) {
                return {
                    status: 'fail',
                    message: 'session not found',
                };
            }
            const validateUser = await this.loginService.check({userId: sessions.data.userId, password: sessions.data.password});
            if (!validateUser) {
                return {
                    status: 'fail',
                    message: 'check failed',
                };
            }
            return {
                status: 'success',
            };
        } catch (error) {
            console.log('error', error);
            return {
                status: 'fail',
            };
        }

    }
};


module.exports = LoginCommand;