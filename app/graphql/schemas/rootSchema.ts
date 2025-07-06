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
import {
  predefinedCourseQuery,
  PredefinedCourseType,
} from "../../modules/predefined-courses/predefinedCourse.schema";
import { courseQuery, courseType } from "../../modules/course/course.schema";

const appSchema = buildSchema(`
    ${eventType}
    ${contactType}
    ${categoryType}
    ${PredefinedCourseType}
    ${courseType}
    
    type RootQuery {
      ${eventQueries}
      ${categoryQuery}
      ${predefinedCourseQuery}
      ${courseQuery}
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
