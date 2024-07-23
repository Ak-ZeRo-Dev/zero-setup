import { execSync } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";
import {
  backendFolders,
  backendQuestions,
  env_path,
  expressTsFiles,
  isNo,
  isYes,
  matches,
  secrets,
} from "../config";
import { createSecretKey } from "../secret-key";

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
async function setupEnv() {
  const envAnswers = await inquirer.prompt(backendQuestions.createEnv);
  return envAnswers.createEnv;
}
async function setupSecret() {
  const secretAnswers = await inquirer.prompt(backendQuestions.createSecret);
  return secretAnswers.createSecret;
}
async function setupSecretLen() {
  const lenAnswers = await inquirer.prompt(backendQuestions.secretLen);
  return lenAnswers.secretLen;
}

export async function setupExpress(projectName: string) {
  console.log(`Setting up Express in ${projectName}...`);
  const tsChoice = await tsConfig();
  const libsChoice = await installDefaultLibs();
  const srcChoice = await src();
  const filesChoice = await copyDefaultFiles();
  const envChoice = await setupEnv();
  let lenChoice: number = 0;
  let secretChoice: any = "";
  if (isYes(envChoice)) {
    secretChoice = await setupSecret();
    if (isYes(secretChoice)) {
      lenChoice = parseInt(await setupSecretLen());
    }
  }
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
    envChoice,
    secretChoice,
    lenChoice,
    projectPath
  );
  setupDatabase();

  console.log("Express setup completed!");
}
async function setupTs(tsChoice: any, projectPath: string): Promise<void> {
  if (isYes(tsChoice)) {
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
  if (isYes(libsChoice)) {
    execSync(
      "npm install bcrypt cookie-parser cors dotenv ejs express ioredis jsonwebtoken mongoose nodemailer",
      {
        cwd: projectPath,
        stdio: "inherit",
      }
    );

    if (isYes(tsChoice)) {
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

async function setupFiles(
  filesChoice: any,
  srcChoice: any,
  tsChoice: any,
  databaseChoice: any,
  redisChoice: any,
  cloudinaryChoice: any,
  envChoice: any,
  secretChoice: any,
  lenChoice: any,
  projectPath: string
) {
  if (isYes(filesChoice)) {
    let dist;
    if (isYes(srcChoice)) {
      dist = path.join(projectPath, "src");
    } else {
      dist = projectPath;
    }

    let files;
    if (isYes(tsChoice)) {
      files = expressTsFiles.ts;
    } else {
      files = expressTsFiles.js;
    }

    let publicPath;
    if (isYes(tsChoice)) {
      publicPath = path.join(__dirname, "../../public/ts");
    } else {
      publicPath = path.join(__dirname, "../../public/js");
    }

    ensureDirExists(dist);
    ensureDirExists(publicPath);

    files.main.forEach((file: string) => {
      fs.copyFile(path.join(publicPath, file), path.join(dist, file), (err) => {
        if (err) throw new Error(`Error copying file: ${err}`);
      });
    });

    Object.keys(files)
      .filter((folder: string) => folder !== "main" && folder !== "config")
      .forEach((folder: string) => {
        files[folder].forEach((file: string) => {
          fs.copyFile(
            path.join(publicPath, folder, file),
            path.join(dist, folder, file),
            (err) => {
              if (err) throw new Error(`Error copying file: ${err}`);
            }
          );
        });
      });

    if (isYes(envChoice) && isYes(secretChoice)) {
      setupEnvFile(dist, parseInt(lenChoice));
    }

    const database = matches(databaseChoice, "mongodb");
    const redis = isYes(redisChoice);
    const cloudinary = isYes(cloudinaryChoice);

    if (database) {
      const file = files.config.find(
        (file: string) => file.split(".")[0] === "db"
      );
      fs.copyFile(
        path.join(publicPath, "config", file),
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
        path.join(publicPath, "config", file),
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
        path.join(publicPath, "config", file),
        path.join(dist, "config", file),
        (err) => {
          if (err) throw new Error(`Error copying file: ${err}`);
        }
      );
    }
  }
}

function setupSrc(srcChoice: any, tsChoice: any, projectPath: string): void {
  let dist: string;

  if (isNo(srcChoice)) {
    dist = projectPath;
  } else {
    dist = path.join(projectPath, "src");
    ensureDirExists(dist);
    backendFolders.forEach((folder) =>
      ensureDirExists(path.join(dist, folder))
    );
  }

  if (isYes(tsChoice)) {
    execSync("touch server.ts app.ts", {
      cwd: dist,
      stdio: "inherit",
    });
  } else {
    execSync("touch server.js app.js", {
      cwd: dist,
      stdio: "inherit",
    });
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

function setupEnvFile(dist: string, secretLen: number) {
  const envFilePath = path.join(__dirname, "../../public/.env");

  fs.readFile(envFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading .env file:", err);
      return;
    }

    const lines = data.split("\n");
    const existingKeys = new Set<string>();

    const updatedLines = lines.map((line) => {
      // Check if the line starts with any of the secret keys
      const secret = secrets.find((key: string) =>
        line.toLowerCase().startsWith(key.toLowerCase())
      );

      if (secret) {
        existingKeys.add(secret);
        return `"${secret}=${createSecretKey(secretLen)}"`;
      }

      // If no secret key is found, return the original line
      return line;
    });

    secrets.forEach((key) => {
      if (!existingKeys.has(key)) {
        updatedLines.push(`${key}=${createSecretKey(secretLen)}`);
      }
    });

    fs.writeFile(
      path.join(dist, env_path),
      updatedLines.join("\n"),
      "utf8",
      (err) => {
        if (err) {
          console.error("Error writing to .env file:", err);
        } else {
          console.log(".env file updated successfully.");
        }
      }
    );
  });
}

const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
