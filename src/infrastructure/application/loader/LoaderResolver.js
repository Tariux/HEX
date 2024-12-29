const Loader = require("./Loader");

class LoaderResolver {

    static resolveCommandEntities(loaderConfig) {
        if (!loaderConfig) return;
        if (typeof loaderConfig === 'object') {
            return LoaderResolver.resolveMultipleEntities(loaderConfig);
        } else if (typeof loaderConfig === 'string') {
            return LoaderResolver.resolveSingleEntitiy(loaderConfig);
        }
        return;
    }

    static resolveMultipleEntities(entityKeys) {
        const loadedEntities = new Map();
        entityKeys.forEach(entityPath => {
            const entity = Loader.get(entityPath);
            if (entity?.key) {
                loadedEntities.set(entity.key, entity);
            }
        });
        return loadedEntities;
    }

    static resolveSingleEntitiy(entityPath) {
        return Loader.get(entityPath);
    }
}

module.exports = LoaderResolver;