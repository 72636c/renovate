import is from '@sindresorhus/is';

const { logger } = require('../../../../logger');

const { appSlug } = require('../../../../config/app-strings');

const clone = input => JSON.parse(JSON.stringify(input));

export { getOnboardingConfig };

async function getOnboardingConfig(config) {
  const onboardingConfig = clone(config.onboardingConfig);
  try {
    logger.debug('Checking for greenkeeper config');

    const greenkeeperConfig = JSON.parse(
      // @ts-ignore
      await platform.getFile('package.json')
    ).greenkeeper;
    if (greenkeeperConfig) {
      onboardingConfig.statusCheckVerify = true;
    }
    const { label, branchName, ignore } = greenkeeperConfig;
    if (label) {
      logger.info({ label }, 'Migrating Greenkeeper label');
      onboardingConfig.labels = [String(label).replace('greenkeeper', appSlug)];
    }
    if (branchName) {
      logger.info({ branch: branchName }, 'Migrating Greenkeeper branchName');
      onboardingConfig.branchName = [
        String(branchName).replace('greenkeeper', appSlug),
      ];
    }
    if (is.nonEmptyArray(ignore)) {
      logger.info({ ignore }, 'Migrating Greenkeeper ignore');
      onboardingConfig.ignoreDeps = ignore.map(String);
    }
  } catch (err) {
    logger.debug('No greenkeeper config migration');
  }
  logger.debug({ config: onboardingConfig }, 'onboarding config');
  return JSON.stringify(onboardingConfig, null, 2) + '\n';
}
