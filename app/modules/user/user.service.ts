import User, { AccountStatus } from "./user.model";
import { Types } from "mongoose";

// Deactivate (User-initiated: "I want to close my account")
export const deactivateAccount = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.accountStatus = AccountStatus.Deactivated;

  await user.save();
  return user;
};

// Suspend (Admin-initiated)
export const suspendAccount = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.accountStatus = AccountStatus.Suspended;
  await user.save();
  return user;
};

// Reactivate (Admin-initiated)
export const reactivateAccount = async (userId: Types.ObjectId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.accountStatus = AccountStatus.Active;
  await user.save();
  return user;
};
