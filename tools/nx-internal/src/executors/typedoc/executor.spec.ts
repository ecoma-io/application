import { ExecutorContext } from "@nx/devkit";
import { EventEmitter } from "events";
import * as childProcess from "child_process";

import executor from "./executor";
import { ITypedocExecutorSchema } from "./schema";

jest.mock("child_process");

/**
 * Mock cho process spawn
 */
const mockSpawn = (exitCode = 0) => {
  const mockChildProcess = new EventEmitter() as any;
  mockChildProcess.stdout = new EventEmitter();
  mockChildProcess.stderr = new EventEmitter();
  mockChildProcess.kill = jest.fn();

  // Giả lập process events
  process.nextTick(() => {
    mockChildProcess.stdout.emit("data", "Test output");
    mockChildProcess.emit("close", exitCode);
  });

  return mockChildProcess;
};

describe("Typedoc Executor", () => {
  let context: ExecutorContext;
  let options: ITypedocExecutorSchema;

  beforeEach(() => {
    jest.clearAllMocks();
    (childProcess.spawn as jest.Mock).mockImplementation(() => mockSpawn(0));

    context = {
      root: '/root',
      cwd: '/root',
      isVerbose: false,
      projectName: 'test-project',
      targetName: 'build',
      configurationName: 'production',
      projectsConfigurations: {
        projects: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'test-project': {
            root: 'apps/test-project',
            sourceRoot: 'apps/test-project/src',
            projectType: 'application',
            targets: {
              build: {
                executor: '@nx/js:tsc',
                options: {
                  outputPath: 'dist/apps/test-project',
                  main: 'apps/test-project/src/main.ts',
                  tsConfig: 'apps/test-project/tsconfig.json',
                },
              },
            },
          },
        },
        version: 2,
      },
      nxJsonConfiguration: {
        targetDefaults: {},
      },
      projectGraph: {
        nodes: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'test-project': {
            name: 'test-project',
            type: 'app',
            data: {
              root: 'apps/test-project',
              sourceRoot: 'apps/test-project/src',
              projectType: 'application',
              targets: {
                build: {
                  executor: '@nx/js:tsc',
                },
              },
            },
          },
        },
        dependencies: {},
      },
    };

    options = {
      entryPointPath: 'src/index.ts',
      outputPath: 'dist/docs',
      tsConfig: 'tsconfig.json',
      watch: false,
      excludePrivate: true,
      excludeProtected: true,
      excludeExternals: true,
      includeVersion: true,
      hideGenerator: true,
      readme: 'README.md',
    };
  });

  it("nên chạy thành công với các options mặc định", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
    expect(childProcess.spawn).toHaveBeenCalledWith(
      'npx typedoc',
      expect.arrayContaining([
        '--entryPointPath src/index.ts',
        '--outputPath dist/docs',
        '--tsConfig tsconfig.json'
      ]),
      expect.any(Object)
    );
  }, 10000);

  it("nên xử lý chế độ watch", async () => {
    const watchOptions = { ...options, watch: true };
    const result = await executor(watchOptions, context);
    expect(result.success).toBe(true);
    expect(childProcess.spawn).toHaveBeenCalledWith(
      'npx typedoc',
      expect.arrayContaining(['--watch']),
      expect.any(Object)
    );
  }, 10000);

  it("nên xử lý các tùy chọn tùy chỉnh", async () => {
    const customOptions = {
      ...options,
      excludePrivate: false,
      excludeProtected: false,
      excludeExternals: false,
      includeVersion: false,
      hideGenerator: false,
    };
    const result = await executor(customOptions, context);
    expect(result.success).toBe(true);
    expect(childProcess.spawn).toHaveBeenCalledWith(
      'npx typedoc',
      expect.not.arrayContaining([
        '--excludePrivate',
        '--excludeProtected',
        '--excludeExternals',
        '--includeVersion',
        '--hideGenerator'
      ]),
      expect.any(Object)
    );
  }, 10000);

  it("nên xử lý lỗi khi process trả về mã lỗi khác 0", async () => {
    (childProcess.spawn as jest.Mock).mockImplementation(() => mockSpawn(1));
    const result = await executor(options, context);
    expect(result.success).toBe(false);
  }, 10000);
});
