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
                command = this.#httpRequestToCommand(this.#request.data, this.#request.type);
                break;
            case 'RPC':
                command = this.#rpcRequestToCommand(this.#request.data);
                break;
            default:
                command = this.#genericRequestToCommand(this.#request.type, this.#request.data);
                console.error('[Command] Unsupported request type:', this.#request.type);
        }
        return {
            type: this.type,
            data: command
        };
    }

    #httpRequestToCommand(httpRequest, protocol) {
        const { method, url, body, query, httpVersion, headers, statusCode } = httpRequest;

        const meta = {
            timestamp: new Date().toISOString(),
            // headers: headers || {},          
            contentType: headers?.['content-type'] || null,
        };

        return {
            type: 'REQUEST',
            protocol: protocol.toUpperCase(),
            method: method.toUpperCase(),
            target: url.toUpperCase(),
            httpVersion,
            statusCode,
            payload: body || {},
            queryParams: query || {},
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