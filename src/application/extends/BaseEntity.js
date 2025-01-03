
class BaseEntity {
    constructor(schema, params) {
        if (!params) {
            return;
        }
        this.errors = this.#validateRequired(schema.require, params);
    }

    #validateRequired(requiredSchema, params) {
        const invalids = new Map();
        if (requiredSchema) {
            const reqiredFields = Object.keys(requiredSchema);
            const reqiredFilters = Object.values(requiredSchema);
            for (let index = 0; index < reqiredFields.length; index++) {
                const requiredKey = reqiredFields[index];
                const requiredFilter = reqiredFilters[index];
                if (!params[requiredKey] || params[requiredKey] === '') {
                    invalids.set(requiredKey, 'undefined');
                    continue;
                }
                if (requiredFilter && typeof params[requiredKey] !== requiredFilter) {
                    // change this later ... , could be a regex
                    invalids.set(requiredKey, 'invalid');
                }

                this[requiredKey] = params[requiredKey];
            }
        }
        return invalids;

    }

    validate() {
        if (this.errors.size > 0) {
            let errorStack = '';
            this.errors.forEach((error , key) => {
                errorStack = errorStack + `${key}: ${error}, `;
            })
            throw new Error(errorStack.toString())
        }
    }

}

module.exports = BaseEntity;