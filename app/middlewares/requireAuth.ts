import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../modules/user/user.model";
import { JwtPayloadWithUserId } from "../@types/jwt";

// Auth middleware to protect routes
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1] || req.cookies.accessToken;

    console.log("req.cookies.accessToken: ", req.cookies.accessToken);
    console.log("authHeader: ", authHeader);

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify and decode token
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_SECRET!
    ) as JwtPayloadWithUserId;

    if (!decoded?.userId) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(decoded.userId)
      .select("-password -__v")
      .lean();

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user; // Attach to request
    next();
  } catch (err: any) {
    console.error("Auth error:", err.message);
    return res
      .status(401)
      .json({ message: "Unauthorized", error: err.message });
  }
};
