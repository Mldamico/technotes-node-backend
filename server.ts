import * as dotenv from 'dotenv'
dotenv.config()
import express, { Request, Response } from 'express'
import path from 'path'
import { errorHandler } from './middleware/errorHander'
import { logEvent, logger } from './middleware/logger'
import { router } from './routes/root'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { corsOptions } from './config/corsOptions'
import connectDB from './config/dbConn'
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes'

connectDB()

const app = express()
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


const PORT = process.env.PORT || 8080

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', router)

app.use('/users', userRoutes)

app.all('*', (req: Request, res: Response) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: "404 Not found" })
  } else {
    res.type("txt").send("404 Not Found")
  }
})

app.use(errorHandler)
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
  console.log(err)
  logEvent(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})



