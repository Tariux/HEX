const { v4: uuidv4 } = require('uuid');
const SessionStorage = require('./SessionStorage');
const jwt = require('jsonwebtoken');
const { tools } = require('./ToolManager');

class SessionManager {
  #req;
  #res;
  #sessions;

  constructor(req, res) {
    this.#req = req;
    this.#res = res;
    this.#sessions = SessionStorage;
  }

  createSession(data, ttl = 3600, secure = false) {
    try {
      const sessionId = uuidv4();
      this.#sessions.add(sessionId, data, ttl);
      let token;
      if (secure) {
        const expirationTime = Math.floor(Date.now() / 1000) + ttl; // 1 hour from now
        token = jwt.sign(
          { data: sessionId, exp: expirationTime }, // Add `exp` manually
          process.env.SECRET_KEY
        );
        token = tools.hash.encrypt(token);
      } else {
        token = sessionId;
      }

      this.#setCookie("sessionId", token, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        // secure: true, // Uncomment if using HTTPS
      });
      return token;
    } catch (error) {
      console.log('create cookie error', error);
      return false;
    }
  }

  getSession(secure = false) {
    try {
      let sessionId = this.#getCookie("sessionId");
      if (secure) {
        if (!tools.hash.isValidHash(sessionId)) {
          return false;
        }
        sessionId = tools.hash.decrypt(sessionId);
        jwt.verify(sessionId, process.env.SECRET_KEY, (err, decoded) => {
          if (err) {
            console.error('Token verification failed:', err.message);
            return false;
          } else {
            sessionId = decoded.data;
          }
        });
      }
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