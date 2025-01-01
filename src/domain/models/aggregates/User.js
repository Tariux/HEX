const UserEntity = require("../entities/User");
const AddressObject = require("../valueObjects/Address");

class UserAggregate {
    constructor(userId, firstName, lastName, email, street, city, zipCode) {
        this.user = new UserEntity(userId, firstName, lastName, email);
        this.address = new AddressObject(street, city, zipCode);
    }

    updateEmail(newEmail) {
        this.user.updateEmail(newEmail);
    }

    updateAddress(newStreet, newCity, newZipCode) {
        this.address = new AddressObject(newStreet, newCity, newZipCode);
    }

    getUserDetails() {
        return {
            user: this.user,
            address: this.address,
        };
    }
}

module.exports = UserAggregate;