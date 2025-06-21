import { buildSchema } from "graphql";
import {
  eventMutations,
  eventQueries,
  eventType,
} from "../../modules/event/event.schema";
import {
  contactMutations,
  contactType,
} from "../../modules/contact/contact.schema";
import {
  categoryType,
  categoryMutation,
  categoryQuery,
} from "../../modules/category/category.schema";

const appSchema = buildSchema(`
    ${eventType}
    ${contactType}
    ${categoryType}

    type RootQuery {
        ${eventQueries}
        ${categoryQuery}
    }

    type RootMutation {
        ${eventMutations}
        ${contactMutations}
        ${categoryMutation}
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

export default appSchema;
