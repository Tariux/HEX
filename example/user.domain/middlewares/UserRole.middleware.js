class UserRole {
    static options = {
        middlewareName: 'UserRole',
        type: 'before',
        loader: ['domain.services.Login', 'domain.services.User'],
    };

    constructor(services) {
        this.loginService = services.get('Login');
        this.userService = services.get('User');
    }

    async handle(command, next) {
        console.log('UserRole Middleware Called');
        
        const sessions = command.data.session.getSession(true);
        if (!sessions || !sessions.data) {
            throw new Error('session not found');
        }
        const user = await this.userService.get(sessions.data.id);
        if (!user || !user.auth) {
            throw new Error('user not found');
        }
        if (user.auth.role === 'user') {
            await next();
        }
        throw new Error('access denied, role: ' + user.auth.role);

    }
};


module.exports = UserRole;