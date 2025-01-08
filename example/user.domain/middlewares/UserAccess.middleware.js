class UserAccess {
    static options = {
        middlewareName: 'UserAccess',
        type: 'before',
        loader: ['domain.services.Login'],
    };

    constructor(services) {
        this.loginService = services.get('Login');
    }

    async handle(command, next) {
        const sessions = command.data.session.getSession(true);
        if (!sessions || !sessions.data) {
            next('session not found');
        }
        const validateUser = await this.loginService.check({ userId: sessions.data.userId, password: sessions.data.password });
        if (!validateUser) {
            next('check failed');
        } else {
            next();
        }
    }
};


module.exports = UserAccess;