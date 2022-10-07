import mongoose from 'mongoose';
import { User } from './User';
const AutoIncrement = require('mongoose-sequence')(mongoose)

interface Note {
  title: string
  user: User
  completed: boolean
  text: string

}


const noteSchema = new mongoose.Schema<Note>({
  title: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true
  }
)

noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: 'ticketNums',
  start_seq: 500
})

const Note = mongoose.model('Note', noteSchema)

export default Note;