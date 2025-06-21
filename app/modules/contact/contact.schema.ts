export const contactType = `
    
    type ContactType {
        _id: ID!
        email: String! 
        phone: String!
        fullName: String!
        helpwith: String!
        message: String!
    }

    input ContactInput {
        email: String! 
        phone: String!
        fullName: String!
        helpwith: String!
        message: String
    }
`;

export const contactMutations = `
    newContact(contactInput: ContactInput): ContactType
`;

export const contactQueries = `
    contacts: ContactType
`;
