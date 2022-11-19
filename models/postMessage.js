import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  name: String,
  creator: String,
  tags: [String],
  //   convert image into a string using base64
  selectedFile: String,
  comments: { type: [String], default: [] },
  // adds user id each time like button is clicked
  likes: { type: [String], default: [] },
  createdAt: { type: Date, default: new Date() },
});

// creating a model with the schema named postSchema
const PostMessage = mongoose.model("PostMessage", postSchema);

// on this model we will be able to run commands such as find , create , delete and update
export default PostMessage;
