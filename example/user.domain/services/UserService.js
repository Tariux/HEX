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

  async update(userId, data) {
    if (!data) {
      return;
    }
    delete data.phoneNumber;
    delete data.email;
    delete data.password;
    let userAggregate;
    try {
      const userData = await this.userRepository.findById(userId);
      if (!userData) {
        throw new Error(userId + ' user does not exists')
      }
      userAggregate = await UserAggregate.update(userData, data)
    } catch (error) {
      throw new Error('invalid input data for user: ' + error.message);
    }
    try {
      return this.userRepository.update(userAggregate);
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async get(userID) {
    return this.userRepository.findById(userID);
  } 

  async getAll() {
    return this.userRepository.getAll();
  }
}

module.exports = UserService;