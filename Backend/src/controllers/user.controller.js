import preventError from "../middlewares/preventError.middleware.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/sendToken.util.js";

const registerUser = preventError(async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  const checkEmail = await User.findOne({ email });

  if (checkEmail) {
    return res.status(400).json({
      message: "User already exists",
      error: true,
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: hashPassword,
    profilePic,
  });

  const userSave = await user.save();

  return res.status(201).json({
    message: "user created successfully",
    user: userSave,
    success: true,
  });
});

// login
const loginUser = preventError(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "user not exist",
      error: true,
    });
  }

  const verifyPassword = await bcrypt.compare(password, user.password);

  if (!verifyPassword) {
    return res.status(400).json({
      message: "wrong password",
      error: true,
    });
  }

  sendToken(user, 200, res);
});

// logout
const logoutUser = preventError(async (req, res) => {
  const cookieOptions = {
    http: true,
    secure: true,
    samesite: "None",
  };

  return res.cookie("token", "", cookieOptions).status(200).json({
    message: "logout successfully",
    succes: true,
  });
});

// user details
const userDetails = preventError(async (req, res) => {
  return res.status(200).json({
    message: "user details",
    user: req.user,
  });
});

// update user
const updateUser = preventError(async (req, res) => {
  const { userId, name, profilePic } = req.body;

  const updateuser = await User.updateOne(
    { _id: userId },
    { name, profilePic }
  );
  console.log(updateuser, "updateuser");

  if (updateuser?.modifiedCount == 1) {
    const user = await User.findById(userId);

    return res.status(200).json({
      message: "user udpated successfully",
      user,
      success: true,
    });
  } else {
    return res.status(400).json({
      message: "user not udpated",
      error: true,
    });
  }
});

// search user
const searchUser = preventError(async (req, res) => {
  const { search } = req.body;

  const query = new RegExp(search, "i", "g");
  const users = await User.find({
    $or: [{ name: query }, { email: query }],
  }).select("-password");
  console.log(users, "users");

  return res.status(200).json({
    message: "all users",
    users,
    success: true,
  });
});

export {registerUser,loginUser,logoutUser,userDetails,updateUser,searchUser};