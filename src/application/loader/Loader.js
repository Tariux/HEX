const path = require('path');
const fs = require('fs');
const ConfigCenter = require('../../config/ConfigCenter');
const { tools } = require('../../utils/ToolManager');

class Loader {
    static pool = new Map();
    static get(key) {
        const entity = Loader.pool.get(key);
        if (entity && typeof entity === 'object') {
            return entity;
        } else {
            tools.logger.error(`${key} entity not found`)
            return;
        }
    }

    static load(entityPath, namespace = '*') {
        if (typeof namespace !== 'string') {
            tools.logger.warn(`namespace of entity is broken`, entityPath)
            return;
        }

        if (path.extname(entityPath) !== '.js') {
            tools.logger.warn(`entity found but broken, ext should be .js`, entityPath)
            return;
        }

        let entityInstance;
        try {
            const Entity = require(entityPath);
            entityInstance = new Entity();
        } catch (error) {
            tools.logger.error(`file found but without entity`)
            tools.logger.error(error)
            return;
        }

        const entityName = `${namespace}.${entityInstance.key}`;

        if (!(entityInstance.key && typeof entityInstance.key === 'string')) {
            tools.logger.warn(`entity found but broken, define a key`, entityPath)
            return;
        }
        if (Loader.pool.get(entityName)) {
            tools.logger.warn(`entity found but loaded before`, entityName)
            return;
        }

        Loader.pool.set(entityName, entityInstance);
        tools.logger.info(`entity loaded: ${entityName}`)
        return entityInstance;

    }

    constructor() {
        this.domainPath = path.join(__dirname, '../../../domain');
        this.loaders = [
            ConfigCenter.getInstance().get('servicesPath'),
        ];
    }

    autoLoad(loader) {
        if (typeof loader === 'object') {
            loader.forEach(object => {
                this.#registerLoaderObjectToPool(object);
            });
        } else {
            tools.logger.error(`error while auto load, make sure loader is object`)
        }
    }

    registerLoaders() {
        this.loaders.forEach(loader => {
            this.autoLoad(loader);
        });
    }

    #registerLoaderObjectToPool(object) {

        if (!object.path) {
            tools.logger.warn(`entity found but broken, define a path`)
            return;
        }
        if (!object.namespace) {
            tools.logger.warn(`entity found but broken, define a namespace`)
            return;
        }

        let entities;
        try {
            entities = fs.readdirSync(object.path);
        } catch (error) {
            tools.logger.error(`cannot load entities` , object.path)
            tools.logger.error(error)
            return;
        }
        entities.forEach(entity => {
            const entityPath = path.join(object.path, entity);
            Loader.load(entityPath, object.namespace)
        });
    }
}

module.exports = Loader;