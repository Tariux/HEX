const { tools } = require("../../utils/ToolManager");

class CommandParser {
    #request = null;
    constructor(request) {
        this.#request = request;
    }

    parse() {
        return this.#parseCommandFromRequest();
    }

    #parseCommandFromRequest() {
        let command;
        switch (this.#request.type) {
            case 'HTTP':
            case 'HTTPS':
                command = this.#httpRequestToCommand(this.#request.data, this.#request.type, this.#request.inputData, this.#request.queryParams);
                break;
            case 'RPC':
                command = this.#rpcRequestToCommand(this.#request.data);
                break;
            default:
                command = this.#genericRequestToCommand(this.#request.type, this.#request.data);
                tools.logger.error(`unsupported request type ${this.#request.type}`);
        }
        return {
            type: this.type,
            data: command
        };
    }

    #validateRoute(route) {
        const regex = /^\/([^?]*)/;         const match = route.match(regex);
        return match ? `/${match[1]}`.toUpperCase() : null;      }

    #httpRequestToCommand(httpRequest, protocol, inputData = false , queryParams = false) {
        const { method, url, body, query, httpVersion, headers, statusCode } = httpRequest;

        const meta = {
            timestamp: new Date().toISOString(),
            // headers: headers || {},  
            httpVersion,
            contentType: headers?.['content-type'] || null,
        };

        return {
            type: 'REQUEST',
            protocol: protocol.toUpperCase(),
            method: method.toUpperCase(),
            target: this.#validateRoute(url),
            statusCode: statusCode || 200,
            inputData: inputData || body || {},
            queryParams: queryParams || {},
            meta,
        };
    }

    #rpcRequestToCommand(rpcRequest) {
        const { serviceName, methodName, payload } = rpcRequest;
        const target = `${serviceName}/${methodName}`;

        return {
            type: 'REQUEST',
            protocol: 'RPC',
            method: methodName.toUpperCase(),
            target,
            payload: payload || {}
        };
    }

    #genericRequestToCommand(type, data) {
        return {
            type: 'UNKNOWN',
            protocol: type.toUpperCase(),
            method: 'UNKNOWN',
            target: 'UNKNOWN',
            payload: data || {}
        };
    }

}

module.exports = CommandParser;