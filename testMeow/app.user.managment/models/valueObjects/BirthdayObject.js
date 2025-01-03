class BirthdayObject {
    constructor(yyyy, mm, dd) {
        this.yyyy = yyyy;
        this.mm = mm;
        this.dd = dd;
    }

    equals(otherBirthday) {
        return (
            this.yyyy === otherBirthday.yyyy &&
            this.mm === otherBirthday.mm &&
            this.dd === otherBirthday.dd
        );
    }
}

module.exports = BirthdayObject;