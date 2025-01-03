const { BaseEntity } = require("hex-micro");
const Email = require("../valueObjects/Email");
const PhoneNumber = require("../valueObjects/PhoneNumber");

class Profile extends BaseEntity {
  constructor(userId, firstName, lastName, email, phoneNumber, age) {
    super(
      {
        require: {
          userId: 'string',
          firstName: 'string',
          lastName: 'string',
          email: 'string',
          phoneNumber: 'string',
          age: 'string',
        }
      },
      { userId, firstName, lastName, email, phoneNumber, age }
    );
    this.validate();
    this.email = new Email(this.email); // Value Object
    this.phoneNumber = new PhoneNumber(this.phoneNumber); // Value Object
  }

  updateEmail(newEmail) {
    this.email = new Email(newEmail);
  }

  updatePhoneNumber(newPhoneNumber) {
    this.phoneNumber = new PhoneNumber(newPhoneNumber);
  }
}

module.exports = Profile;
