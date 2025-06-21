import rateLimit from "express-rate-limit";

export const graphqlRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // allow only 20 requests per minute per IP
  message: "Too many GraphQL requests. Please slow down.",
});
