class AddressObject {
    constructor(street, city, zipCode) {
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
    }

    equals(otherAddress) {
        return (
            this.street === otherAddress.street &&
            this.city === otherAddress.city &&
            this.zipCode === otherAddress.zipCode
        );
    }
}

module.exports = AddressObject;