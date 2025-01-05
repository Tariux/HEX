const { v4: uuidv4 } = require("uuid");

class SessionManager {
  #req;
  #res;
  constructor(req, res) {
    this.#req = req;
    this.#res = res;
    this.sessions = {}; // Use an object for better session management
  }

  /**
   * Create a new session and set a session ID cookie.
   * @param {object} data - The data to associate with the session.
   * @returns {string} - The session ID.
   */
  createSession(data) {
    const sessionId = uuidv4();
    this.sessions[sessionId] = data;
    this.setCookie("sessionId", sessionId, {
      httpOnly: true,
      path: "/",
    });

    return sessionId;
  }

  /**
   * Get session data from the request.
   * @returns {object|null} - The session data, or null if not found.
   */
  getSession() {
    const sessionId = this.getCookie("sessionId");
    if (sessionId && this.sessions[sessionId]) {
      return this.sessions[sessionId];
    }

    return null; // No session found
  }

  /**
   * Destroy a session and clear the session ID cookie.
   * @param {string} sessionId - The session ID to destroy.
   */
  destroySession(sessionId) {
    if (this.sessions[sessionId]) {
      delete this.sessions[sessionId]; // Remove session data
      this.deleteCookie("sessionId", { path: "/" }); // Clear cookie
    }
  }

  /**
   * Set a cookie in the response.
   * @param {string} name - The name of the cookie.
   * @param {string} value - The value of the cookie.
   * @param {object} options - Cookie options (e.g., httpOnly, maxAge, path, secure, sameSite).
   */
  setCookie(name, value, options = {}) {
    const cookieOptions = [
      `${name}=${value}`,
      options.path ? `Path=${options.path}` : "Path=/",
      options.httpOnly ? "HttpOnly" : "",
      options.secure ? "Secure" : "",
      options.maxAge ? `Max-Age=${options.maxAge}` : "",
      options.expires ? `Expires=${options.expires.toUTCString()}` : "",
      options.sameSite ? `SameSite=${options.sameSite}` : "",
    ]
      .filter(Boolean)
      .join("; ");

    // Ensure the Set-Cookie header is an array
    let cookies = this.#res.getHeader("Set-Cookie") || [];
    if (typeof cookies === "string") {
      cookies = [cookies]; // Convert to array if it's a single string
    }
    cookies.push(cookieOptions); // Add the new cookie
    this.#res.setHeader("Set-Cookie", cookies); // Set the updated header
  }

  /**
   * Get a cookie from the request.
   * @param {string} name - The name of the cookie.
   * @returns {string|null} - The value of the cookie, or null if not found.
   */
  getCookie(name) {
    const cookies = this.#req.headers.cookie;

    if (cookies) {
      const cookiePairs = cookies
        .split(";")
        .map((cookie) => cookie.trim().split("="));
      const cookieObject = Object.fromEntries(cookiePairs);
      return cookieObject[name] || null;
    }

    return null;
  }

  /**
   * Delete a cookie in the response.
   * @param {string} name - The name of the cookie.
   * @param {object} options - Cookie options (e.g., path).
   */
  deleteCookie(name, options = {}) {
    this.setCookie(name, "", {
      ...options,
      expires: new Date(0), // Set expiration date to the past
    });
  }
}

module.exports = SessionManager;