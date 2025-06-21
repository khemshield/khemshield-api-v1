import { GraphQLFormattedError } from "graphql";
import { CustomError } from "../utils/errors";

export const customFormatErrorFn = (error: any): GraphQLFormattedError => {
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
};
