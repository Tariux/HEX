const AddressObject = require("../valueObjects/Address");

class UserEntity {
    constructor(userId, firstName, lastName, email) {
        this.userId = userId; 
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    updateEmail(newEmail) {
        this.email = newEmail;
    }

    getUserDetails() {
        return {
            userId: this.userId,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
        };
    }
}

module.exports = UserEntity;