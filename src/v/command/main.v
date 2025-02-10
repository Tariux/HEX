import command
import command_dispatcher
import command_router
import toolmanager

fn dummy_handler(mut cmd command.Command, payload map[string]string) !string {
	// Simulate command handling logic.
	toolmanager.logger.info("Executing dummy handler for command: " + cmd.signature)
	cmd.set_response("Response from dummy handler")
	return "Handler executed successfully"
}

fn main() {
	// Simulate an incoming request as a map.
	request := {
		'req_type': 'HTTP'
		'url': '/api/test'
		'method': 'GET'
	}

	// Create a new command from the request.
	mut cmd := command.new_command(request) or {
		toolmanager.logger.error('Failed to create command: $err')
		return
	}

	// Compute the command pattern.
	pattern := cmd.pattern()
	toolmanager.logger.info("Command pattern: " + pattern)

	// Create a dispatcher (heap-allocated) and a router.
	mut dispatcher := command_dispatcher.new_dispatcher()
	mut router := command_router.new_command_router(dispatcher)

	// Create a command handler using the dummy handler function.
	handler := command_dispatcher.CommandHandler{
		handler: dummy_handler
		middlewares: []command_dispatcher.HandlerFn{} // no middleware in this simple example
	}

	// Register the command handler with the router.
	router.register_command(pattern, handler)

	// Dispatch the command (with an empty payload in this example).
	result := dispatcher.dispatch_command(pattern, map[string]string{}, mut cmd) or {
		toolmanager.logger.error("Dispatch error: $err")
		return
	}
	toolmanager.logger.info("Dispatch result: " + result)
}
