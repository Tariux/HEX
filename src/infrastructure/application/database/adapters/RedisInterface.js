const redis = require('redis');
const { promisify } = require('util');
const DatabaseAdapter = require('../DatabaseAdapter');
const { tools } = require('../../../utils/ToolManager');

class RedisInterface extends DatabaseAdapter {
  async connect() {
    try {
      this.connection = redis.createClient({
        host: this.config.host,
        port: this.config.port,
      });

      this.connection.getAsync = promisify(this.connection.get).bind(this.connection);
      this.connection.setAsync = promisify(this.connection.set).bind(this.connection);
      this.connection.delAsync = promisify(this.connection.del).bind(this.connection);

      this.connection.on('connect', () => {
        tools.logger.info('Connected to Redis');
      });

      this.connection.on('error', (err) => {
        tools.logger.error('Redis error:', err);
      });
    } catch (err) {
      tools.logger.error('Error connecting to Redis:', err);
      throw err;
    }
  }

  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.quit();
        tools.logger.info('Disconnected from Redis');
      } catch (err) {
        tools.logger.error('Error disconnecting from Redis:', err);
        throw err;
      }
    }
  }

  async query(command, ...args) {
    try {
      const result = await this.connection[`${command}Async`](...args);
      return result;
    } catch (err) {
      tools.logger.error('Error executing Redis command:', err);
      throw err;
    }
  }
}

module.exports = RedisInterface;