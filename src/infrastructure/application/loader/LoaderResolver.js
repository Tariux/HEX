const Loader = require("./Loader");
const fs = require("fs");
const path = require("path");
const { tools } = require("../../utils/ToolManager");

class LoaderResolver {

    static getFiles(filePath) {
        if (typeof filePath === "string") {
            return fs
                .readdirSync(filePath)
                .map((file) => path.join(filePath, file));
        }
        if (Array.isArray(filePath)) {
            return filePath.flatMap((dir) =>
                fs.readdirSync(dir).map((file) => path.join(dir, file))
            );
        }
        throw new Error(`no valid "${filePath}" found!`);
    }

    static resolveLoaderEntities(loaderConfig) {
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

    static createInstanceAndLoad(classObject , loader) {
        let loadedEntities;
        try {
            if (
                typeof loader === 'string' ||
                typeof loader === 'object'
            ) {
                loadedEntities = LoaderResolver.resolveLoaderEntities(loader);
            }
            return new classObject(loadedEntities);
        } catch (error) {
            tools.logger.error(`error while loading: ${classObject?.constructor?.name || classObject?.name || 'Uknown'}.`);
            tools.logger.error(error);
            return;
        }
    }

    static loadJsFile(filePath) {
        if (path.extname(filePath) !== ".js") return false;
        try {
            return require(filePath);
        } catch (error) {
            tools.logger.error(`cannot load file ${filePath}`)
            tools.logger.error(error)
            return false;
        }
    }
}

module.exports = LoaderResolver;