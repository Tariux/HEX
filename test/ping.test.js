const hex = require("../main");
const axios = require("axios"); // Import axios for HTTP requests

async function send(route) {
    try {
        const response = await axios.post(route, {
            firstName: 'test name',
            lastName: 'test last',
            email: 'test@mail.com',
            yyyy: '2025',
            mm: '01',
            dd: '01'
        });
        console.log("Response:", response.data); // Log the response data
    } catch (error) {
        console.error("Error making POST request:", error);
    }
}

async function ping() {
    const Hex = new hex(); // Initialize the Hex instance
    await Hex.launch(); // Launch the application

    await send("http://localhost:80/user");
    // await send("https://localhost:80/users");

}
ping()