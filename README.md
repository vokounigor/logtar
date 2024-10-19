# LogTar

## A no-dependency nodeJS logging library

(devDependencies don't count)

## Usage

To begin logging, create a Logger instance. There are multiple ways to do this:

- Create a config file and pass it to the logger
- Create a logger instance with the builder pattern
- Create a logger instance with defaults

### Create a config file and pass it to the logger

Example config.json file:

```json
{
  "level": 3, // 3 is the level for Warn
  "logDirPath": "/var/tmp/logs", // The directory for the log files
  "filePrefix": "LogTar_", // The prefix for a log file
  "rollingConfig": {
    "sizeThreshold": 1024, // 1KB size - once exceeded, create a new log file
    "timeThreshold": 86400 // 1 day - once exceeded, create a new log file
  },
  "consoleOutput": false // Whether to output to the console too
}
```

Once you have a config file, you can pass it to the logger like so:

```js
import { Logger, LogConfig } from 'logtar';

async function initLogger() {
  const logger = Logger.withConfig(
    LogConfig.fromFile(path.join(__dirname, './config.json'))
  );
  await logger.init();
  return logger;
}

const logger = await initLogger();

logger.error('Whoops, an error occurred.');
```

### Create a logger instance with a builder pattern

You can chain methods to build up a LogConfig instance to suit your needs.

```js
import { Logger, LogConfig, LogLevel } from 'logtar';

async function initLogger() {
  const logConfig = LogConfig.withDefaults()
    .withLogDirPath('/var/tmp/logs')
    .withFilePrefix('FilePrefix_')
    .withLogLevel(LogLevel.Info)
    .withConsoleOutput(true);

  const logger = new Logger(logConfig);
  await logger.init();
  return logger;
}

const logger = await initLogger();

logger.info('Hello, world!');
```

### Create a logger instance with defaults

Create a logger instance with the default config if you have no special needs.

```js
import { Logger } from 'logtar';

async function initLogger() {
  const logger = new Logger();
  await logger.init();
  return logger;
}

const logger = await initLogger();

logger.info('Hello, world!');
```
