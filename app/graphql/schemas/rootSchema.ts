import { buildSchema } from "graphql";
import { eventMutations, eventQueries, eventType } from "./events";

const appSchema = buildSchema(`
    ${eventType}
    
    type RootQuery {
        ${eventQueries}
    }

    type RootMutation {
        ${eventMutations}
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);

export default appSchema;
