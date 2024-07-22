// Define project types and framework choices
export const project_type = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Fullstack",
};

export const frontend_framework = {
  react: "React",
  nextjs: "Next.js",
};
export const database = {
  mongodb: "MongoDB",
  postgreSQL: "PostgreSQL",
  sqlight: "SQLite",
  sql: "SQL",
};

export const react_options = {
  create_react_app: "create-react-app",
  vite: "vite",
};

export const backend_framework = {
  express: "Express",
  nestjs: "NestJS",
  django: "Django",
};

export const folders = ["client", "server"];

export const expressTsFiles: any = {
  ts: {
    main: ["server.ts", "app.ts"],
    config: [".env", "cloudinary.ts", "db.ts", "redis.ts"],
    middlewares: [
      "auth.ts",
      "catchAsyncErrors.ts",
      "handelErrors.ts",
      "multer.ts",
    ],
    utils: ["ErrorHandler.ts", "jwt.ts", "sendMail.ts"],
  },
  js: {
    main: ["server.js", "app.js"],
    config: [".env", "cloudinary.js", "db.js", "redis.js"],
    middlewares: [
      "auth.js",
      "catchAsyncErrors.js",
      "handelErrors.js",
      "multer.js",
    ],
    utils: ["ErrorHandler.js", "jwt.js", "sendMail.js"],
  },
};
export const backendFolders = [
  "config",
  "controllers",
  "mails",
  "middlewares",
  "models",
  "routes",
  "schemas",
  "types",
  "utils",
];

export const backendQuestions: any = {
  backend_framework: [
    {
      type: "list",
      name: "backend_framework",
      message: "Which backend framework would you like to use?",
      choices: [
        backend_framework.express,
        backend_framework.nestjs,
        backend_framework.django,
      ],
      default: backend_framework.express,
    },
  ],
  ts_config: [
    {
      type: "list",
      name: "ts_config",
      message: "Would you like to use TypeScript?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ],
  eslint: [
    {
      type: "list",
      name: "eslint",
      message: "Would you like to use ESLint?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ],
  src: [
    {
      type: "list",
      name: "src",
      message: "Would you like to use `src/` directory?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ],
  installDefaultLibs: [
    {
      type: "list",
      name: "installDefaultLibs",
      message: "Would you like to install default libraries?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ],
  copyDefaultFiles: [
    {
      type: "list",
      name: "copyDefaultFiles",
      message: "Would you like to copy default files?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ],

  database: [
    {
      type: "list",
      name: "database",
      message: "Which database would you like to use in your project?",
      choices: [
        database.mongodb,
        database.postgreSQL,
        database.sqlight,
        database.sql,
      ],
      default: database.mongodb,
    },
  ],
  redis: [
    {
      type: "list",
      name: "redis",
      message: "Would you like to Redis?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ],
  cloudinary: [
    {
      type: "list",
      name: "cloudinary",
      message: "Would you like to Cloudinary?",
      choices: ["Yes", "No"],
      default: "Yes",
    },
  ],
};

export const frontendQuestions: any = {
  tailwindcss: [
    {
      type: "list",
      name: "tailwindcss",
      message: "Would you like to use Tailwind CSS?",
      choices: ["Yes", "No"],
      default: "No",
    },
  ],
};

export const questions: any = {
  project_questions: [
    {
      type: "input",
      name: "project_name",
      message: "What is your project name?",
      default: "ak-zero",
    },
  ],
  type: [
    {
      type: "list",
      name: "type",
      message: "What type of project are you creating?",
      choices: [
        project_type.fullstack,
        project_type.frontend,
        project_type.backend,
      ],
      default: project_type.fullstack,
    },
  ],
  frontend_framework: [
    {
      type: "list",
      name: "frontend_framework",
      message: "Which frontend framework would you like to use?",
      choices: [frontend_framework.nextjs, frontend_framework.react],
      default: frontend_framework.nextjs,
    },
  ],
  react_options: [
    {
      type: "list",
      name: "react_options",
      message: "Which React tool would you like to use?",
      choices: [react_options.vite, react_options.create_react_app],
      default: react_options.vite,
    },
  ],
};
