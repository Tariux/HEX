const { BaseEntity } = require("hex-micro");
const Email = require("../valueObjects/Email");
const PhoneNumber = require("../valueObjects/PhoneNumber");

class Profile extends BaseEntity {
  constructor(userId, firstName, lastName, email, phoneNumber) {
    super(
      {
        require: {
          userId: 'string',
          firstName: 'string',
          lastName: 'string',
          email: 'string',
          phoneNumber: 'string',
        }
      },
      { userId, firstName, lastName, email, phoneNumber }
    );
    this.validate();
    this.email = new Email(this.email).toString(); // Value Object
    this.phoneNumber = new PhoneNumber(this.phoneNumber).toString(); // Value Object
  }

  updateEmail(newEmail) {
    this.email = new Email(newEmail);
  }

  updatePhoneNumber(newPhoneNumber) {
    this.phoneNumber = new PhoneNumber(newPhoneNumber);
  }
}

module.exports = Profile;
