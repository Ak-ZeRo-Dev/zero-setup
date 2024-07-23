import inquirer from "inquirer";
import { backend_framework, backendQuestions, questions } from "../config";
import { setupExpress } from "./express";
import { setupNestjs } from "./nestjs";
import { setupDjango } from "./django";

export async function backend(projectName: string) {
  console.log("Setting up Backend");
  const backendAnswers = await inquirer.prompt(
    backendQuestions.backend_framework
  );
  const frameworkChoice = backendAnswers.backend_framework;

  if (frameworkChoice === backend_framework.express) {
    setupExpress(projectName);
  } else if (frameworkChoice === backend_framework.nestjs) {
    setupNestjs(projectName);
  } else if (frameworkChoice === backend_framework.django) {
    setupDjango(projectName);
  }
}
