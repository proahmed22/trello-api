import express from 'express'
import mongoose from 'mongoose'
import { dbConnection } from './database/dbConnection.js'
import userRouter from './src/modules/user/user.router.js'
import taskRouter from './src/modules/task/task.router.js'
import dotenv from 'dotenv'
import { globalErrorHandling } from './src/utils/errorHandling.js'

const app = express()

dotenv.config()

app.use(express.json())
app.use('/user',userRouter)
app.use('/task',taskRouter)


app.use("*", (req, res, next) => {
    return res.json({ message: "Invalid Routing" });
  });

app.use(globalErrorHandling)

dbConnection()






app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))














