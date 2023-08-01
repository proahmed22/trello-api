import express from 'express'
import * as taskController from './task.controller.js'
import { auth } from '../middleware/auth.js'

 const  taskRouter = express.Router()



 taskRouter.post('/addTask',auth,taskController.addTask )
 taskRouter.put('/updateTask/:taskId',auth,taskController.updateTask )
 taskRouter.delete('/deleteTask/:taskId',auth,taskController.deleteTask )
 taskRouter.get('/getAllTasks',taskController.getAllTasks )
 taskRouter.get("/getTasksOfOneUser/:assignTo", auth,taskController.getTasksOfOneUser);
 taskRouter.get("/allLateTasks", auth, taskController.allLateTasks);











 export  default taskRouter