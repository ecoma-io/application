import { ExecutorContext, logger } from '@nx/devkit';
import { spawn } from 'child_process';

import { getProjectConfiguration } from './process/get-project-configuration';
import { toArguments } from './process/to-arguments';
import { ITypedocExecutorSchema } from './schema';

export default async function runExecutor(options: ITypedocExecutorSchema, context: ExecutorContext) {
  const config = getProjectConfiguration(context);
  const command = `npx typedoc`;
  const args = toArguments(options);
  const processOpts = { cwd: config.root || context.root, shell: true };
  return new Promise<{ success: boolean }>((resolve) => {
    logger.debug({ command, args, processOpts });
    const childProcess = spawn(command, args, processOpts);
    process.on('exit', () => childProcess.kill());
    process.on('SIGTERM', () => childProcess.kill());
    childProcess.stdout.on('data', (data) => logger.info(data.toString()));
    childProcess.stderr.on('data', (data) => logger.error(data.toString()));
    childProcess.on('close', (code) => resolve({ success: code === 0 }));
  });
}
