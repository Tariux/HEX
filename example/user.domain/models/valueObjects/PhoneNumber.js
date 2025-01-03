class PhoneNumber {
    constructor(phoneNumber) {
      if (!this.validate(phoneNumber)) {
        throw new Error('Invalid phone number: ' + phoneNumber);
      }
      this.value = phoneNumber;
    }
  
    validate(phoneNumber) {
        if (typeof phoneNumber !== 'string') {
            return false;
        }
        return true;
    }
  
    toString() {
      return this.value;
    }
  }
  
  module.exports = PhoneNumber;