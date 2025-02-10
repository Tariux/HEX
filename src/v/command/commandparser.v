module commandparser

import toolmanager

pub struct Request {
pub:
	req_type     string            // e.g. "HTTP", "RPC", etc.
	data         map[string]string // additional request data
	input_data   map[string]string
	query_params map[string]string
	url          string
	method       string
	headers      map[string]string
}

pub struct ParsedCommand {
pub:
	typ  string            // e.g. "REQUEST" or "UNKNOWN"
	data map[string]string // should contain keys like protocol, method, target, etc.
}

pub fn parse(req Request) !ParsedCommand {
	mut command_data := map[string]string{}
	mut typ := ''
	match req.req_type {
		'HTTP', 'HTTPS' {
			command_data = http_request_to_command(req)!
			typ = 'REQUEST'
		}
		'RPC' {
			command_data = rpc_request_to_command(req)!
			typ = 'REQUEST'
		}
		else {
			command_data = generic_request_to_command(req)!
			typ = 'UNKNOWN'
			toolmanager.logger.error('unsupported request type: ' + req.req_type)
		}
	}
	// Save the type into the command data so that later the pattern can be computed.
	command_data['type'] = typ
	return ParsedCommand{
		typ: typ,
		data: command_data
	}
}

fn http_request_to_command(req Request) !map[string]string {
	mut command_data := map[string]string{}
	command_data['protocol'] = req.req_type.to_upper()
	command_data['method'] = req.method.to_upper()
	// Propagate error from validate_route using !
	command_data['target'] = validate_route(req.url)!
	return command_data
}

fn rpc_request_to_command(req Request) !map[string]string {
	mut command_data := map[string]string{}
	if 'serviceName' in req.data && 'methodName' in req.data {
		command_data['protocol'] = 'RPC'
		command_data['method'] = req.data['methodName']
		command_data['target'] = req.data['serviceName'] + '/' + req.data['methodName']
	} else {
		return error('Invalid RPC request')
	}
	return command_data
}

fn generic_request_to_command(req Request) !map[string]string {
	mut command_data := map[string]string{}
	command_data['protocol'] = req.req_type.to_upper()
	command_data['method'] = 'UNKNOWN'
	command_data['target'] = 'UNKNOWN'
	return command_data
}

fn validate_route(route string) !string {
	if route.len == 0 {
		return error('Invalid route')
	}
	return route.to_upper()
}
