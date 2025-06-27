import dotenv from "dotenv";
// Load Env
dotenv.config();

import express from "express";
import { graphqlHTTP } from "express-graphql";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Customs
import connectDB from "./config/db";
import appResolvers from "./graphql/resolvers/rootResolver";
import appSchema from "./graphql/schemas/rootSchema";
import { customFormatErrorFn } from "./middlewares/errorFormatter";
import { apiRateLimiter } from "./middlewares/rateLimiter";
import { graphqlRateLimiter } from "./middlewares/graphqlRateLimiter";
import { API_VERSION } from "./config/contants";
import corsMiddleware from "./config/cor.config";

// Routes
import categoryRoutes from "./modules/category/category.routes";
import storageRoutes from "./modules/storage/storage.routes";
import courseRoutes from "./modules/course/course.routes";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";

const app = express();

// DB CONNECTION
connectDB();

app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use(`${API_VERSION}/api`, apiRateLimiter); // Apply to all /api routes
app.use(`${API_VERSION}/storage`, storageRoutes);
app.use(`${API_VERSION}/categories`, categoryRoutes);
app.use(`${API_VERSION}/courses`, courseRoutes);
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/users`, userRoutes);

app.use(
  `${API_VERSION}/graphql`,
  graphqlRateLimiter,
  graphqlHTTP({
    schema: appSchema,
    rootValue: appResolvers,
    graphiql: true,
    customFormatErrorFn,
  })
);

export default app;
