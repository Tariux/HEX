class UserCommand {
    static descriptor = {
        commandName: 'UserCommand',
        type: 'REQUEST',
        protocol: 'HTTP',
        loader: ['domain.services.User' , 'domain.services.Order'],
        routes: [
            {
                method: 'GET',
                target: '/user/:userId',
                handler: 'getUser',
                loader: 'domain.anotherNamespace.AnotherService',
                contentType: 'text/json',
            },
            {
                method: 'GET',
                target: '/user',
                loader: ['domain.services.UserMock' , 'domain.services.OrderMock'],
                handler: 'createUser',
                contentType: 'text/json',
            },
        ],
    };
    constructor(services) {
        this.userService = services.get('User');
        this.orderService = services.get('Order');
    }

    async getUser(AnotherService) {
        return this.orderService.createOrder();
    }

    async createUser(services) {
        const ex = services.get('OrderMock');
        return this.userService.createUser();
    }
};


module.exports = UserCommand;