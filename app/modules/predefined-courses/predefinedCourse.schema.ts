export const PredefinedCourseType = `
  type PredefinedCourse {
    _id: String
    title: String!
    description: String
    category: String
  }
`;

export const predefinedCourseQuery = `
  predefinedCourses: [PredefinedCourse]
`;
