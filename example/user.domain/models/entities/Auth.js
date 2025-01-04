const {BaseEntity} = require("hex-micro");

class Auth extends BaseEntity {
    constructor(userId, password) {
      super(
        {
          require: {
            userId: 'string',
            password: 'string',
          }
        },
        { userId, password }
      );
      this.userId = userId;
      this.password = password; // In a real app, this should be hashed
    }
  
    updatePassword(newPassword) {
      this.password = newPassword; // In a real app, hash the password
    }
  }
  
  module.exports = Auth;