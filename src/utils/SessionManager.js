const { v4: uuidv4 } = require('uuid');
const SessionStorage = require('./SessionStorage');

class SessionManager {
  #req;
  #res;
  #sessions;

  constructor(req, res) {
    this.#req = req;
    this.#res = res;
    this.#sessions = SessionStorage;
  }

  createSession(data, ttl = 3600) {
    try {
      const sessionId = uuidv4();
      this.#sessions.add(sessionId, data, ttl);

      this.#setCookie("sessionId", sessionId, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        // secure: true, // Uncomment if using HTTPS
      });
      return sessionId;
    } catch (error) {
      console.log('create cookie error', error);
      return false;
    }
  }

  getSession() {
    try {
      const sessionId = this.#getCookie("sessionId");
      if (sessionId) {
        const data = this.#sessions.get(sessionId) || null;
        return { sessionId, data };
      }
    } catch (error) {
      console.log('get cookie error', error);
      return false;
    }
  }

  destroySession(sessionId) {
    try {
      if (this.#sessions.has(sessionId)) {
        this.#sessions.drop(sessionId);
        this.#deleteCookie("sessionId", { path: '/' });
        return true;
      }
    } catch (error) {
      console.log('destroy cookie error', error);
      return false;
    }
  }

  #setCookie(name, value, options = {}) {
    try {
      let cookieString = `${name}=${value}`;
      if (options.path) cookieString += `; Path=${options.path}`;
      if (options.httpOnly) cookieString += `; HttpOnly`;
      if (options.secure) cookieString += `; Secure`;
      if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
      if (options.expires) cookieString += `; Expires=${options.expires.toUTCString()}`;
      if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;
      this.#res.setHeader('Set-Cookie', cookieString);
      return true;
    } catch (error) {
      console.log('set cookie error', error);
      return false;
    }
  }

  #getCookie(name) {
    const cookies = this.#req.headers.cookie;
    if (!cookies) {
      console.log('No cookies found in request headers');
      return null;
    }
    const cookiePairs = cookies.split('; ').map(pair => pair.split('='));
    const cookieObject = Object.fromEntries(cookiePairs);
    return cookieObject[name] || null;
  }

  #deleteCookie(name, options = {}) {
    this.#setCookie(name, "", { ...options, expires: new Date(0) });
  }
}

module.exports = SessionManager;