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
  const { email, password, fullName, country } = req.body;
  try {
    const existingUsers = await User.find();
    const role = existingUsers.length === 0 ? "admin" : "user";
    const newUser = await User.create({
      email,
      password,
      fullName,
      role,
      country
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
    const { email, password, rememberMe } = req.body;
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

    // Set token expiry based on the "rememberMe" option
    const tokenExpiry = rememberMe ? undefined : '2d'; // 2 days if not remembered

    const accessToken = jwt.sign(
      user.toJSON(),
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      accessToken,
      role: user.role,
      email: user.email,
      country:user.country||''
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Route to update user's fullName and/or password
const updateUser = async (req, res) => {
  const { oldPassword, newPassword, newFullName, newEmail, newCountry } =
    req.body;
  const userId = req.params.id;

  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Check if the new email already exists
    const emailExists = await User.exists({ email: newEmail });

    if (emailExists && user.email !== newEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Update info
    if (newFullName) user.fullName = newFullName;
    if (newCountry) user.country = newCountry;
    user.password = newPassword;
    user.email = newEmail;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signUp,
  signIn,
  updateUser,
};
