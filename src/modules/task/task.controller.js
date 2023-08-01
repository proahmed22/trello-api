import { userModel } from "../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { taskModel } from './../../../database/models/task.model.js';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from "../../utils/errorHandling.js";


//* 1-add task with status (toDo)(user must be logged in)

const addTask = asyncHandler( async (req, res, next) => {
  
        const { title, description, deadline, assignTo } = req.body;
        const currentDate = new Date()
        const deadlineDate = new Date(deadline);

        if (deadlineDate < currentDate) {
            return next (new Error ('Enter a Valid Date' ))
        }
        const user = await userModel.findById(assignTo)

        if (!user) {
            return next(new Error ("The User doesn't exists "))
        }

        const task = await taskModel.create({ title, description, deadline, assignTo, user_id: req.user.id });
        return res.json({ message: "Task Assigned Successfully", task });
})


//* 2-update task (title , description , status) and assign task to other user(user must be logged in) (creator only can update task)

const updateTask = asyncHandler( async (req, res, next) => {
  const { title, description, status, assignTo } = req.body;
  const { taskId } = req.params;

  const task = await taskModel.findById(taskId);

  if (!task) {
    return next(new Error("Task Not Found", { cause: StatusCodes.NOT_FOUND }));
  }

  const taskCheck = await userModel.findById(assignTo);

  if (!taskCheck) {
    return next(
      new Error("The user you want to assign this task to not exists", {
        cause: StatusCodes.NOT_FOUND,
      })
    );
  }

  await taskModel.findByIdAndUpdate({ _id: taskId }, req.body);

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ message: "Task Updated Successfully" });
})


//* 3- delete task(user must be logged in) (creator only can delete task)



 const deleteTask = asyncHandler( async (req, res, next) => {

    const { taskId } = req.params;

    const task = await taskModel.findById(taskId);
  
    if (!task) {
      return next(new Error("Task not found"), { cause: 404 });
    }

    if (task.user_id.toString() !== req.user._id.toString()) {
      return next(new Error("You are not authorized to delete this task"), {
        cause: 403,
      });
    }  

    const deleteUser = await taskModel.findByIdAndRemove(taskId);

    return res.json({ message: "user deleted successfully!", deleteUser });


})


//* 4-get all tasks with user data

const getAllTasks = asyncHandler( async(req, res) => {
 
      const tasks = await taskModel.find().populate(
          {
              path: 'assignTo',
              select: 'userName email _id'
          }
      )
      res.json({'success': tasks})

      return next(new Error("Error"));
})

//* 5-get tasks of oneUser with user data (user must be logged in)


const getTasksOfOneUser = asyncHandler( async (req, res, next) => {
  const { assignTo } = req.params;
  console.log({ assignTo });

  const employee = await userModel.findById(assignTo);

  if (!employee) {
    console.log("false");
    return next(
      new Error("Employee Not Found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  const tasks = await taskModel.find({ assignTo }).populate({
    path: "assignTo",
    select: "userName email",
  });

  if (!tasks.length) {
    return next(
      new Error("There is no assigned tasks to this employee", {
        cause: StatusCodes.NOT_FOUND,
      })
    );
  }

  return res.json({
    message: `All assigned tasks to ${tasks[0]?.assignTo?.userName}`,
    tasks,
  });
})


//* 6-get all tasks that not done after deadline

const allLateTasks = asyncHandler( async (req, res, next) => {
  const currentDate = new Date();

  const allTasks = await taskModel.find({ assignTo: req.user._id }).populate({
    path: "assignTo",
    select: "userName email",
  });

  if (!addTask) {
    return next(
      new Error("There is no assigned tasks to this user", {
        cause: StatusCodes.NOT_FOUND,
      })
    );
  }

  const lateTasks = allTasks.filter((task) => {
    return new Date(task.deadline) < currentDate;
  });


  return res.json({ message: "All Late assigned tasks to you", lateTasks });
})


export {
    addTask,
    updateTask,
    deleteTask,
    getAllTasks,
    getTasksOfOneUser,
    allLateTasks
}