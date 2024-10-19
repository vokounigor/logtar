import { Logger, LogConfig } from './index.js';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function initLogger() {
  const logger = Logger.withConfig(
    LogConfig.fromFile(path.join(__dirname, './config.json'))
  );
  await logger.init();
  return logger;
}

async function main() {
  const logger = await initLogger();
  setInterval(() => {
    logger.error('Error in some function');
  }, 1000);
}

main();
