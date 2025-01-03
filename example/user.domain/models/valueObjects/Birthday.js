class Birthday {
    constructor(yyyy, mm, dd) {
      this.yyyy = yyyy;
      this.mm = mm;
      this.dd = dd;
    }
  
    // Optional: Add validation for the birthday
    isValid() {
      const date = new Date(this.yyyy, this.mm - 1, this.dd);
      return (
        date.getFullYear() === this.yyyy &&
        date.getMonth() + 1 === this.mm &&
        date.getDate() === this.dd
      );
    }
  }
  
  module.exports = Birthday;