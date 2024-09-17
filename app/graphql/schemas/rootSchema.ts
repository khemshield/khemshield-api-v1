import { buildSchema } from "graphql";
import { eventMutations, eventQueries, eventType } from "./events";
import { contactMutations, contactQueries, contactType } from "./contact";

const appSchema = buildSchema(`
    ${eventType}
    ${contactType}

    type RootQuery {
        ${eventQueries}
        
    }

    type RootMutation {
        ${eventMutations}
        ${contactMutations}
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

export default appSchema;
