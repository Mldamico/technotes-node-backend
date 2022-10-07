import express from 'express'
const router = express.Router()
import { createNewUser, deleteUser, getAllUsers, updateUser } from '../controllers/usersController'

router.route('/').get(getAllUsers).post(createNewUser).patch(updateUser).delete(deleteUser)

export default router