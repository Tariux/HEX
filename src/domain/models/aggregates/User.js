const User = require("./entities/User");
const Address = require("./valueObjects/Address");

class UserAggregate {
    constructor(userId, firstName, lastName, email, street, city, zipCode) {
        this.user = new User(userId, firstName, lastName, email);
        this.address = new Address(street, city, zipCode);
    }

    updateEmail(newEmail) {
        this.user.updateEmail(newEmail);
    }

    updateAddress(newStreet, newCity, newZipCode) {
        this.address = new Address(newStreet, newCity, newZipCode);
    }

    getUserDetails() {
        return {
            user: this.user,
            address: this.address,
        };
    }
}

module.exports = UserAggregate;