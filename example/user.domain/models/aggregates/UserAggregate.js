const { _PACKAGES } = require("hex-micro");
const Auth = require("../entities/Auth");
const Profile = require("../entities/Profile");
const Birthday = require("../valueObjects/Birthday");

class UserAggregate {
  constructor(userId, profile, birthday, auth, metadata) {
    this.userId = userId;
    this.profile = profile; // Entity
    this.birthday = birthday; // Value Object
    this.auth = auth; // Entity
    this.metadata = metadata; // Value Object (e.g., createdAt, updatedAt)
  }

  // Factory method to create a new user
  static async create(data) {
    let hashedPassword;
    try {
      const hashPackage = _PACKAGES.getPackage('hash-package');
      hashedPassword = await hashPackage.hashPassword(data.password);
    } catch (error) {
      console.log('Error while hashing password for: ', data.userId);
      console.log(error);
    }
    const profile = new Profile(data.userId, data.firstName, data.lastName, data.email, data.phoneNumber, data.age);
    const birthday = new Birthday(data.yyyy, data.mm, data.dd);
    const auth = new Auth(data.userId, hashedPassword || data.password);
    const metadata = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return new UserAggregate(data.userId, profile, birthday, auth, metadata);
  }

  // Update user profile
  updateProfile(firstName, lastName, email, phoneNumber, age) {
    this.profile.firstName = firstName;
    this.profile.lastName = lastName;
    this.profile.updateEmail(email);
    this.profile.updatePhoneNumber(phoneNumber);
    this.profile.age = age;
    this.metadata.updatedAt = new Date().toISOString();
  }

  // Update birthday
  updateBirthday(yyyy, mm, dd) {
    this.birthday = new Birthday(yyyy, mm, dd);
    this.metadata.updatedAt = new Date().toISOString();
  }

  // Update password
  updatePassword(newPassword) {
    this.auth.updatePassword(newPassword);
    this.metadata.updatedAt = new Date().toISOString();
  }
}

module.exports = UserAggregate;