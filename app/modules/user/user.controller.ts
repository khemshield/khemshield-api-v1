import { Request, Response } from "express";
import { Types } from "mongoose";
import { registerUser } from "../auth/auth.service";
import { UserRole } from "../user/user.model";
import { getAllUsers, getUserById, searchUsers } from "../user/user.service";
import { UserNotifier } from "./user.notifier";
import { AppError } from "../../utils/errors";
import { UserSchema } from "./user.schema";
import z from "zod";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user;
    if (!currentUser)
      return res.status(403).json({ message: "Authentication is required" });

    const isAdmin = currentUser.roles.includes(UserRole.Admin);
    if (!isAdmin)
      return res.status(403).json({ message: "Unauthorized to assign roles" });

    // Validate and transform incoming data
    const parsed = UserSchema.parse(req.body);

    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      state,
      city,
      postalCode,
      roles = [UserRole.Student],
    } = parsed;

    const address = {
      state: state?.trim() || undefined,
      city: city?.trim() || undefined,
      street: street?.trim() || undefined,
      postalCode: postalCode?.trim() || undefined,
      // country
    };

    const { user: newUser, studentIdCardNo } = await registerUser({
      firstName,
      lastName,
      email,
      mustChangePassword: true,
      phone,
      roles,
      address,
      createdBy: currentUser._id as Types.ObjectId,
    });

    await UserNotifier.sendWelcomeEmails({
      user: newUser,
      studentIdCardNo,
    });

    res.status(201).json({
      message: "User created. Relevant email(s) have been sent.",
      data: newUser,
    });
  } catch (err: any) {
    console.error("Create user error:", err);
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: err.errors });
    }

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    return res
      .status(500)
      .json({ message: err.message || "User creation failed" });
  }
};

export const searchUsersController = async (req: Request, res: Response) => {
  try {
    const { q = "", role } = req.query;

    if (!role || typeof role !== "string") {
      return res.status(400).json({ message: "Role is required" });
    }

    const trimmedQuery = (q as string).trim();
    if (!trimmedQuery) {
      return res.json([]); // return empty results for empty query
    }

    const users = await searchUsers(trimmedQuery, role);

    res.json({
      data: users,
    });
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message || "Search failed" });
  }
};

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.json({ data: users });
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message || "Search failed" });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  const userId = req.params.id;

  if (!userId)
    return res.status(400).json({ message: "Please provide user's id param" });

  try {
    const user = await getUserById(userId);
    return res.json({ data: user });
  } catch (error: any) {
    console.error("Search error:", error);
    res.status(500).json({ message: error.message || "Can not find user" });
  }
};
