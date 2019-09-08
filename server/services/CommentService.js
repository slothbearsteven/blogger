import mongoose from "mongoose"
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const _model = new Schema({
  authorId: { type: ObjectId, ref: 'User', required: true },
  blogId: { type: ObjectId, ref: 'blog' },
  body: { type: String, required: true }
}, { timestamps: true })

export default class CommentService {
  get repository() {
    return mongoose.model('comment', _model)
  }
}
// {
//   blogId: "12fdsalkadsf12932dk",
//     body: "The Era of E-Sports",
//       author: { // How could this data get.... populated 
//     _id: "12lkj3lkj24ljhlkj23lj231klf",
//       name: "Jim Bob"
//   }
// }
// // timestamps: true