import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { getToken } from "../config";
import passport from "passport";
import nodemailer from "nodemailer";
import mailgun from "nodemailer-mailgun-transport";
// import auth from "../handler/nodemailer";

const authOpt = {
  api_key: "5d2b779a592468a413dd18999f9b8a8f-65b08458-5440a114",
  domain: "sandbox1a8d155d535c4551a634d605fb7b46b7.mailgun.org",
};
const router = express.Router();

router.post("/signin", async (req, res, next) => {
  passport.authenticate("local", function (err, signinUser, info) {
    if (err) {
      return next(err);
    }
    if (!signinUser.password) {
      return res.status(401).send({ msg: "Invalided Username or Password!!!" });
    }
    // check if is not a user
    if (!signinUser) {
      return res.status(401).send({ msg: "Username & Password combination doesn't match any of our records, Kindly register!!!" });
    }

    req.logIn(signinUser, function (err) {
      if (err) {
        return next(err);
      } else {
        return res.send({
          _id: signinUser.id,
          name: signinUser.name,
          email: signinUser.email,
          isAdmin: signinUser.isAdmin,
          token: getToken(signinUser),
        });
      }
    });
  })(req, res, next);
  // const signinUser = await User.findOne({
  //   email: req.body.email,
  // });
  // const password = req.body.password;

  // if (bcrypt.compareSync(password, signinUser.password) && signinUser) {
  //   res.send({
  //     _id: signinUser.id,
  //     name: signinUser.name,
  //     email: signinUser.email,
  //     isAdmin: signinUser.isAdmin,
  //     token: getToken(signinUser),
  //   });
  // } else {
  //   res.status(401).send({ msg: "Invalid Email or Password. " });
  // }
});

router.post("/register", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    audience: req.body.audience,
  });
  user.password = bcrypt.hashSync(req.body.password, 12);
  const newUser = await user.save();
  if (newUser) {
    res.send({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: getToken(newUser),
    });
  } else {
    res.status(401).send({ msg: "Invalid User Data. " });
  }
});

router.post("/contact", (req, res) => {
  const quoteDetail = `
    You have a Contact Us request.\n\n
    Client Details:\n 
    Name: ${req.body.name}\n
    Email: ${req.body.email}\n
    <u> Message: </u> \n ${req.body.message}\n
  `;

  const nodemailerMailgun = nodemailer.createTransport(mailgun({ auth: authOpt }));

  // mail detail
  nodemailerMailgun.sendMail(
    {
      from: "salesontws@gmail.com",
      to: "anajemiracle@gmail.com", // An array if you have multiple recipients.
      subject: "Contact Us Request",
      "h:Reply-To": "anajemiracle@gmail.com",
      //You can use "text:" to send plain-text content. It's oldschool!
      text: quoteDetail,
    },
    (err, info) => {
      if (err) {
        console.log(`Error: ${err}`);
        return res.status(401).send({ msg: "Error sending message request!!!" });
      } else {
        return res.status(200).send({ msg: "Request Sent!!!" });
      }
    }
  );
});
/* GET users listing. */
router.get("/createadmin", async (req, res, next) => {
  try {
    const user = new User({
      name: "miracle anaje",
      email: "anajemiracle@gmail.com",
      password: "1234",
      isAdmin: true,
    });

    user.password = bcrypt.hashSync(user.password, 12);

    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ msg: error.message });
  }
});

module.exports = router;
