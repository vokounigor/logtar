import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

/**
 * @param {string} pathToDir
 * @returns {fs.PathLike}
 * @throws {Error} On error when creating directory (permission error, etc.)
 */
export function checkAndCreateDir(pathToDir) {
  let logDir = path.resolve(process.cwd(), pathToDir);
  if (pathToDir.startsWith('/')) {
    logDir = pathToDir;
  }

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
  const callerFrame = error.stack.split('\n')[5];
  return callerFrame.split('at ').pop();
}
