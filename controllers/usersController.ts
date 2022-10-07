import Note from "../models/Note";
import User from "../models/User";
import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'
import { Request, Response } from "express";

export const getAllUsers = asyncHandler(async (_: Request, res: Response) => {

  const users = await User.find().select('-password').lean()
  if (!users?.length) {
    res.status(400).json({ message: "No users found" })
    return;
  }
  res.json(users)

});

export const createNewUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, roles } = req.body
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({ message: "All fields are required" })
    return;
  }
  const duplicate = await User.findOne({ username }).lean().exec()
  if (duplicate) {
    res.status(409).json({ message: 'Duplicate username' })
  }
  const hashedPwd = await bcrypt.hash(password, 10)

  const user = await User.create({ username, password: hashedPwd, roles })
  if (user) {
    res.status(201).json({ message: `New user ${username} created` })
  } else {
    res.status(400).json({ message: "Invalid user data received!" })
  }
});


export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id, username, roles, active, password } = req.body

  if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    res.status(400).json({ message: "All fields are required" })
    return
  }
  const user = await User.findById(id).exec()

  if (!user) {
    res.status(400).json({ message: "User not found" })
    return;
  }

  const duplicate = await User.findOne({ username }).lean().exec()
  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(409).json({ message: "Duplicate username" })
  }

  user.username = username
  user.roles = roles
  user.active = active

  if (password) {
    user.password = await bcrypt.hash(password, 10)
  }
  const updatedUser = await user.save()
  res.json({ message: `${updatedUser.username} updated` })


});


export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "User ID Required" })
  }

  const note = await Note.findOne({ user: id }).lean().exec()

  if (note) {
    res.status(400).json({ message: "User has assigned noted" })
    return
  }
  const user = await User.findById(id).exec()
  if (!user) {
    res.status(400).json({ message: "User not found" })
    return
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`

  res.json(reply)

});