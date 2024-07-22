import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import { project_type } from "./config";
import { frontend } from "./frontend";
import { backend } from "./backend/backend";
import { fullstack } from "./fullstack";
import { questions } from "./config";
import { mkdirSync } from "fs";

async function main() {
  try {
    // Prompt for project type
    const typeAnswers = await inquirer.prompt(questions.type);
    const projectTypeSelected = typeAnswers.type;

    // Prompt for project name
    const projectAnswers = await inquirer.prompt(questions.project_questions);
    const projectName = projectAnswers.project_name;
    mkdirSync(projectName, { recursive: true });
    console.log(`Created project directory: ${projectName}`);

    // Set up project based on type
    if (projectTypeSelected === project_type.frontend) {
      await frontend(projectName);
    } else if (projectTypeSelected === project_type.backend) {
      await backend(projectName);
    } else {
      // Fullstack
      fullstack(projectName);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
