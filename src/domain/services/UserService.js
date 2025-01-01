const Database = require("../../infrastructure/application/database/Database");

class UserService {
  key = 'User';
  constructor() {
    this.#init();
  }

  async #init() {    
    this.db = await Database.adapter.getConnection('mySqlLite2');
  }

  async createUser() {
    let result;
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    const params = ['Test User', 'test@example.com'];
    try {
      result = await this.db.query(sql, params);
    } catch (error) {
      console.error('Error creating test user:', error);
    }
    return result;
  }

  async getUsers() {
    let result;
    const sql = 'SELECT * FROM users';
    try {
      result = await this.db.query(sql);
    } catch (error) {
      console.error('Error creating test user:', error);
    }
    return result;
  }
}

module.exports = UserService;