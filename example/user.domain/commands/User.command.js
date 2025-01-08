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
                middlewares: ['UserAccess']
            },
            {
                method: 'POST',
                target: '/users',
                handler: 'getUsers',
                middlewares: ['UserAccess']
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
            return {
                status: 'fail',
                message: 'error while create user',
                error: error.message,
            };

        }


    }

    async updateUser() {
        try {
            const uid = this.command?.queryParams?.uid;
            if (!uid) {
                return {
                    status: 'fail',
                    message: 'user id not valid ' + uid,
                    user: false,
                };
            }
            const updateUser = await this.userService.update(uid, this.command?.inputData);
            if (updateUser) {
                return {
                    status: 'success',
                    message: 'User updated successfully',
                    user: updateUser,
                };
            } else {
                return {
                    status: 'fail',
                    message: 'user cannot update',
                    user: false,
                };
            }
        } catch (error) {
            return {
                status: 'fail',
                message: 'error while update user',
                error: error.message,
            };

        }
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