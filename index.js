import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/user.js";

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// every route inside of the postRoutes is starting with /posts
app.use("/posts", postRoutes);

app.use("/user", userRoutes);

// https://ui.dev/react-router-cannot-get-url-refresh#catch-all
app.get("*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../client/public/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

// use cloud atlas version of mongoDB

// const CONNECTION_URL = ;
const PORT = process.env.PORT || 5000;

// second parameter is an object with all the options
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))
  )
  .catch((err) => console.log(err.message));
