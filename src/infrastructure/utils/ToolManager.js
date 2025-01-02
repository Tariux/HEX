const Logger = require("./Logger");

const tools = {
    logger: new Logger(),
    helper: {
        groupBy: (items, key) => {
            return items.reduce((grouped, item) => {
                const groupKey = item[key];
                if (!grouped[groupKey]) {
                    grouped[groupKey] = [];
                }
                grouped[groupKey].push(item);
                return grouped;
            }, {});
        }
        
    }
}

exports.tools = tools;