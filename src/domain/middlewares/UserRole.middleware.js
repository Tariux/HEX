class UserMiddleware {
    static options = {
        middlewareName: 'UserMiddleware',
        type: 'before',
        loader: ['domain.services.User'],
    };

    constructor(services) {
        this.userService = services.get('User');
    }

    handle(command, next) {
        next()
    }
};


module.exports = UserMiddleware;