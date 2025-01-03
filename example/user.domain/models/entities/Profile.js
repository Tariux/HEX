const Email = require("../valueObjects/Email");
const PhoneNumber = require("../valueObjects/PhoneNumber");

class Profile {
    constructor(userId, firstName, lastName, email, phoneNumber, age) {
      this.userId = userId;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = new Email(email); // Value Object
      this.phoneNumber = new PhoneNumber(phoneNumber); // Value Object
      this.age = age;
    }
  
    updateEmail(newEmail) {
      this.email = new Email(newEmail);
    }
  
    updatePhoneNumber(newPhoneNumber) {
      this.phoneNumber = new PhoneNumber(newPhoneNumber);
    }
  }
  
  module.exports = Profile;
  