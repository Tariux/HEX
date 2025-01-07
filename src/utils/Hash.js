const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.SECRET_KEY || 'MEOWMEOW'; 

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function validatePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

function encrypt(data) {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

function decrypt(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
function isValidHash(hash) {
  // CryptoJS-encrypted strings are typically Base64-encoded
  // and start with "U2FsdGVkX1" (which is the Base64 encoding of "Salted__")
  return typeof hash === 'string' && hash.startsWith('U2FsdGVkX1');
}

hash = {
  hashPassword,
  validatePassword,
  encrypt,
  decrypt,
  isValidHash,
}
module.exports = hash;