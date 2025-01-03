module.exports = [
`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    birthday_yyyy INTEGER NOT NULL,
    birthday_mm INTEGER NOT NULL,
    birthday_dd INTEGER NOT NULL,
    age INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);`
,
`CREATE TABLE IF NOT EXISTS profiles (
    userId TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phoneNumber TEXT NOT NULL UNIQUE,
    FOREIGN KEY (userId) REFERENCES users(id)
);`
,
`CREATE TABLE IF NOT EXISTS auth (
    userId TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);`
]