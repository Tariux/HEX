class AfterUserAccessAA {
    static options = {
        middlewareName: 'AfterUserAccessAA',
        type: 'after',
    };

    handle(command, next, before) {
        console.log('MIDDLE WARE 4 after');
        next(before + "AfterUserAccessAA")
    }
};

module.exports = AfterUserAccessAA;