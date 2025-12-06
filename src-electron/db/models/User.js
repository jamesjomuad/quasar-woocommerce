import { Model } from './Model.js'
import bcrypt from "bcrypt"

class User extends Model {
  constructor() {
    super('users')

    this.fillable = [
      'username',
      'first_name',
      'last_name',
      'phone',
      'email',
      'password'
    ]

    this.hidden = ['password']

    this.casts = {
      id: 'int',
      created_at: 'date',
    }
  }

  // Scopes
  activeUsers(q) {
    return q.where('active', 1)
  }

  // Events
  async beforeCreate(data) {
    data.password = await bcrypt.hash(data.password, 10)
    return data
  }

  // validPassword
  async validPassword(plaintextPassword, storedHash) {
    if (!storedHash) {
      return false;
    }
    try {
      // bcrypt.compare handles the salting/hashing of the plaintext
      // and compares it securely against the storedHash.
      return await bcrypt.compare(plaintextPassword, storedHash);
    } catch (error) {
      console.error("Bcrypt comparison failed:", error);
      return false;
    }
  }
}

export default new User()
