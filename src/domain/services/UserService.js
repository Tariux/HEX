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

  async delete(userID) {
    return this.userRepository.delete(userID);
  }

  async update(user) {
    return this.userRepository.update(user);
  }

  async get(userID) {
    return this.userRepository.findById(userID);
  } 

  async getAll() {
    return this.userRepository.getAll();
  }
}

module.exports = UserService;