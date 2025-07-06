export const categoryType = `
  type Category {
    _id: ID!
    name: String!
    description: String
    createdAt: String
  }

  input CreateCategoryInput {
    name: String!
    description: String
  }
`;

export const categoryQuery = `
  categories: [Category]
  getCategory(id: ID!): Category
`;

export const categoryMutation = `
  createCategory(input: CreateCategoryInput!): Category
  deleteCategory(id: ID!): Boolean
`;
