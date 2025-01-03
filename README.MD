## Hex ⬡
### A DDD Hexagonal Architecture for Flexible Web Applications

Welcome to Hex, a pure JavaScript implementation of Domain-Driven Design (DDD) and Hexagonal Architecture designed to build flexible, scalable, and maintainable web applications, `and we’d love for you to be part of the Hex journey!`

**Hex-Micro** is a backend microservice framework built on Domain-Driven Design (DDD) principles. It simplifies building scalable, modular, and environment-aware backend applications. 

## Installation

Install the package via npm:

```bash
npm install hex-micro
```
Install the package via bun:

```bash
bun install hex-micro
```

## Project Setup CLI
### A command-line interface (CLI) for managing Hex Micro projects and services.

Notes
Ensure that your environment directory contains at least one configuration file `(default.js, development.js, production.js, or test.js)`.
Modify the templateDir path in the script if the template is stored in a different location.

#### Installation
install package and link the CLI tool if needed:
```bash
npm install hex (-g optinal)
npm link (if needed)
```
#### Commands:
```bash
hex start <env>
```
Starts the Hex Micro service using the specified environment configuration.
or you can first use `hex create <path>` then start following directory
#### Example:
```bash
hex start <env_directory or project_directory>
```
Checks the specified environment path for required configuration files.
Launches the Hex Micro service with the provided settings.
Logs:
Success: Service started successfully.
Error: Detailed error messages when the service cannot start due to missing files or invalid paths.
```bash
hex create <projectPath>
```
Creates a new Hex Micro project at the specified location.
Example:
```bash
hex create my-hex-project
```

This command:

Copies the template directory to the specified path.
Initializes the project structure.
Logs:
Success: Project created successfully at the specified location.
Error: Target directory already exists or the template directory is missing.
-h, --help
Displays help information about available commands.

Example:
```bash
hex --help
```
Shows a list of commands and their descriptions.

## Project Setup Manual

Initialize the project Create an entry file in the root of your project (or any where) and configure it with your environment setup. environment setup is a folder that keeps your project config for diffrent environment. you can create `default.js, development.js, production.js, test.js` in `<poject>/environment` (names are optional)

Require the package Use the following code to import Hex-Micro in your project:
```javascript
const path = require('path');
const { _HEX } = require("hex-micro");
// Create Hex App instance
const hexApp = new _HEX(path.join(__dirname, './example.domain/environments')); // environment path inside your domain
hexApp.launch();
```
   
Stop the service when needed You can stop the service by calling:
```javascript
hexApp.stop();
```

## Environment Configuration

The path for environments is critical and contains separate configuration files for different environments such as development, production, test, and default. Each environment follows a similar structure, allowing for tailored configurations.

### Example Environment Configuration
```javascript
const path = require('path');
// /environment/default.js
// /environment/development.js
// /environment/production.js
// /environment/test.js
module.exports = {
    "event": {
        "emitter": "eventemitter2"
    },
    "packages": [
        'http', 'jwt' 
    ],
    "commandsPath": [
        path.join(__dirname, "../commands")
    ],
    "eventsPath": [
        path.join(__dirname, "../events")
    ],
    "servicesPath": [
        {
            path: path.join(__dirname, "../services"),
            namespace: "domain.services"
        }
    ],
    "middlewaresPath": [
        path.join(__dirname, "../middlewares")
    ],
    "database": {
        defaultDB: {
            type: 'sqlite',
            filename: './data/default.db',
            initialQuery: [
                `CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL
                );`
            ]
        }
    },
    "servers": [ // you can add as many you want
        {
            "name": "MainServer",
            "host": "localhost",
            "port": 3000,
            "type": "http",
            "ssl": false
        }
    ]
};
```
### Directory Structure

Hex-Micro uses a structured directory layout for clean separation of concerns:
- Commands: Business logic commands.
- Middlewares: Request and response processing.
- Services: Application-specific service logic.
- Packages: External integrations.
- Repositories: Data management layers.
- Events: Event-driven logic.

## Development 
## Examples and Sample Scenarios

To better understand how to use Hex Micro and explore an extensive scenario, you can refer to the `example` directory in the project. This directory includes two different use cases:

1. **Basic Example**: A simple and foundational example to get started with Hex Micro.
2. **Real-World Scenario**: A comprehensive and practical example demonstrating the advanced capabilities of the framework in a real-world project.

### Accessing the Examples
- **GitHub**: Visit the [example](https://github.com/Tariux/hex/tree/main/example) directory in the GitHub repository.
- **Module Folder**: All examples are available in the `example` folder within the `hex-micro` module.

### Enhanced Documentation
In the future, the project documentation will be further expanded, and additional content will be added. Be sure to follow the GitHub repository for updates and more details.

### Commands 

### Middlewares 

### Services 

### Packages 

### Events 

## Links

- GitHub: [Hex-Micro Framework](https://github.com/Tariux/hex)
- NPM: [hex-micro](https://www.npmjs.com/package/hex-micro)

#### readme and documents is not ready yet, so sorry :>.