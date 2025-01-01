const Events = require("../../infrastructure/application/events/Events");

class UserCommand {
    static descriptor = {
        commandName: 'UserCommand',
        type: 'REQUEST',
        protocol: 'HTTP',
        loader: ['domain.services.User' , 'domain.services.Order'],
        routes: [
            {
                method: 'GET',
                target: '/users',
                handler: 'getUsers',
                // loader: 'domain.anotherNamespace.AnotherService',
                contentType: 'text/json',
            },
            {
                method: 'GET',
                target: '/user',
                // loader: ['domain.services.UserMock' , 'domain.services.OrderMock'],
                handler: 'createUser',
                contentType: 'text/json',
            },
        ],
    };
    constructor(services) {
        this.userService = services.get('User');
        this.orderService = services.get('Order');
    }

    async getUsers() {
        return {
            status: 'success',
            message: 'Users retrieved successfully',
            data: await this.userService.getUsers(),
        };
    }

    async createUser() {
        Events.publish('UserCreatedEvent', {
            userId: '123',
        } , (incoming) => {
        });
        return {
            status: 'success',
            message: 'User created successfully',
        };
    }
};


module.exports = UserCommand;