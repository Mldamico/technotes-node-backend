import mongoose from 'mongoose';


export interface User {
  username: string,
  password: string
  roles: UserRoles[]
  active: boolean
}

enum UserRoles {
  EMPLOYEE = "Employee", MANAGER = "Manager", ADMIN = "Admin"
}

const userSchema = new mongoose.Schema<User>({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{
    type: String,
    default: UserRoles.EMPLOYEE
  }],
  active: {
    type: Boolean,
    default: true
  }
})

const User = mongoose.model('User', userSchema)

export default User;