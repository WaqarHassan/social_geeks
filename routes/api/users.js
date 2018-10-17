const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//Load User model
const User = require("../../models/User");
const passport = require("passport");
const ValidateRegisterInput = require('../../validation/register');
// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route  GET api/users/register
// @desc   Register users
// @access Public
router.post("/register", (req, res) => {

  const {errors , isValid } = ValidateRegisterInput(req.body)

    //Check Validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "300", //Size
        r: "pg", //Rating
        d: "r "
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route  GET api/users/login
// @desc   Login User / Return JWT Token
// @access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email: email }).then(user => {
    //ccheck for user
    if (!user) {
      return res.status(400).json({ email: "User not Found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        //creat jwt payload
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
        //res.json({ msg: "Success" });
      } else {
        return res.status(400).json({ password: "Password Incorrect" });
      }
    });
  });
});

// @route  GET api/users/current
// @desc   Return current user
// @access private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    });
  }
);

module.exports = router;
