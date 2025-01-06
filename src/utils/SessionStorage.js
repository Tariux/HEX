class SessionStorage {
    constructor(gc = false) {
        if (SessionStorage.instance) {
            return SessionStorage.instance;
        }
        this.sessions = new Map();
        this.expirationMap = new Map();
        this.cleanupInterval = 1000; // 1 minute
        this.isCleanupRunning = false;
        SessionStorage.instance = this;
        if (gc) {
            this.startCleanup();
        }
    }

    // Create or update a session
    add(sessionId, data, ttl = 3600) {
        const expiresAt = Date.now() + ttl * 1000;
        this.sessions.set(sessionId, { data, expiresAt });

        if (!this.expirationMap.has(expiresAt)) {
            this.expirationMap.set(expiresAt, new Set());
        }
        this.expirationMap.get(expiresAt).add(sessionId);
    }

    // Retrieve a session
    get(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        if (session.expiresAt < Date.now()) {
            this.drop(sessionId);
            return null;
        }

        return session.data;
    }

    // Delete a session
    drop(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            this.expirationMap.get(session.expiresAt).delete(sessionId);
            if (this.expirationMap.get(session.expiresAt).size === 0) {
                this.expirationMap.delete(session.expiresAt);
            }
            this.sessions.delete(sessionId);
        }
    }

    // Clean up expired sessions
    cleanupExpiredSessions() {
        let expiredCount = 0;
        const now = Date.now();
        const expirationTimes = Array.from(this.expirationMap.keys()).sort((a, b) => a - b);

        for (const expiresAt of expirationTimes) {
            if (expiresAt > now) break; // No need to check future expiration times

            const sessionIds = this.expirationMap.get(expiresAt);

            for (const sessionId of sessionIds) {
                expiredCount++;
                this.sessions.delete(sessionId);
            }
            this.expirationMap.delete(expiresAt);
        }
        console.log(`cleaning ${expiredCount} expired session`);

    }

    // Start the automated cleanup process
    startCleanup() {
        if (this.isCleanupRunning) return;
        this.isCleanupRunning = true;

        const cleanup = () => {
            setTimeout(() => {
                try {
                    this.cleanupExpiredSessions();
                } catch (e) {
                    console.error('Cleanup error:', e);
                }
                cleanup();
            }, this.cleanupInterval);
        };

        cleanup();
    }

    // Get all active sessions (for debugging or monitoring)
    getAll() {
        this.cleanupExpiredSessions(); // Clean up before returning
        return Array.from(this.sessions.entries()).map(([id, session]) => ({
            id,
            data: session.data,
            expiresAt: new Date(session.expiresAt).toISOString(),
        }));
    }
}

module.exports = new SessionStorage();