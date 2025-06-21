import { eventResolvers } from "../../modules/event/event.resolver";
import { contactResolvers } from "../../modules/contact/contact.resolver";
import { categoryResolvers } from "../../modules/category/category.resolver";

const appResolvers = {
  ...eventResolvers,
  ...contactResolvers,
  ...categoryResolvers,
};

export default appResolvers;
