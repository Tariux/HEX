class DatabaseInterface {
  constructor(dbManager) {
    this.dbManager = dbManager;
    this.connections = {}; 
  }

  async getConnection(key) {
    if (this.connections[key]) {
      tools.logger.info(`using cached connection for ${key}`);
      return this.connections[key];
    }

    const db = this.dbManager.getDatabase(key);
    await db.connect();
    this.connections[key] = db;
    tools.logger.info(`created and cached connection for ${key}`);
    return db;
  }

  async closeConnection(key) {
    if (this.connections[key]) {
      await this.connections[key].disconnect();
      delete this.connections[key];
      tools.logger.info(`closed connection for ${key}`);
    } else {
      tools.logger.info(`no active connection found for ${key}`);
    }
  }

  async closeAllConnections() {
    for (const key of Object.keys(this.connections)) {
      await this.closeConnection(key);
    }
    tools.logger.info('all connections closed');
  }

  async query(key, ...args) {
    const db = await this.getConnection(key);
    return await db.query(...args);
  }

  isConnectionActive(key) {
    return !!this.connections[key];
  }

  getActiveConnections() {
    return Object.keys(this.connections);
  }
}

module.exports = DatabaseInterface;