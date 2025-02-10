module command

import commandparser { Request, ParsedCommand, parse }

pub struct Command {
pub mut:
	data        map[string]string // Contains properties like protocol, method, target, etc.
	typ         string            // Command type (set during parsing)
	signature   string            // Computed pattern signature
	response    string
	dispatcher  string
	error       string
	status_code int
}

pub fn new_command(request map[string]string) !Command {
	mut cmd := Command{}
	// Create a Request from the map.
	// (Assumes the request map has keys such as "req_type", "url", "method", etc.)
	req := Request{
		req_type: request['req_type'] or { 'UNKNOWN' },
		data: request,
		input_data: map[string]string{},
		query_params: map[string]string{},
		url: request['url'] or { '' },
		method: request['method'] or { 'GET' },
		headers: map[string]string{},
	}
	parsed := parse(req)!
	// Use clone() to copy the map.
	cmd.data = parsed.data.clone()
	cmd.typ = parsed.typ
	return cmd
}

pub fn (mut cmd Command) pattern() string {
	cmd.signature = pattern_from_data(cmd.data)
	return cmd.signature
}

pub fn (mut cmd Command) set_session(session string) {
	cmd.data['session'] = session
}

pub fn (cmd Command) get_session() string {
	return cmd.data['session']
}

pub fn (mut cmd Command) set_response(response string) {
	cmd.response = response
}

pub fn (mut cmd Command) set_dispatcher(dispatcher string) {
	cmd.dispatcher = dispatcher
}

pub fn (mut cmd Command) set_error(err string) {
	cmd.error = err
}

pub fn (mut cmd Command) set_status_code(status int) {
	cmd.status_code = status
}

pub fn pattern_from_data(data map[string]string) string {
	// Expected keys: type, protocol, method, target.
	// If a key is missing, a default value is used.
	typ := data['type'] or { 'UNKNOWN' }
	protocol := data['protocol'] or { 'UNKNOWN' }
	method := data['method'] or { 'UNKNOWN' }
	target := (data['target'] or { 'UNKNOWN' }).to_upper()
	return 'COMMAND:${typ}.${protocol}:${method}:${target}'
}
