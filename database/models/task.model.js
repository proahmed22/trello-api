import mongoose, { Schema } from 'mongoose'

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["toDo", "doing", "done"]
    },
    assignTo:{
      type:String,
      ref: 'user',

    },
    deadline:{
      type:String
    }
  },
  {
    timestamps: true,
  },
)

export const taskModel = mongoose.model('task', taskSchema)
