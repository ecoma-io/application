import { Dict } from "@ecoma/common-types";
import { formatFiles, generateFiles, Tree } from "@nx/devkit";
import { join } from "path";
import { microserviceGeneratorSchema } from "./schema";

export async function microserviceGenerator(
  tree: Tree,
  options: microserviceGeneratorSchema
) {
  const name = options.name;
  const leanName = name.replace(/-service$/, "");
  const className = toPascalCase(name); // Eg: "user-auth-service" => "UserAuthService"
  const leanClassName = toPascalCase(leanName); // Eg: "user-auth" => "UserAuth"

  const humanReadableName = className.replace(/([A-Z])/g, " $1").trim(); // Eg: "UserAuthService" => "User Auth Service"

  const projectRoot = `apps/services/${name}`;
  const projectTestRoot = `e2e/services/${name}-e2e`;
  const projectConstractRoot = `libs/constracts/${leanName}-constract`;
  const testContainerSrcRoot = "libs/common/testing-containers/src/lib";

  const substitutions = {
    projectRoot,
    projectTestRoot,
    projectConstractRoot,
    humanReadableName,
    className,
    leanClassName,
    leanName,
    ...options,
  };

  generate(tree, substitutions, [
    { fromDir: "service", toDir: projectRoot },
    { fromDir: "test", toDir: projectTestRoot },
    { fromDir: "constract", toDir: projectConstractRoot },
    { fromDir: "testcontainer", toDir: testContainerSrcRoot },
  ]);

  exportTestContainer(tree, name);
  updateTsPath(tree, leanName);

  await formatFiles(tree);
}

function generate(
  tree: Tree,
  substitutions: Dict<unknown>,
  projects: Array<{ fromDir: string; toDir: string }>
) {
  projects.forEach(({ fromDir, toDir }) => {
    generateFiles(
      tree,
      join(__dirname, "files", fromDir),
      toDir,
      substitutions
    );
  });
}

// Converts "user-auth-service" to "UserAuthService"
function toPascalCase(input: string): string {
  return input
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// Append export line to the index of test containers
function exportTestContainer(tree: Tree, name: string) {
  const filePath = `libs/common/testing-containers/src/index.ts`;
  const contents = tree.read(filePath)?.toString() ?? "";

  const exportLine = `export * from './lib/${name}-container';\n`;

  if (!contents.includes(exportLine)) {
    tree.write(filePath, contents + exportLine);
  }
}

function updateTsPath(tree: Tree, leanName: string) {
  const tsconfigPath = "tsconfig.base.json";
  const packageJsonPath = "package.json";

  const tsconfig = JSON.parse(tree.read(tsconfigPath).toString());
  const rootPackageJson = JSON.parse(tree.read(packageJsonPath).toString());

  // Extract org from "name": "@ecoma/workspace"
  const orgMatch = /^@([^/]+)\//.exec(rootPackageJson.name || "");
  const orgPrefix = orgMatch ? `@${orgMatch[1]}/` : "";

  const alias = `${orgPrefix}${leanName}-constract`;
  const target = `libs/constracts/${leanName}-constract/src/index.ts`;

  tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};

  if (!tsconfig.compilerOptions.paths[alias]) {
    tsconfig.compilerOptions.paths[alias] = [target];
    tree.write(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  }
}

export default microserviceGenerator;
