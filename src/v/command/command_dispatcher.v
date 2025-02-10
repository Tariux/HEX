module command_dispatcher

import command
import toolmanager

// Remove the parameter name from the function pointer type.
pub type HandlerFn = fn (mut command.Command, map[string]string) !string

pub struct CommandHandler {
pub mut:
	// Make the function pointer optional so it must be initialized.
	handler ?HandlerFn
	middlewares []HandlerFn // (For simplicity, middleware handling is omitted.)
}

pub struct CommandDispatcher {
pub mut:
	handlers map[string]CommandHandler
}

pub fn new_dispatcher() &CommandDispatcher {
	return &CommandDispatcher{
		handlers: map[string]CommandHandler{}
	}
}

pub fn (mut disp CommandDispatcher) register_command_handler(pattern string, handler CommandHandler) {
	if pattern in disp.handlers {
		toolmanager.logger.error("Handler for pattern $pattern is already registered")
		return
	}
	disp.handlers[pattern] = handler
}

pub fn (mut disp CommandDispatcher) dispatch_command(pattern string, payload map[string]string, mut cmd command.Command) !string {
	if pattern !in disp.handlers {
		return error("Handler for pattern $pattern not found")
	}
	mut handler := disp.handlers[pattern]
	// Unwrap the optional handler function pointer.
	f := handler.handler or { return error("Handler function not set for pattern $pattern") }
	result := f(mut cmd, payload)!
	return result
}
