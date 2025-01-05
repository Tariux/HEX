const { _DB, _PACKAGES } = require("hex-micro");
const UserRepository = require("../repositories/UserRepository");
const Auth = require("../models/entities/Auth");

class LoginService {
  key = 'Login';
  constructor() {
    this.#init();
  }

  async #init() {
    this.db = await _DB.adapter.getConnection('user_db');
    this.hash = await _PACKAGES.getPackage('hash-package');
    this.userRepository = new UserRepository(this.db);
  }


  async check(inputData) {
    let user;
    try {
      user = await this.get(inputData);
      if (!user || !user.data || !user.input?.password) {
        return false;
      }
    } catch (error) {
      throw new Error('user cannot be found ', error.message);
    }
    try {
      const inputPassword = user.input.password;
      const foundPassword = user.data.auth.password;
      const validate = await this.hash.validatePassword(inputPassword, foundPassword);
      if (validate) {
        return true;
      }
    } catch (error) {
      throw new Error('invalid password');
    }

    return false;
  }


  async get(inputData) {
    let authEntity;
    try {
      authEntity = new Auth(inputData.userId, inputData.password);
      authEntity.validate();
    } catch (error) {
      throw new Error('invalid input data for user: ' + error.message);
    }
    const foundData = await this.userRepository.findProfileByKey('email', authEntity.userId);
    try {
      return {
        input: authEntity,
        data: foundData
      };
    } catch (error) {
      throw new Error('user cannot be found ' + error.message);
    }
  }

}

module.exports = LoginService;