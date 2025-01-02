class AfterUserAccessAA {
    static options = {
        middlewareName: 'AfterUserAccessAA',
        type: 'after',
    };

    handle(command, next, before) {
        console.log('MIDDLE WARE 4 after');
    }
};

module.exports = AfterUserAccessAA;