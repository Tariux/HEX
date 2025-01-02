const { MongoClient } = require('mongodb');
const DatabaseAdapter = require('../DatabaseAdapter');
const { tools } = require('../../../utils/ToolManager');

class MongoInterface extends DatabaseAdapter {
  async connect() {
    try {
      this.connection = await MongoClient.connect(this.config.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      tools.logger.info('Connected to MongoDB');
    } catch (err) {
      tools.logger.error('Error connecting to MongoDB:', err);
      throw err;
    }
  }

  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.close();
        tools.logger.info('Disconnected from MongoDB');
      } catch (err) {
        tools.logger.error('Error disconnecting from MongoDB:', err);
        throw err;
      }
    }
  }

  async query(collection, operation, ...args) {
    try {
      const db = this.connection.db(this.config.databaseName);
      const coll = db.collection(collection);

      switch (operation) {
        case 'insert':
          return await coll.insertOne(...args);
        case 'find':
          return await coll.find(...args).toArray();
        case 'update':
          return await coll.updateOne(...args);
        case 'delete':
          return await coll.deleteOne(...args);
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (err) {
      tools.logger.error('Error executing MongoDB query:', err);
      throw err;
    }
  }
}

module.exports = MongoInterface;