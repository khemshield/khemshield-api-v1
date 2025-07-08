export const PredefinedCourseType = `
  type PredefinedCourse {
    _id: String
    title: String!
    description: String
    category: String
    basePrice: Int
  }
`;

export const predefinedCourseQuery = `
  predefinedCourses: [PredefinedCourse]
`;
