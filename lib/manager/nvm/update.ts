import { logger } from '../../logger';
import { Upgrade } from '../common';

export function updateDependency(_fileContent: string, upgrade: Upgrade) {
  logger.debug(`nvm.updateDependency(): ${upgrade.newVersion}`);
  return `${upgrade.newValue}\n`;
}
