const UserAggregate = require('../models/aggregates/UserAggregate');

class UserCommand {

    static descriptor = {
        commandName: 'UserCommand',
        type: 'REQUEST',
        protocol: 'HTTP',
        loader: ['domain.services.User'],
        contentType: 'text/json',
        routes: [
            {
                method: 'DELETE',
                target: '/user',
                handler: 'deleteUser',
                // loader: 'domain.anotherNamespace.AnotherService',
            },
            {
                method: 'POST',
                target: '/user',
                handler: 'createUser',
            },
            {
                method: 'PUT',
                target: '/user',
                handler: 'updateUser',
            },
            {
                method: 'GET',
                target: '/user',
                handler: 'getUser',
            },
            {
                method: 'GET',
                target: '/user',
                handler: 'getUser',
                protocol: 'HTTPS',
            },
            {
                method: 'GET',
                target: '/users',
                handler: 'getUsers',
                middlewares: ['UserMiddleware', 'UserAccess', 'AfterUserAccess', 'AfterUserAccessAA']
            },
            {
                method: 'GET',
                target: '/users',
                handler: 'getUsers',
                protocol: 'HTTPS',
            }
        ],
    };
    constructor(services) {
        this.userService = services.get('User');
    }

    async getUser() {
        const { uid } = this.command.queryParams;
        const user = await this.userService.get(uid);
        if (user) {
            return {
                status: 'success',
                message: 'User retrieved',
                data: user,
            };
        }
        return {
            status: 'fail',
            message: 'User not found',
        };

    }

    async getUsers() {
        return {
            status: 'success',
            message: 'Users retrieved successfully',
            data: await this.userService.getAll(),
        };
    }

    async createUser() {
        try {
            try {
                const createUser = await this.userService.create(this.command?.inputData);
                if (createUser) {
                    return {
                        status: 'success',
                        message: 'User created successfully',
                        user: createUser,
                    };
                } else {
                    return {
                        status: 'fail',
                        message: 'user cannot create',
                        user: false,
                    };
                }
            } catch (error) {
                console.log('ERR:' , error);

                return {
                    status: 'fail',
                    message: 'error while create user',
                    error: error.message,
                };
                
            }

        } catch (error) {
            console.log(error);

        }


    }

    async updateUser() {
        const { userID, firstName, lastName, email, yyyy, mm, dd } = this.command.inputData;
        const user = new UserAggregate(userID, firstName, lastName, email, yyyy, mm, dd);
        return {
            status: 'success',
            message: 'User updated successfully',
            user: await this.userService.update(user),
        };
    }

    async deleteUser() {
        const { uid } = this.command.queryParams;
        const user = await this.userService.get(uid);
        if (user) {
            return {
                status: 'success',
                message: 'User deleted successfully',
                data: await this.userService.delete(uid),
            };
        }
        return {
            status: 'fail',
            message: 'User not found',
        };
    }
};


module.exports = UserCommand;