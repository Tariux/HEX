class UserRepository {
  constructor(db) {
    this.db = db;
  }

  async create(userAggregate) {
    const { profile, birthday, auth, metadata } = userAggregate;
    const { userId, firstName, lastName, email, phoneNumber, age } = profile;
    const { yyyy, mm, dd } = birthday;
    const { password } = auth;
    const { createdAt, updatedAt } = metadata;
    try {
      await this.db.query(
        'INSERT INTO users (id, birthday_yyyy, birthday_mm, birthday_dd, age, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, yyyy, mm, dd, age, createdAt, updatedAt]
      );

      await this.db.query(
        'INSERT INTO profiles (userId, firstName, lastName, email, phoneNumber) VALUES (?, ?, ?, ?, ?)',
        [userId, firstName, lastName, email.toString(), phoneNumber.toString()]
      );

      await this.db.query(
        'INSERT INTO auth (userId, password) VALUES (?, ?)',
        [userId, password]
      );

      console.log('User created successfully');
      return userId;
    } catch (error) {
      // console.error('Error creating user:', error);
      throw new Error('error while creating user');
    }
  }

  async findById(userId) {
    try {
      const [user] = await this.db.query(
        `SELECT 
          users.id,
          users.birthday_yyyy,
          users.birthday_mm,
          users.birthday_dd,
          users.age,
          users.createdAt,
          users.updatedAt,
          profiles.firstName,
          profiles.lastName,
          profiles.email,
          profiles.phoneNumber,
          auth.password
        FROM users
        JOIN profiles ON users.id = profiles.userId
        JOIN auth ON users.id = auth.userId
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
          phoneNumber: user.phoneNumber,
          age: user.age,
        },
        birthday: {
          yyyy: user.birthday_yyyy,
          mm: user.birthday_mm,
          dd: user.birthday_dd,
        },
        auth: {
          password: user.password,
        },
        metadata: {
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async getAll() {
    try {
      const users = await this.db.query(
        `SELECT *
        FROM users
        JOIN profiles ON users.id = profiles.userId
        JOIN auth ON users.id = auth.userId`
      );

      return users.map((user) => ({
        profile: {
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          age: user.age,
        },
        birthday: {
          yyyy: user.birthday_yyyy,
          mm: user.birthday_mm,
          dd: user.birthday_dd,
        },
        auth: {
          password: user.password,
        },
        metadata: {
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      }));
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async update(userAggregate) {
    const { profile, birthday, auth, metadata } = userAggregate;
    const { userId, firstName, lastName, email, phoneNumber, age } = profile;
    const { yyyy, mm, dd } = birthday;
    const { password } = auth;
    const { updatedAt } = metadata;

    try {
      await this.db.query(
        'UPDATE users SET birthday_yyyy = ?, birthday_mm = ?, birthday_dd = ?, age = ?, updatedAt = ? WHERE id = ?',
        [yyyy, mm, dd, age, updatedAt, userId]
      );

      await this.db.query(
        'UPDATE profiles SET firstName = ?, lastName = ?, email = ?, phoneNumber = ? WHERE userId = ?',
        [firstName, lastName, email, phoneNumber, userId]
      );

      await this.db.query(
        'UPDATE auth SET password = ? WHERE userId = ?',
        [password, userId]
      );

      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async delete(userId) {
    try {
      await this.db.query('DELETE FROM users WHERE id = ?', [userId]);
      await this.db.query('DELETE FROM profiles WHERE userId = ?', [userId]);
      await this.db.query('DELETE FROM auth WHERE userId = ?', [userId]);
      console.log('User deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = UserRepository;