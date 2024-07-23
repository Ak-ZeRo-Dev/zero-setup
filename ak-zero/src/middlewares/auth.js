import { catchAsyncErrors } from "./catchAsyncErrors";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/ErrorHandler";
import { redis } from "../config/redis";
import { User } from "../models/usersModel";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return next(new ErrorHandler("Please login to access this page.", 401));

  const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

  if (!decoded) {
    return next(new ErrorHandler("Please login to access this page.", 401));
  }

  const user =
    (await redis.get(decoded._id)) || (await User.findById(decoded._id));

  if (!user) return next(new ErrorHandler("User not found.", 400));

  req.user = JSON.parse(user);
  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (
      !roles
        .map((role) => role.toLowerCase())
        .includes(req.user?.role.toLowerCase() || "")
    ) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource.`,
          400
        )
      );
    }
    next();
  };
};

export const isSameUser = catchAsyncErrors(async (req, res, next) => {
  const { id: userIdParams } = req.params;
  const { _id } = req.user;
  const { _id: userIdBody } = req.body;
  if (userIdParams) {
    if (_id === userIdParams) {
      return next(new ErrorHandler(`You can not access this resource.`, 400));
    }
  }
  if (userIdBody) {
    if (_id === userIdBody) {
      return next(new ErrorHandler(`You can not access this resource.`, 400));
    }
  }
  next();
});
