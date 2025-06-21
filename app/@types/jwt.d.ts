// types/jwt.d.ts (or anywhere reusable)
export interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId: string;
}
