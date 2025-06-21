import { createCategory } from "../modules/category/category.service";

const starterCategories = [
  {
    name: "Development",
    description:
      "Courses focused on software development, covering both web and mobile applications.",
    predefinedCourses: [
      {
        title: "Frontend Web Development (Including ReactJs)",
        description:
          "Learn to build user interfaces using HTML, CSS, JavaScript, and modern frameworks like React.",
      },
      {
        title: "Backend Development",
        description:
          "Develop server-side applications, APIs, and databases using languages like Node.js and frameworks like Express.",
      },
      {
        title: "Fullstack Web Development (MERN stack, NextJs)",
        description:
          "Master fullstack development with MongoDB, Express, React, and Node.js, including frameworks like Next.js.",
      },
      {
        title: "Mobile App Development (iOS/Android)",
        description:
          "Create cross-platform or native mobile apps using tools like React Native, Flutter, or Swift.",
      },
      {
        title: "Software Design Patterns",
        description:
          "Learn reusable design solutions to common programming problems to write scalable and maintainable code.",
      },
      {
        title: "Web3 (dApps) - Building Decentralized Applications",
        description:
          "Explore blockchain-based app development including smart contracts and Ethereum integration.",
      },
    ],
  },
  {
    name: "Design",
    description:
      "Visual and interactive design courses focused on user experience and brand identity.",
    predefinedCourses: [
      {
        title: "UI/UX Design",
        description:
          "Learn user-centered design processes, wireframing, prototyping, and usability testing.",
      },
      {
        title: "Creative Design",
        description:
          "Explore digital illustration, animation, and storytelling through creative tools like Adobe Suite.",
      },
      {
        title: "Brand Design",
        description:
          "Develop visual identity systems for companies, including logos, color palettes, and typography.",
      },
    ],
  },
  {
    name: "Security",
    description:
      "Courses that teach how to secure digital systems, data, and infrastructure.",
    predefinedCourses: [
      {
        title: "InfoSec (Fundamentals)",
        description:
          "Understand the basics of information security including confidentiality, integrity, and availability.",
      },
      {
        title: "Cybersecurity",
        description:
          "Learn to protect systems and networks from digital attacks and breaches.",
      },
      {
        title: "Ethical Hacking / PenTest",
        description:
          "Train to ethically find vulnerabilities in systems through penetration testing techniques.",
      },
    ],
  },
  {
    name: "Data and Analysis",
    description:
      "Data-focused courses covering analysis, databases, and machine learning.",
    predefinedCourses: [
      {
        title: "Database (NoSQL, MongoDB)",
        description:
          "Introduction to database management systems, with focus on NoSQL databases like MongoDB.",
      },
      {
        title: "Data Analysis",
        description:
          "Learn to clean, analyze, and visualize data using tools like Excel, Python, and SQL.",
      },
      {
        title: "Data Science",
        description:
          "Explore predictive analytics and data modeling using programming and statistical techniques.",
      },
      {
        title: "Machine Learning",
        description:
          "Build intelligent systems that learn from data using supervised and unsupervised models.",
      },
    ],
  },
  {
    name: "Programming Languages",
    description:
      "Courses that focus on core programming languages used across industries.",
    predefinedCourses: [
      {
        title: "Python",
        description:
          "A general-purpose language used in data science, automation, backend, and more.",
      },
      {
        title: "JavaScript",
        description:
          "The language of the web, used for frontend, backend (Node.js), and fullstack applications.",
      },
      {
        title: "Dart",
        description:
          "The primary language for Flutter development used in building fast cross-platform apps.",
      },
      {
        title: "Java",
        description:
          "A mature and widely-used language for building scalable enterprise and Android applications.",
      },
      {
        title: "Solidity (Blockchain)",
        description:
          "A contract-oriented language used to write smart contracts on Ethereum.",
      },
    ],
  },
  {
    name: "Technology and Infrastructure",
    description:
      "Courses related to operating systems, networking, cloud, and blockchain infrastructure.",
    predefinedCourses: [
      {
        title: "Linux Operating System",
        description:
          "Master the Linux OS for development, server administration, and cloud deployment.",
      },
      {
        title: "Networking",
        description:
          "Understand network fundamentals including protocols, IP addressing, and network security.",
      },
      {
        title: "Cloud Computing",
        description:
          "Learn cloud platforms like AWS, Azure, or GCP for deploying scalable applications.",
      },
      {
        title: "Blockchain / Smart Contracts",
        description:
          "Develop secure, decentralized applications and smart contracts using blockchain technologies.",
      },
      {
        title: "Mastering Cryptocurrency Trading and Web3 Technologies",
        description:
          "Explore trading strategies, crypto fundamentals, and tools in the Web3 ecosystem.",
      },
    ],
  },
];

const createStarterCategories = async () => {
  for (const category of starterCategories) {
    try {
      await createCategory(category);
    } catch (err) {
      console.error(`Error creating category ${category.name}:`, err);
    }
  }
};

export default createStarterCategories;
