class UserRepository {
  constructor(db) {
    this.db = db;
  }

  // Create a new user
  async create(userAggregate) {
    const { profile, birthday } = userAggregate;
    const { userId, firstName, lastName, email } = profile;
    const { yyyy, mm, dd } = birthday;

    try {
      // Insert into users table
      await this.db.query(
        'INSERT INTO users (id, birthday_yyyy, birthday_mm, birthday_dd) VALUES (?, ?, ?, ?)',
        [userId, yyyy, mm, dd]
      );

      // Insert into profiles table
      await this.db.query(
        'INSERT INTO profiles (userId, firstName, lastName, email) VALUES (?, ?, ?, ?)',
        [userId, firstName, lastName, email]
      );

      console.log('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Fetch a user by ID
  async findById(userId) {
    try {
      const [user] = await this.db.query(
        `SELECT 
          users.id,
          users.birthday_yyyy,
          users.birthday_mm,
          users.birthday_dd,
          profiles.firstName,
          profiles.lastName,
        FROM users
        JOIN profiles ON users.id = profiles.userId
        WHERE users.id = ?`,
        [userId]
      );

      if (!user) return null;

      return {
        profile: {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        birthday: {
          yyyy: user.birthday_yyyy,
          mm: user.birthday_mm,
          dd: user.birthday_dd,
        },
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Fetch all users
  async getAll() {
    try {
      const users = await this.db.query(
        `SELECT *
        FROM users
        JOIN profiles ON users.id = profiles.userId`
      );

      return users.map((user) => ({
        profile: {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        birthday: {
          yyyy: user.birthday_yyyy,
          mm: user.birthday_mm,
          dd: user.birthday_dd,
        },
      }));
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  // Update a user
  async update(userAggregate) {
    const { profile, birthday } = userAggregate;
    const { userId, firstName, lastName, email } = profile;
    const { yyyy, mm, dd } = birthday;

    try {
      // Update users table
      await this.db.query(
        'UPDATE users SET birthday_yyyy = ?, birthday_mm = ?, birthday_dd = ? WHERE id = ?',
        [yyyy, mm, dd, userId]
      );

      // Update profiles table
      await this.db.query(
        'UPDATE profiles SET firstName = ?, lastName = ?, email = ? WHERE userId = ?',
        [firstName, lastName, email, userId]
      );

      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete a user
  async delete(userId) {
    try {
      await this.db.query('DELETE FROM users WHERE id = ?', [userId]);
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = UserRepository;