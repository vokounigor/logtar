import {
  RollingSizeOptions,
  RollingTimeOptions,
} from '../utils/rolling-options.js';

export class RollingConfig {
  #timeThreshold = RollingTimeOptions.Hourly;
  #sizeThreshold = RollingSizeOptions.FiveMB;

  withDefaults() {
    return new RollingConfig();
  }

  static assert(rollingConfig) {
    if (!(rollingConfig instanceof RollingConfig)) {
      throw new Error(
        `rollingConfig must be an instance of RollingConfig. Unsupported param ${JSON.stringify(
          rollingConfig
        )}`
      );
    }
  }

  /**
   * @param {number} timeThreshold
   */
  withTimeThreshold(timeThreshold) {
    RollingTimeOptions.assert(timeThreshold);
    this.#timeThreshold = timeThreshold;
    return this;
  }

  /**
   * @param {number} sizeThreshold
   */
  withSizeThreshold(sizeThreshold) {
    RollingSizeOptions.assert(sizeThreshold);
    this.#sizeThreshold = sizeThreshold;
    return this;
  }

  /**
   * @param {Record<string, unknown>} json
   */
  static fromJson(json) {
    const rollingConfig = new RollingConfig();

    Object.keys(json).forEach((key) => {
      switch (key) {
        case 'sizeThreshold':
          rollingConfig.withSizeThreshold(json[key]);
          break;
        case 'timeThreshold':
          rollingConfig.withTimeThreshold(json[key]);
          break;
        default:
          break;
      }
    });

    return rollingConfig;
  }

  get sizeThreshold() {
    return this.#sizeThreshold;
  }

  get timeThreshold() {
    return this.#timeThreshold;
  }
}
