const AddressObject = require("../valueObjects/Address");

class UserEntity {
    constructor(userId, firstName, lastName, email, street, city, zipCode) {
        this.userId = userId; 
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.address = new AddressObject(street, city, zipCode); 
    }

    updateAddress(newStreet, newCity, newZipCode) {
        this.address = new Address(newStreet, newCity, newZipCode);
    }

    getUserDetails() {
        return {
            userId: this.userId,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            address: this.address.toString(),
        };
    }
}

module.exports = UserEntity;