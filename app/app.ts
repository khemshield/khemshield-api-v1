import dotenv from "dotenv";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { GraphQLFormattedError } from "graphql";
import connectDB from "./db";
import { CustomError } from "./graphql/errors";
import appResolvers from "./graphql/resolvers/rootResolver";
import appSchema from "./graphql/schemas/rootSchema";
import cors from "cors";

const app = express();

// Load Env
dotenv.config();

// DB CONNECTION
connectDB();

// Use CORS to allow requests from frontend
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests only from this origin
    credentials: true, // Include credentials if needed (for cookies, etc.)
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: appSchema,
    rootValue: appResolvers,
    graphiql: true,
    customFormatErrorFn(error): GraphQLFormattedError {
      const originalError = error.originalError as CustomError;

      if (!originalError) {
        // Returning the default GraphQL error structure if no original error
        return error;
      }

      if (!originalError.errorInfo) throw error;

      // Custom error formatting
      return {
        message: error.message,
        extensions: {
          status: originalError.errorInfo.code || 500, // Include the code from the custom error
        },
      };
    },
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}`);
});
