const ProfileEntity = require("../entities/Profile");
const BirthdayObject = require("../valueObjects/BirthdayObject");

class UserAggregate {
    constructor(userId, firstName, lastName, email, yyyy, mm, dd) {
        this.profile = new ProfileEntity(userId, firstName, lastName, email);
        this.birthday = new BirthdayObject(yyyy, mm, dd);
    }

    updateEmail(newEmail) {
        this.profile.updateEmail(newEmail);
    }

    updateBirthday(yyyy, mm, dd) {
        this.birthday = new BirthdayObject(yyyy, mm, dd);
    }

    getUserDetails() {
        return {
            profile: this.profile,
            birthday: this.birthday,
        };
    }
}

module.exports = UserAggregate;