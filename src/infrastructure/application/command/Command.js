class Command {
    constructor(request) {
        this.#parseCommandFromRequest(request);
    }

    static pattern(data) {
        const { type, protocol, method, target } = data;
        return `COMMAND:${type}.${protocol}:${method}:${target.toUpperCase()}`;
    }

    pattern() {
        return Command.pattern(this.data);
    }

    #parseCommandFromRequest(request) {
        this.type = request.type;
        let command;
        switch (request.type) {
            case 'HTTP':
            case 'HTTPS':
                command = this.#httpRequestToCommand(request.data, request.type);
                break;
            case 'RPC':
                command = this.#rpcRequestToCommand(request.data);
                break;
            default:
                command = this.#genericRequestToCommand(request.type, request.data);
                console.error('[Command] Unsupported request type:', request.type);
        }
        this.data = command;
        console.log(`[Command] New Command: ${this.pattern()} at ${new Date().getTime()}`);
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

module.exports = Command;
