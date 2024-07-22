import { execSync } from "child_process";

export function setupNestjs(projectName: string) {
  console.log(`Setting up NestJS in ${projectName}...`);
  execSync("npm install -g @nestjs/cli", { stdio: "inherit" });
  execSync(`nest new ${projectName}`, { stdio: "inherit" });
}
