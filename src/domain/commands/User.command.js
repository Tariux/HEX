module.exports = class UserCommand {
    constructor({ userService }) {
        this.descriptor = {
            commandName: 'UserCommand',
            type: 'REQUEST',
            protocol: 'HTTP',
            routes: [
                {
                    method: 'GET',
                    target: '/user/:userId',
                    handler: 'getUser', // Maps to a specific method in the class
                    contentType: 'text/json',
                },
                {
                    method: 'GET',
                    target: '/user',
                    handler: 'createUser',
                    contentType: 'text/json',
                },
            ],
        };

        this.userService = userService; // Inject dependencies
    }

    // Handles GET /user/:userId
    async getUser({ params }) {

        // const user = await this.userService.getUserById(userId);

        return {
            statusCode: 200,
            data: {
                message: 'User retrieved successfully',
                user: {},
            },
        };
    }

    // Handles POST /user
    async createUser({ body }) {

        // const newUser = await this.userService.createUser(name, email);

        return {
            statusCode: 201,
            data: {
                message: 'User created successfully',
                user: [],
            },
        };
    }
};
