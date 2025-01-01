const sqlite3 = require('sqlite3').verbose();
const { tools } = require('../../../utils/ToolManager');
const DatabaseAdapter = require('../DatabaseAdapter');

class SqlLiteInterface extends DatabaseAdapter {

  async connect() {
    return new Promise((resolve, reject) => {
      this.connection = new sqlite3.Database(this.config.filename, (err) => {
        if (err) {
          reject(err);
        } else {
          tools.logger.info(`connected to ${this.config.filename} database`);
          resolve();
        }
      });
    });
  }

  async initialQuery() {
    await this.connect()
    if (typeof this.config.initialQuery === 'string') {
      this.query(this.config.initialQuery);
    } else if (typeof this.config.initialQuery === 'object') {
      this.config.initialQuery.forEach(query => {
        this.query(query);
      });
    }
  }

  async disconnect() {
    return new Promise((resolve, reject) => {
      this.connection.close((err) => {
        if (err) {
          reject(err);
        } else {
          tools.logger.info(`disconnected from ${this.config.filename} database`);
          resolve();
        }
      });
    });
  }

  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.connection.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = SqlLiteInterface;