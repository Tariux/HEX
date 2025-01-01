class UserRepository {
  constructor(database) {
    this.database = database;
  }

  async save(user) {
    await this.database.saveUser(user);
  }
}

module.exports = UserRepository;