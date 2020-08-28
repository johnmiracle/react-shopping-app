import User from "../models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const localStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { msg: "This email is not registered" });
        }

        if (bcrypt.compareSync(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, {
            msg: "The password doesn't match the one on our records",
          });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
