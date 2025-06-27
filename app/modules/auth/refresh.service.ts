import { Types } from "mongoose";
import RefreshToken from "./refresh-token.model";

export const saveRefreshToken = async ({
  userId,
  token,
}: {
  userId: Types.ObjectId;
  token: string;
}) => {
  const tokenDoc = new RefreshToken({
    user: userId,
    token: token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await tokenDoc.save();
};

export const deleteRefreshToken = async (refreshToken: string) => {
  // Remove refresh token from DB
  await RefreshToken.deleteOne({ token: refreshToken });
};
