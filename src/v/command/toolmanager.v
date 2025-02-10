module toolmanager

pub struct Logger {}

pub fn (l Logger) error(msg string) {
	println('[ERROR] ' + msg)
}

pub fn (l Logger) warn(msg string) {
	println('[WARN] ' + msg)
}

pub fn (l Logger) info(msg string) {
	println('[INFO] ' + msg)
}

pub const logger = Logger{}
