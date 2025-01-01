const Events = require("../../infrastructure/application/events/Events");
const UserAggregate = require("../models/aggregates/User");
const { v4: uuidv4 } = require('uuid');

class UserCommand {
    static descriptor = {
        commandName: 'UserCommand',
        type: 'REQUEST',
        protocol: 'HTTP',
        loader: ['domain.services.User', 'domain.services.Order'],
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
                target: '/users',
                handler: 'getUsers',
                protocol: 'HTTPS',
                // loader: 'domain.anotherNamespace.AnotherService',
                contentType: 'text/json',
            },
            {
                method: 'POST',
                target: '/users',
                handler: 'getUsers',
                // loader: 'domain.anotherNamespace.AnotherService',
                contentType: 'text/json',
            },
            {
                method: 'POST',
                target: '/user',
                handler: 'createUser',
                // loader: 'domain.anotherNamespace.AnotherService',
                contentType: 'text/json',
            },
            {
                method: 'POST',
                target: '/users',
                handler: 'getUsers',
                protocol: 'HTTPS',
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
            data: await this.userService.getAll(),
        };
    }

    async createUser() {
        const { firstName, lastName, email, yyyy, mm, dd } = this.command.inputData;
        const uuid = uuidv4();
        const user = new UserAggregate(uuid, firstName, lastName, email, yyyy, mm, dd);
        Events.publish('UserCreatedEvent', {
        }, (incoming) => {
        });
        return {
            status: 'success',
            message: 'User created successfully',
            user: await this.userService.create(user),
        };
    }
};


module.exports = UserCommand;