/* eslint-disable */

import * as fs from 'fs';
import * as path from 'path';

declare global {
  var testContainers: {
    mongoContainer: any;
    rabbitmqContainer: any;
    iamServiceContainer: any;
  };
}

module.exports = async function () {
  // Stop containers using globalThis
  if (globalThis.testContainers) {
    const { mongoContainer, rabbitmqContainer, iamServiceContainer } = globalThis.testContainers;

    if (mongoContainer) await mongoContainer.stop();
    if (rabbitmqContainer) await rabbitmqContainer.stop();
    if (iamServiceContainer) await iamServiceContainer.stop();
  }

  // Clean up state file
  const statePath = path.resolve(__dirname, '.global-test-state.json');
  if (fs.existsSync(statePath)) {
    fs.unlinkSync(statePath);
  }
};
