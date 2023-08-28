/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../models");
require("dotenv").config();

const { User } = db;

const handleErrors = (err) => {
  const errors = {};
  if (err.message.includes("User validation failed")) {
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });
  }
  return errors;
};

const signUp = async (req, res) => {
  const { email, password, fullName } = req.body;
  try {
    const existingUsers = await User.find();
    const role = existingUsers.length === 0 ? "admin" : "user";
    const newUser = await User.create({
      email,
      password,
      fullName,
      role,
    });
    const accessToken = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET
    );
    res.status(200).json(accessToken);
  } catch (error) {
    console.log(error);
    const errors = handleErrors(error);
    res.status(500).json({ errors });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password.toString(),
      user.password.toString()
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email or password is incorrect" });
    }

    const accessToken = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
    res
      .status(200)
      .json({ id: user._id, fullName: user.fullName, accessToken });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  signUp,
  signIn,
};
