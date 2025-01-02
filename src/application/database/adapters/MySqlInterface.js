const mysql = require('mysql2/promise');
const DatabaseAdapter = require('../DatabaseAdapter');
const { tools } = require('../../../utils/ToolManager');

class MySqlInterface extends DatabaseAdapter {
  async connect() {
    try {
      this.connection = await mysql.createConnection({
        host: this.config.host,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
      });
      tools.logger.info('Connected to MySQL database');
    } catch (err) {
      tools.logger.error('Error connecting to MySQL:');
      tools.logger.error(err);
      return;
    }
  }

  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.end();
        tools.logger.info('Disconnected from MySQL database');
      } catch (err) {
        tools.logger.error('Error disconnecting from MySQL:', err);
        tools.logger.error(err);
        return;
      }
    }
  }

  async query(sql, params = []) {
    try {
      const [rows] = await this.connection.execute(sql, params);
      return rows;
    } catch (err) {
      tools.logger.error('Error executing query:', err);
      return;
    }
  }
}

module.exports = MySqlInterface;