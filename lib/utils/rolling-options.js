export class RollingSizeOptions {
  static OneKB = 1024;
  static FiveKB = 5 * 1024;
  static TenKB = 10 * 1024;
  static TwentyKB = 20 * 1024;
  static FiftyKB = 50 * 1024;
  static HundredKB = 100 * 1024;

  static HalfMB = 512 * 1024;
  static OneMB = 1024 * 1024;
  static FiveMB = 5 * 1024 * 1024;
  static TenMB = 10 * 1024 * 1024;
  static TwentyMB = 20 * 1024 * 1024;
  static FiftyMB = 50 * 1024 * 1024;
  static HundredMB = 100 * 1024 * 1024;

  static assert(sizeThreshold) {
    if (
      typeof sizeThreshold !== 'number' ||
      sizeThreshold < RollingSizeOptions.OneKB
    ) {
      throw new Error(
        `sizeThreshold must be at-least 1 KB. Unsupported param ${JSON.stringify(
          sizeThreshold
        )}`
      );
    }
  }
}

export class RollingTimeOptions {
  static Minutely = 60; // Every 60 seconds
  static Hourly = 60 * this.Minutely;
  static Daily = 24 * this.Hourly;
  static Weekly = 7 * this.Daily;
  static Monthly = 30 * this.Daily;
  static Yearly = 12 * this.Monthly;

  static assert(timeOption) {
    if (
      ![
        this.Minutely,
        this.Hourly,
        this.Daily,
        this.Weekly,
        this.Monthly,
        this.Yearly,
      ].includes(timeOption)
    ) {
      throw new Error(
        `timeOption must be an instance of RollingConfig. Unsupported param ${JSON.stringify(
          timeOption
        )}`
      );
    }
  }
}
