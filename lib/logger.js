import fs from 'node:fs/promises';
import path from 'node:path';
import { LogLevel } from './utils/log-level.js';
import { LogConfig } from './config/log-config.js';
import { checkAndCreateDir, getCallerInfo } from './utils/helpers.js';

export class Logger {
  /** @type {LogConfig} */
  #config;
  /** @type {fs.FileHandle} */
  #logFileHandle;

  /**
   * @param {LogConfig=} logConfig
   * @throws {Error} On invalid logLevel provided
   */
  constructor(logConfig) {
    if (typeof logConfig === 'undefined') {
      logConfig = LogConfig.withDefaults();
    }
    LogConfig.assert(logConfig);
    this.#config = logConfig;
  }

  async init() {
    const logDirPath = checkAndCreateDir('logs');
    const fileName =
      this.#config.filePrefix +
      new Date().toISOString().replace(/[.:]+/g, '-') +
      '.log';
    this.#logFileHandle = await fs.open(path.join(logDirPath, fileName), 'a+');
  }

  async #rollingCheck() {
    if (typeof this.#config.rollingConfig === 'undefined') {
      return;
    }

    const { sizeThreshold, timeThreshold } = this.#config.rollingConfig;
    const { size, birthtimeMs } = await this.#logFileHandle.stat();
    const currentTime = new Date().getTime();
    const overTimeThreshold = currentTime - birthtimeMs >= timeThreshold * 1000;

    if (size > sizeThreshold || overTimeThreshold) {
      await this.#logFileHandle.close();
      await this.init();
    }
  }

  static withDefaults() {
    return new Logger();
  }

  /**
   * @param {LogConfig} logConfig
   */
  static withConfig(logConfig) {
    return new Logger(logConfig);
  }

  /**
   * @param {string} message
   * @param {LogLevel} logLevel
   */
  async #writeToHandle(message, logLevel) {
    const dateISO = new Date().toISOString();
    const logLevelString = LogLevel.toString(logLevel);

    const logMessage = `[${dateISO}] [${logLevelString}]: ${getCallerInfo()} ${message}\n`;
    await this.#logFileHandle.write(logMessage);
  }

  /**
   * @param {string} message
   * @param {LogLevel} logLevel
   */
  async #log(message, logLevel) {
    if (logLevel < this.#config.level || !this.#logFileHandle.fd) {
      return;
    }

    await this.#writeToHandle(message, logLevel);
    await this.#rollingCheck();
  }

  /**
   * @param {string} message
   */
  debug(message) {
    this.#log(message, LogLevel.Debug);
  }
  /**
   * @param {string} message
   */
  info(message) {
    this.#log(message, LogLevel.Info);
  }
  /**
   * @param {string} message
   */
  warn(message) {
    this.#log(message, LogLevel.Warn);
  }
  /**
   * @param {string} message
   */
  error(message) {
    this.#log(message, LogLevel.Error);
  }
  /**
   * @param {string} message
   */
  critical(message) {
    this.#log(message, LogLevel.Critical);
  }

  /**
   * @returns {string}
   */
  toString() {
    return `File prefix: ${this.#config.filePrefix};
Log Level: ${this.#config.level};
Size threshold: ${this.#config.rollingConfig.sizeThreshold};
Time threshold: ${this.#config.rollingConfig.timeThreshold};`;
  }
}
