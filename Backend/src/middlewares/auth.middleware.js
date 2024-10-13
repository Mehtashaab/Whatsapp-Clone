import { User } from "../models/user.model.js";
import preventError from "../middlewares/preventError.middleware.js";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/errorHandler.js";

const isAuth = preventError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new errorHandler("Please login to access this resourse", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decodedData.id);
  next();
});

export {isAuth};