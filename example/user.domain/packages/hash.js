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
  return /^\$2[aby]\$\d+\$/.test(hash);
}
hash = {
  hashPassword,
  validatePassword,
  encrypt,
  decrypt,
  isValidHash,
}
module.exports = hash;