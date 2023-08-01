import express from 'express'
import  validation  from '../middleware/validation.js';
import { auth } from '../middleware/auth.js'
import * as userController from './controller/user.js'
import * as validators from './validationSchema.js'

const userRouter = express.Router()


userRouter.post('/signUp', validation(validators.signup),userController.signUp )
userRouter.post('/logIn', validation(validators.login),userController.logIn )
userRouter.patch('/changePassword', auth ,userController.changePassword )
userRouter.put('/updateUser', auth ,userController.updateProfile )
userRouter.delete('/deleteUser', auth ,userController.deleteUser )
userRouter.patch('/softDelete',auth, userController.softDelete)
userRouter.patch("/logOut",auth , userController.logOut);





export default userRouter