const { v4: uuidv4 } = require('uuid');
const { _DB } = require("hex-micro");
const UserRepository = require("../repositories/UserRepository");
const UserAggregate = require('../models/aggregates/UserAggregate');

class UserService {
  key = 'User';
  constructor() {
    this.#init();
  }

  async #init() {    
    this.db = await _DB.adapter.getConnection('user_db');
    this.userRepository = new UserRepository(this.db);
  }

  async create(data) {
    if (!data) {
      return;
    }
    let userAggregate;
    try {
      const uuid = uuidv4();
      userAggregate = await UserAggregate.create({userId: uuid, ...data})

    } catch (error) {
      throw new Error('invalid input data for user: ' + error.message);
    }
    try {
      return this.userRepository.create(userAggregate);
    } catch (error) {
      throw new Error(error.message)
    }
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