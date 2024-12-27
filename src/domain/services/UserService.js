class UserService {
  key = 'User';
  constructor() {
  }

  async createUser() {
    return {
      statusCode: 200,
      data: {
        message: 'User retrieved successfully from service',
        user: {},
      },
    };
  }
}

module.exports = UserService;