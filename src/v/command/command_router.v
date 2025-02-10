module command_router

import command_dispatcher
import toolmanager

pub struct CommandRouter {
pub mut:
	dispatcher &command_dispatcher.CommandDispatcher
}

pub fn new_command_router(disp &command_dispatcher.CommandDispatcher) CommandRouter {
	return unsafe {
		CommandRouter{
			dispatcher: disp
		}
	}
}


pub fn (mut router CommandRouter) register_command(pattern string, handler command_dispatcher.CommandHandler) {
	router.dispatcher.register_command_handler(pattern, handler)
	toolmanager.logger.info("Registered command: " + pattern)
}
