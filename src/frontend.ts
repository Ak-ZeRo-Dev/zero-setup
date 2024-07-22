import inquirer from "inquirer";
import { execSync } from "child_process";
import { questions, react_options, frontend_framework } from "./config";

function installReact(projectName: string, reactChoice: string) {
  if (reactChoice === react_options.create_react_app) {
    console.log("Installing React using create-react-app...");
    execSync(`npx create-react-app ${projectName}`, { stdio: "inherit" });
  } else if (reactChoice === react_options.vite) {
    console.log("Installing React using Vite...");
    execSync(`npm create vite@latest ${projectName}`, { stdio: "inherit" });
  }
}

function installNextjs(projectName: string) {
  console.log("Installing Next.js...");
  execSync(`npx create-next-app@latest ${projectName}`, { stdio: "inherit" });
}

export async function frontend(projectName: string) {
  const frontendFrameworkAnswers = await inquirer.prompt(
    questions.frontend_framework
  );
  const frameworkChoice = frontendFrameworkAnswers.frontend_framework;

  if (frameworkChoice === frontend_framework.react) {
    const reactAnswers = await inquirer.prompt(questions.react_options);
    const reactChoice = reactAnswers.react_options;
    installReact(projectName, reactChoice);
  } else if (frameworkChoice === frontend_framework.nextjs) {
    installNextjs(projectName);
  }
}
