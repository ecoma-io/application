/**
 * @fileoverview Teardown toàn cục cho E2E tests của ALM Cleaner Service
 */

/* eslint-disable no-console */
async function globalTeardown() {
  // Dọn dẹp môi trường test toàn cục nếu cần
  console.log('Global teardown for ALM Cleaner E2E tests...');
}

export default globalTeardown; 