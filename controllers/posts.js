import express from "express";
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

// const router = express.Router();

// 'await' expressions are only allowed within async functions
export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    // get the starting index of every page

    const total = await PostMessage.countDocuments({});

    // add await since find method takes time to process data , its an asynchronous action
    const posts = await PostMessage.find()
      .sort({ _id: -1 }) //gives newest post first
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// QUERY -> /posts?page=1 -> page=1 ********************************
// PARAMS -> /posts/:id -> id=123   ********************************
export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    // console.log(searchQuery + "+");
    // removing exptra spaces from search query
    let result = searchQuery.replace(/^\s+|\s+$/gm, "");

    const title = new RegExp(result, "i");
    // converting title to regular expression

    // console.log(result + "+");
    // Test, test, TEST -> same, i stands for ignore case
    // makes it easier for mongoose to search the database

    // console.log(title);

    const posts = await PostMessage.find({
      // either find the title or the tags
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();

    // www.restapitutorial.com/httpstatuscodes.html
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  try {
    const updatedPost = {
      creator,
      title,
      message,
      tags,
      selectedFile,
      _id: id,
    };

    await PostMessage.findByIdAndUpdate(
      id,
      // all properties of post + _id
      updatedPost,
      {
        // added to receive updated version of the post
        new: true,
      }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json("No post with that id");

  try {
    // console.log(`controller delete ${id}`);
    await PostMessage.findByIdAndRemove(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  // each user will have an id stored in the post they liked
  const index = post.likes.findIndex((id) => id === String(req.userId));

  // only if a users id is not in likes array in the post , index = -1, property of findIndex
  if (index === -1) {
    // like a post , add the user id into the array
    post.likes.push(req.userId);
  } else {
    // remove the like , delete the user id from the array
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  // getting post from database
  const post = await PostMessage.findById(id);

  // adding comments to the post
  post.comments.push(value);

  // updating the database
  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};
