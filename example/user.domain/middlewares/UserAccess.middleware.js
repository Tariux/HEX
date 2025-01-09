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
        console.log('UserAccess Middleware Called');

        const sessions = command.data.session.getSession(true);
        if (!sessions || !sessions.data) {
            throw new Error('session not found');
        }
        const validateUser = await this.loginService.check({ userId: sessions.data.userId, password: sessions.data.password });
        if (!validateUser) {
            throw new Error('check failed');
        } else {
            next();
        }
    }
};


module.exports = UserAccess;