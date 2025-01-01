const hex = require("../main");
const axios = require("axios"); // Import axios for HTTP requests

async function send(route) {
    try {
        const response = await axios.post(route, {
            // Include data to send with the POST request
            name: "Test User",
            role: "tester"
        });
        console.log("Response:", response.data); // Log the response data
    } catch (error) {
        console.error("Error making POST request:", error);
    }
}

async function ping() {
    const Hex = new hex(); // Initialize the Hex instance
    await Hex.launch(); // Launch the application

    await send("http://localhost:80/users");
    // await send("https://localhost:80/users");

}
ping()