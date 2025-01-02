class AfterUserAccess {
    static options = {
        middlewareName: 'AfterUserAccess',
        type: 'after',
    };

    handle(command, next, before) {
        console.log('MIDDLE WARE 3 after');
        next(before + "AfterUserAccess")

    }
};


module.exports = AfterUserAccess;