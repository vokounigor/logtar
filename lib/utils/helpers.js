import fs from "node:fs";
import path from "node:path";
import process from "node:process";

/**
 * @param {string} pathToDir
 * @returns {fs.PathLike}
 */
export function checkAndCreateDir(pathToDir) {
  const logDir = path.resolve(process.cwd(), pathToDir);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  return logDir;
}

/**
 * @returns {string}
 */
export function getCallerInfo() {
  const error = {};
  Error.captureStackTrace(error);

  /** @type {string} */
  const callerFrame = error.stack.split("\n")[5];
  return callerFrame.split("at ").pop();
}
