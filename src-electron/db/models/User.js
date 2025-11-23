import { BaseModel } from '../BaseModel.js'

class User extends BaseModel {
  constructor() {
    super('users')

    this.fillable = ['name', 'email', 'password']
    this.hidden = ['password']
    this.casts = {
      id: 'int',
      created_at: 'date',
    }
  }

  // custom scope
  activeUsers(q) {
    return q.where('active', 1)
  }

  // Relationship example
  // posts() {
  //   return this.hasMany(Post, 'user_id')
  // }

  // Events example
  async beforeCreate(data) {
    data.password = `hashed(${data.password})`
  }
}

// export const UserModel = new User()
export default User
