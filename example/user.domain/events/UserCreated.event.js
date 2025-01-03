class UserCreatedEvent {
    static eventOptions = {
        eventName: 'UserCreatedEvent',
        loader: ['domain.services.User'],
    };

    constructor(services) {
        this.userService = services.get('User');
        this.orderService = services.get('Order');
    }

    handle (incoming) {
        console.log('EVENT CALLED MEOWWW!!!' , incoming);
        return 'MEOW';
    }

};

module.exports = UserCreatedEvent;