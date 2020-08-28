import express from "express";
import data from "./data";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import bodyParser from "body-parser";
import passport from "passport";

const port = 4000;

// .env setup
require("dotenv").config();

require("./models/User");
require("./models/Products");
require("./models/Order");

// mongoDb setup
mongoose.set("useCreateIndex", true);
mongoose
  .connect(process.env.Database || "mongodb://localhost/react-shooping-cart", { useNewUrlParser: true, autoReconnect: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// passport
require("./handler/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
