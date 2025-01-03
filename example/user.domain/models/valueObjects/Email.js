class Email {
    constructor(email) {
      if (!this.validate(email)) {
        throw new Error('Invalid email address: ' + email);
      }
      this.value = email;
    }
  
    validate(email) {
      if (typeof email !== 'string') {
        return false;
      }
      return true;
    }
  
    toString() {
      return this.value;
    }
  }
  
  module.exports = Email;