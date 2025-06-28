import { APP_NAME } from "../../../config/contants";

export const generateCourseCreatedEmailHTMLTemp = ({
  courseTitle,
  topic,
  category,
  thumbnail,
  createdAt,
  courseLink,
  userName,
}: {
  courseTitle: string;
  topic: string;
  category: string;
  thumbnail?: string;
  createdAt: string;
  courseLink?: string;
  userName?: string;
}) => {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 8px;">
    <h2 style="color: #333;">Hello ${userName || "Instructor"},</h2>
    <p style="color: #555;">
      Your course <strong>${courseTitle}</strong> has been successfully created on <strong>${new Date(
    createdAt
  ).toLocaleDateString()}</strong>.
    </p>

    ${
      thumbnail
        ? `<img src="${thumbnail}" alt="Course Thumbnail" style="width: 100%; max-width: 500px; border-radius: 6px; margin: 20px 0;" />`
        : ""
    }

    <div style="margin: 15px 0; padding: 15px; background-color: #fff; border: 1px solid #ddd; border-radius: 6px;">
      <p><strong>Title:</strong> ${courseTitle}</p>
      <p><strong>Topic:</strong> ${topic}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Created on:</strong> ${new Date(
        createdAt
      ).toLocaleString()}</p>
    </div>

    ${
      courseLink
        ? `<p style="margin-top: 10px;"><a href="${courseLink}" style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Course</a></p>`
        : ""
    }

    <p style="margin-top: 30px; color: #555;">Thank you for your contribution to our platform.</p>
    <p style="color: #999;">— The ${APP_NAME} Team</p>
  </div>
  `;
};
