const { spawn } = require("child_process");
const fs = require("fs");
const readline = require("readline");

function logToFile(filename, data) {
    fs.appendFileSync(filename, data + "\n", "utf8");
}

function runExternalProgram(name ,program, args = []) {
    console.log(`Starting ${program} with arguments ${args.join(" ")}`);

    const process = spawn(program, args);

    // Reading output line by line
    const rl = readline.createInterface({
        input: process.stdout,
        terminal: false,
    });

    rl.on("line", (line) => {
        console.log(`[${name}] Output: ${line}`);

        // Log lines containing "SPECIAL_IP" to the log file
        if (line.includes("SPECIAL_IP")) {
            logToFile("special_output.log", line);
        }
    });

    // Handle errors
    process.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    // Handle process exit
    process.on("close", (code) => {
        console.log(`Process exited with code ${code}`);
    });

    // Input handler for user commands
    const userInput = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    userInput.on("line", (input) => {
        if (input.trim().toUpperCase() === "EXIT") {
            console.log("Exiting program.");
            process.kill();
            userInput.close();
        } else {
            console.log(`Sending command: ${input}`);
            process.stdin.write(input + "\n");
        }
    });

    return process;
}

module.exports = {runExternalProgram}