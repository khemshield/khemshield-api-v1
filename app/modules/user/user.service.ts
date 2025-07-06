import { AppError } from "../../utils/errors";
import User, { AccountStatus } from "./user.model";
import { Types } from "mongoose";

export const getAllUsers = async () => {
  const user = await User.find().select("-password -mustChangePassword");
  if (!user) throw new AppError("User not found");

  return user;
};

// Deactivate (User-initiated: "I want to close my account")
export const deactivateAccount = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found");

  user.accountStatus = AccountStatus.Deactivated;

  await user.save();
  return user;
};

// Suspend (Admin-initiated)
export const suspendAccount = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found");

  user.accountStatus = AccountStatus.Suspended;
  await user.save();
  return user;
};

// Reactivate (Admin-initiated)
export const reactivateAccount = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found");

  user.accountStatus = AccountStatus.Active;
  await user.save();
  return user;
};

export const searchUsers = async (query: string, role: string, limit = 10) => {
  const regex = new RegExp(query, "i");

  const users = await User.find({
    roles: role,
    $or: [
      { firstName: regex },
      { lastName: regex },
      // { email: regex },
    ],
    accountStatus: "active",
  })
    .select("firstName lastName email roles")
    .limit(limit)
    .populate("instructorProfile", "avatar") // only select fields needed
    .populate("adminProfile")
    .populate("studentProfile");

  return users;
};
