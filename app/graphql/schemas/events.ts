export const eventType = `
    type EventType {    
        _id: ID!
        title: String!
        description: String!
    }
    
    type EventRegistrationType {
        email: String!
        phone: String!
        firstName: String!
        lastName: String!
    }
    
    input EventRegistrationInput {
        event: ID!
        email: String!
        phone: String!
        firstName: String!
        lastName: String!
        address: String
    }
`;

export const eventQueries = `
    events: EventType
`;

export const eventMutations = `
    eventRegister(regData: EventRegistrationInput): EventRegistrationType
`;
