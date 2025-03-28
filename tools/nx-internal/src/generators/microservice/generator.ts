import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
} from "@nx/devkit";
import * as path from "path";
import { microserviceGeneratorSchema } from "./schema";

export async function microserviceGenerator(
  tree: Tree,
  options: microserviceGeneratorSchema
) {
  const projectRoot = `apps/services/${options.name}`;
  const projectTestRoot = `tests/services/${options.name}`;

  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: "application",
    sourceRoot: `${projectRoot}/src`,
    targets: {
      build: {
        executor: "nx:run-commands",
        options: {
          command: "webpack-cli build",
          args: ["node-env=production"],
        },
        configurations: {
          development: {
            args: ["node-env=development"],
          },
        },
      },
      serve: {
        executor: "@nx/js:node",
        defaultConfiguration: "development",
        dependsOn: ["build"],
        options: {
          buildTarget: options.name + ":build",
          runBuildTargetDependencies: false,
          inspect: false,
        },
        configurations: {
          development: {
            buildTarget: options.name + ":build:development",
          },
          production: {
            buildTarget: options.name + ":build:production",
          },
        },
      },
      test: {
        executor: "@nx/jest:jest",
        options: {
          jestConfig: `apps/${options.name}/jest.config.ts`,
          passWithNoTests: true,
        },
      },
    },
  });
  const className = options.name
    .replace(/[-_]/g, " ") // Replace - and _ with space
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join("");
  generateFiles(tree, path.join(__dirname, "files/service"), projectRoot, {
    projectRoot,
    className,
    ...options,
  });
  generateFiles(tree, path.join(__dirname, "files/service"), projectTestRoot, {
    projectRoot,
    projectTestRoot,
    className,
    ...options,
  });
  await formatFiles(tree);
}

export default microserviceGenerator;
