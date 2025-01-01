class DatabaseAdapter {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    throw new Error('connect method must be implemented.');
  }

  async disconnect() {
    throw new Error('disconnect method must be implemented.');
  }

  async query(sql, params = []) {
    throw new Error('query method must be implemented.');
  }
}

module.exports = DatabaseAdapter;