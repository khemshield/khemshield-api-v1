export const API_VERSION = "/api/v1";

export const APP_NAME = process.env.APP_NAME!;
export const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL!;

export const isProduction =
  process.env.NODE_ENV === "production" ? true : false;
