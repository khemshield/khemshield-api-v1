export const courseType = `
    # Enums
    enum CourseLevel {
        BEGINNER
        INTERMEDIATE
        BEGINNER_INTERMEDIATE
        ADVANCED
    }

    enum DurationUnit {
        DAY
        WEEK
        MONTH
    }

    enum CourseStatus {
        DRAFT
        PENDING_REVIEW
        PUBLISHED
        REJECTED
    }

    enum Visibility {
        PUBLIC
        PRIVATE
    }


    # Nested Types
    type LectureContent {
        video: String
        file: String
        description: String
    }

    type Lecture {
        name: String
        content: LectureContent
    }

    type CourseSection {
        name: String
        lectures: [Lecture]
    }

    type CourseCurriculum {
        sections: [CourseSection]
    }

    type CourseDuration {
        length: Int!
        unit: DurationUnit!
    }

    # Main Course Type
    type Course {
        _id: String!
        title: String!
        description: String
        category: String
        topic: String
        language: String
        level: CourseLevel
        duration: CourseDuration
        thumbnail: String
        trailer: String
        objectives: [String]
        targetAudience: [String]
        requirements: [String]
        curriculum: CourseCurriculum
        leadInstructor: String
        instructors: [String]
        slug: String
        version: Int
        discountPercentage: Int
        status: CourseStatus
        visibility: Visibility
        createdAt: String
        updatedAt: String
    }
`;

export const courseQuery = `

  courses: [Course]
  course(id: String!): Course

`;
