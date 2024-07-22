import { execSync } from "child_process";

export function setupDjango(projectName: string) {
  console.log(`Setting up Django in ${projectName}...`);
  const projectPath = `${process.cwd()}/${projectName}`;
  execSync(`python3 -m venv ${projectPath}/venv`, { stdio: "inherit" });
  execSync(`${projectPath}/venv/bin/pip install django`, { stdio: "inherit" });
  execSync(`${projectPath}/venv/bin/django-admin startproject ${projectName}`, {
    stdio: "inherit",
  });
}
