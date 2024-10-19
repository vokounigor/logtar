import fs from 'node:fs';
import { LogLevel } from '../utils/log-level.js';
import { RollingConfig } from './rolling-config.js';

export class LogConfig {
  /** @type {number} */
  #level = LogLevel.Info;
  /** @type {RollingConfig=} */
  #rollingConfig;
  /** @type {string} */
  #filePrefix = 'Logtar_';
  /** @type {boolean} */
  #consoleOutput = false;
  /** @type {string} */
  #logDirPath = 'logs';

  static withDefaults() {
    return new LogConfig();
  }

  /**
   * @param {number} logLevel
   */
  withLogLevel(logLevel) {
    LogLevel.assert(logLevel);
    this.#level = logLevel;
    return this;
  }

  /**
   * @param {RollingConfig} rollingConfig
   */
  withRollingConfig(rollingConfig) {
    this.#rollingConfig = RollingConfig.fromJson(rollingConfig);
    return this;
  }

  /**
   * @param {boolean} consoleOutput
   */
  withConsoleOutput(consoleOutput) {
    if (typeof consoleOutput !== 'boolean') {
      throw new Error(
        `Console output must be a boolean. Unsupported paramater: ${JSON.stringify(
          consoleOutput
        )}`
      );
    }
    this.#consoleOutput = consoleOutput;
    return this;
  }

  /**
   * @param {string} filePrefix
   */
  withFilePrefix(filePrefix) {
    if (typeof filePrefix !== 'string') {
      throw new Error(
        `File prefix must be a string. Unsupported paramater: ${JSON.stringify(
          filePrefix
        )}`
      );
    }
    this.#filePrefix = filePrefix;
    return this;
  }

  /**
   * @param {string} logDirPath
   */
  withLogDirPath(logDirPath) {
    if (typeof logDirPath !== 'string') {
      throw new Error(
        `Log directory path must be a string. Unsupported paramater: ${JSON.stringify(
          logDirPath
        )}`
      );
    }
    this.#logDirPath = logDirPath;
    return this;
  }

  /**
   * @param {Record<string, unknown>} json
   */
  static fromJson(json) {
    const logConfig = new LogConfig();

    Object.entries(json).forEach(([key, value]) => {
      switch (key) {
        case 'level':
          logConfig.withLogLevel(value);
          break;
        case 'rollingConfig':
          logConfig.withRollingConfig(value);
          break;
        case 'filePrefix':
          logConfig.withFilePrefix(value);
          break;
        case 'consoleOutput':
          logConfig.withConsoleOutput(value);
          break;
        case 'logDirPath':
          logConfig.withLogDirPath(value);
          break;
        default:
          break;
      }
    });

    return logConfig;
  }

  /**
   * @param {import('node:fs').PathLike} filePath
   */
  static fromFile(filePath) {
    const fileContents = fs.readFileSync(filePath);
    return LogConfig.fromJson(JSON.parse(fileContents));
  }

  /**
   * @param {LogConfig=} logConfig
   */
  static assert(logConfig) {
    if (typeof logConfig === 'undefined' || !(logConfig instanceof LogConfig)) {
      throw new Error(
        `logConfig must be an instance of LogConfig. Unsupported param ${JSON.stringify(
          logConfig
        )}`
      );
    }
  }

  get level() {
    return this.#level;
  }

  get rollingConfig() {
    return this.#rollingConfig;
  }

  get filePrefix() {
    return this.#filePrefix;
  }

  get consoleOutput() {
    return this.#consoleOutput;
  }

  get logDirPath() {
    return this.#logDirPath;
  }
}
