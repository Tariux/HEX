#!/usr/bin/env node

const { program } = require('commander');
const { _HEX } = require('..');
const path = require('path');
const { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } = require('fs');
const { tools } = require('../src/utils/ToolManager') || { logger: console };

let hexApp;

function copyDirectory(source, target) {
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true });
  }

  const files = readdirSync(source);

  files.forEach((file) => {
    const sourceFile = path.join(source, file);
    const targetFile = path.join(target, file);
    if (statSync(sourceFile).isDirectory()) {
      copyDirectory(sourceFile, targetFile);
    } else {
      copyFileSync(sourceFile, targetFile);
    }
  });
}

program
  .version('1.0.0')
  .description('A CLI for managing the Hex Micro package')
  .addHelpCommand('help', 'Display help for commands')
  .on('--help', () => {
    console.log('\nExamples:');
    console.log('  $ hex start <env>   Start the service with a specified environment');
    console.log('  $ hex create <path> Create a new Hex Micro project');
  });

program
  .command('hex')
  .description('Start the Hex Micro service with the specified environment directory configuration')
  .action((env) => {
  })

program
  .command('start <env>')
  .description('Start the Hex Micro service with the specified environment directory configuration')
  .action((env) => {
    try {
      let envPath = path.join(process.cwd(), env);
      if (!envPath) {
        tools.logger.error('Error: Environment path is required.');
        process.exit(1);
      }

      if (existsSync(path.join(envPath, 'environments'))) {
        envPath = path.join(envPath, 'environments');
        tools.logger.info('Found project directory with environments folder. Loading from:', envPath);
      }
      if (!existsSync(envPath)) {
        tools.logger.error('Error: Environment path does not exist.');
        process.exit(1);
      }

      if (
        !existsSync(path.join(envPath, 'default.js')) &&
        !existsSync(path.join(envPath, 'production.js')) &&
        !existsSync(path.join(envPath, 'test.js')) &&
        !existsSync(path.join(envPath, 'development.js'))
      ) {
        tools.logger.error('Error: Environment directory must contain configuration files.');
        tools.logger.error('Required: default.js or development.js, production.js, test.js.');
        process.exit(1);
      }

      hexApp = new _HEX(envPath);
      hexApp.launch()
        .then(() => {
          tools.logger.info('Service started successfully using environment:', env);
        })
        .catch((error) => {
          tools.logger.error('Failed to start service:', error.message);
          process.exit(1);
        });
    } catch (error) {
      tools.logger.error('Initialization failed:', error.message);
      process.exit(1);
    }
  });

program
  .command('create <projectPath>')
  .description('Create a new Hex Micro project at the specified path')
  .action((projectPath) => {
    try {
      const templateDir = path.join(__dirname, '../example');
      const targetDir = path.resolve(process.cwd(), projectPath);

      if (!existsSync(templateDir)) {
        tools.logger.error('Error: Template directory does not exist.');
        process.exit(1);
      }

      if (existsSync(targetDir)) {
        tools.logger.error('Error: Target directory already exists.');
        process.exit(1);
      }

      copyDirectory(templateDir, targetDir);
      tools.logger.info('Project created successfully at:', targetDir);
    } catch (error) {
      tools.logger.error('Project creation failed:', error.message);
      process.exit(1);
    }
  });

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

program.parse(process.argv);