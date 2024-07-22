import { mkdirSync } from "fs";
import { join } from "path";
import { folders } from "./config";

export function fullstack(projectName: string) {
  console.log("Setting up fullstack project...");
  folders.forEach((folder) => {
    mkdirSync(join(projectName, folder), { recursive: true });
  });
  console.log(
    `Created client and server directories in ${projectName} project.`
  );
}
