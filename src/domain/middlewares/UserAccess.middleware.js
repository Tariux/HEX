class UserAccess {
    static options = {
        middlewareName: 'UserAccess',
        type: 'before',
    };

    constructor(services) {
    }

    handle(command, next) {
        console.log('MIDDLE WARE 1' );
        
        next()
    }
};


module.exports = UserAccess;