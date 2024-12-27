const path = require('path');
const fs = require('fs');

class Loader {
    static pool = new Map();

    static get(key, namespace) {
        const entity = Loader.pool.get(`${namespace}.${key}`);
        if (entity && typeof entity === 'object') {
            return entity;
        } else {
            throw new Error('[Loader] error: entity not found' , `${namespace}.${key}`)
        }
    }

    static load(entityPath, namespace = '*') {
        if (typeof namespace !== 'string') {
            console.log(`[Loader] warning: namespace of entity is broken`, entityPath);
            return;
        }

        if (path.extname(entityPath) !== '.js') {
            console.log(`[Loader] warning: entity found but broken, ext should be .js`, entityPath);
            return;
        }

        let entityInstance;
        try {
            const Entity = require(entityPath);
            entityInstance = new Entity();
        } catch (error) {
            console.log(`[Loader] error: file found but without entity, path:`, entityPath);
            return;
        }

        const entityName = `${namespace}.${entityInstance.key}`;

        if (!(entityInstance.key && typeof entityInstance.key === 'string')) {
            console.log(`[Loader] warning: entity found but broken, define a key.`, entityPath);
            return;
        }
        if (Loader.pool.get(entityName)) {
            console.log(`[Loader] warning: entity found but loaded before`, entityName);
            return;
        }

        Loader.pool.set(entityName, entityInstance);
        console.log(`[Loader] Registered entity key: ${entityName}`, typeof entityInstance);
        return entityInstance;

    }

    constructor() {
        this.domainPath = path.join(__dirname, '../../../domain');
        this.loaders = [
            { path: 'services', namespace: 'domain.services' },
        ];
    }

    registerLoaders() {
        this.loaders.forEach(loader => {
            this.#registerLoaderToPool(loader);
        });
    }

    #registerLoaderToPool(loader) {
        if (!loader.path) {
            throw new Error('Define path for loader')
        }
        if (!loader.namespace) {
            throw new Error('Define namespace for loader')
        }
        const entitysPath = path.join(this.domainPath, loader.path);
        const entitys = fs.readdirSync(entitysPath);
        entitys.forEach(entity => {
            const entityPath = path.join(entitysPath, entity);
            Loader.load(entityPath, loader.namespace)
        });
    }
}

module.exports = Loader;