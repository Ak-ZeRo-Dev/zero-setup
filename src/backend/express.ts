import { execSync } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import { backendFolders, backendQuestions, expressTsFiles } from "../config";

async function tsConfig() {
  const tsConfigAnswers = await inquirer.prompt(backendQuestions.ts_config);
  return tsConfigAnswers.ts_config;
}
async function src() {
  const srcAnswers = await inquirer.prompt(backendQuestions.src);
  return srcAnswers.src;
}
async function installDefaultLibs() {
  const libsAnswers = await inquirer.prompt(
    backendQuestions.installDefaultLibs
  );
  return libsAnswers.installDefaultLibs;
}
async function copyDefaultFiles() {
  const libsAnswers = await inquirer.prompt(backendQuestions.copyDefaultFiles);
  return libsAnswers.copyDefaultFiles;
}
async function setupDatabase() {
  const databaseAnswers = await inquirer.prompt(backendQuestions.database);
  return databaseAnswers.database;
}
async function setupRedis() {
  const redisAnswers = await inquirer.prompt(backendQuestions.redis);
  return redisAnswers.redis;
}
async function setupCloudinary() {
  const cloudinaryAnswers = await inquirer.prompt(backendQuestions.cloudinary);
  return cloudinaryAnswers.cloudinary;
}

export async function setupExpress(projectName: string) {
  console.log(`Setting up Express in ${projectName}...`);
  const tsChoice = await tsConfig();
  const srcChoice = await src();
  const libsChoice = await installDefaultLibs();
  const filesChoice = await copyDefaultFiles();
  const databaseChoice = await setupDatabase();
  const redisChoice = await setupRedis();
  const cloudinaryChoice = await setupCloudinary();

  const projectPath = `${process.cwd()}/${projectName}`;

  execSync("npm init -y", { cwd: projectPath, stdio: "inherit" });
  execSync("npm install express", { cwd: projectPath, stdio: "inherit" });

  await setupTs(tsChoice, projectPath);
  setupLibs(libsChoice, tsChoice, projectPath);
  setupSrc(srcChoice, tsChoice, projectPath);
  setupFiles(
    filesChoice,
    srcChoice,
    tsChoice,
    databaseChoice,
    redisChoice,
    cloudinaryChoice,
    projectPath
  );
  setupDatabase();

  console.log("Express setup completed!");
}

function setupFiles(
  filesChoice: any,
  srcChoice: any,
  tsChoice: any,
  databaseChoice: any,
  redisChoice: any,
  cloudinaryChoice: any,
  projectPath: string
) {
  if (filesChoice.toLowerCase() === "yes") {
    let dist;
    if (srcChoice.toLowerCase() === "yes") {
      dist = path.join(projectPath, "src");
    } else {
      dist = projectPath;
    }

    let files;
    if (tsChoice.toLowerCase() === "yes") {
      files = expressTsFiles.ts;
    } else {
      files = expressTsFiles.js;
    }

    files.main.forEach((file: string) => {
      fs.copyFile(
        path.join(__dirname, "../../public", file),
        path.join(dist, file),
        (err) => {
          if (err) throw new Error(`Error copying file: ${err}`);
        }
      );
    });

    Object.keys(files)
      .filter((folder: string) => folder !== "main" && folder !== "config")
      .forEach((folder: string) => {
        files[folder].forEach((file: string) => {
          fs.copyFile(
            path.join(__dirname, "../../public", folder, file),
            path.join(dist, folder, file),
            (err) => {
              if (err) throw new Error(`Error copying file: ${err}`);
            }
          );
        });
      });

    fs.copyFile(
      path.join(__dirname, "../../public/config/.env"),
      path.join(dist, "config/.env"),
      (err) => {
        if (err) throw new Error(`Error copying file: ${err}`);
      }
    );

    const database = databaseChoice.toLowerCase() === "mongodb";
    const redis = redisChoice.toLowerCase() === "yes";
    const cloudinary = cloudinaryChoice.toLowerCase() === "yes";

    if (database) {
      const file = files.config.find(
        (file: string) => file.split(".")[0] === "db"
      );
      fs.copyFile(
        path.join(__dirname, "../../public/config", file),
        path.join(dist, "config", file),
        (err) => {
          if (err) throw new Error(`Error copying file: ${err}`);
        }
      );
    }
    if (redis) {
      const file = files.config.find(
        (file: string) => file.split(".")[0] === "redis"
      );
      fs.copyFile(
        path.join(__dirname, "../../public/config", file),
        path.join(dist, "config", file),
        (err) => {
          if (err) throw new Error(`Error copying file: ${err}`);
        }
      );
    }
    if (cloudinary) {
      const file = files.config.find(
        (file: string) => file.split(".")[0] === "cloudinary"
      );
      fs.copyFile(
        path.join(__dirname, "../../public/config", file),
        path.join(dist, "config", file),
        (err) => {
          if (err) throw new Error(`Error copying file: ${err}`);
        }
      );
    }
  }
}

function setupSrc(srcChoice: any, tsChoice: any, projectPath: string): void {
  if (srcChoice.toLowerCase() === "no") {
    if (tsChoice.toLowerCase() === "yes") {
      execSync("touch server.ts app.ts", {
        cwd: projectPath,
        stdio: "inherit",
      });
    } else {
      execSync("touch server.js app.js", {
        cwd: projectPath,
        stdio: "inherit",
      });
    }
  } else {
    execSync("mkdir src", {
      cwd: projectPath,
      stdio: "inherit",
    });

    backendFolders.forEach((folder) =>
      execSync(`mkdir ${folder}`, {
        cwd: path.join(projectPath, "src"),
        stdio: "inherit",
      })
    );

    if (tsChoice.toLowerCase() === "yes") {
      execSync("touch server.ts app.ts", {
        cwd: path.join(projectPath, "src"),
        stdio: "inherit",
      });
    } else {
      execSync("touch server.js app.js", {
        cwd: path.join(projectPath, "src"),
        stdio: "inherit",
      });
    }
  }
}

async function setupTs(tsChoice: any, projectPath: string): Promise<void> {
  if (tsChoice.toLowerCase() === "yes") {
    execSync("npm install -D @types/node typescript ts-node @types/express", {
      cwd: projectPath,
      stdio: "inherit",
    });
    execSync("npx tsc --init", { cwd: projectPath, stdio: "inherit" });

    const tsSourceFile = path.join(__dirname, "../../public/tsconfig.json");
    const tsDestinationFile = path.join(projectPath, "tsconfig.json");
    await fs.copyFile(tsSourceFile, tsDestinationFile, (err) => {
      if (err) throw new Error(`Error copying file: ${err}`);
    });

    const packageSourceFile = path.join(__dirname, "../../public/package.json");
    const packageDestinationFile = path.join(projectPath, "package.json");

    editPackageFile(packageSourceFile, packageDestinationFile);
  }
}

function setupLibs(libsChoice: any, tsChoice: any, projectPath: string): void {
  if (libsChoice.toLowerCase() === "yes") {
    execSync(
      "npm install bcrypt cookie-parser cors dotenv ejs express ioredis jsonwebtoken mongoose nodemailer",
      {
        cwd: projectPath,
        stdio: "inherit",
      }
    );

    if (tsChoice.toLowerCase() === "yes") {
      execSync(
        "npm install --save-dev @types/bcrypt @types/cookie-parser @types/cors @types/dotenv @types/ejs  @types/ioredis @types/jsonwebtoken @types/mongoose @types/nodemailer",
        {
          cwd: projectPath,
          stdio: "inherit",
        }
      );
    }
  }
}

function editPackageFile(
  packageSourceFile: string,
  packageDestinationFile: string
) {
  fs.readFile(packageSourceFile, "utf8", (err, data1) => {
    if (err) throw new Error(`Error reading packageSourceFile: ${err}`);

    const file1Content = JSON.parse(data1);

    fs.readFile(packageDestinationFile, "utf8", (err, data2) => {
      if (err) throw new Error(`Error reading packageDestinationFile: ${err}`);

      const file2Content = JSON.parse(data2);

      file2Content.scripts = {
        ...file1Content.scripts,
        ...file2Content.scripts,
      };

      fs.writeFile(
        packageDestinationFile,
        JSON.stringify(file2Content, null, 2),
        (err) => {
          if (err)
            throw new Error(`Error Error writing to tsDestinationFile: ${err}`);
        }
      );
    });
  });
}
