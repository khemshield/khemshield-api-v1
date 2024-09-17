import { eventResolvers } from "./event";
import { contactResolvers } from "./contact";

const appResolvers = {
  ...eventResolvers,
  ...contactResolvers,
};

export default appResolvers;
