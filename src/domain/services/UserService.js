const Database = require("../../infrastructure/application/database/Database");
const UserRepository = require("../repositories/UserRepository");

class UserService {
  key = 'User';
  constructor() {
    this.#init();
  }

  async #init() {    
    this.db = await Database.adapter.getConnection('mySqlLite2');
    this.userRepository = new UserRepository(this.db);
  }

  async create(user) {
    return this.userRepository.create(user);
  }

  async getAll() {
    return this.userRepository.getAll();
  }
}

module.exports = UserService;