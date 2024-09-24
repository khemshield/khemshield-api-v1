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

    type MessageType {
        message: String!
    }
    
    input EventRegistrationInput {
        event: ID!
        email: String!
        phone: String!
        firstName: String!
        lastName: String!
        state: String!
        address: String!
    }
`;

export const eventQueries = `
    events: EventType
    sendEmailToSubcribers(emailString: String!): MessageType
`;

export const eventMutations = `
    eventRegister(regData: EventRegistrationInput): EventRegistrationType
`;
