import { formatFiles, generateFiles, Tree } from "@nx/devkit";
import * as path from "path";
import { workerGeneratorSchema } from "./schema";

export async function workerGenerator(
  tree: Tree,
  options: workerGeneratorSchema
) {
  const projectRoot = `apps/workers/${options.name}`;
  const humanReadableName = options.name
    .replace(/[-_]/g, " ") // Replace - and _ with space
    .split(" ") // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" ");
  const className = humanReadableName.replace(/ /g, "");
  const projectTestRoot = `e2e/workers/${options.name}-e2e`;

  const substitutions = {
    projectRoot,
    humanReadableName,
    className,
    ...options,
  };

  generateFiles(
    tree,
    path.join(__dirname, "files/worker"),
    projectRoot,
    substitutions
  );
  generateFiles(
    tree,
    path.join(__dirname, "files/test"),
    projectTestRoot,
    substitutions
  );
  generateFiles(
    tree,
    path.join(__dirname, "files/testcontainer"),
    "libs/common/testing-containers/src/lib",
    substitutions
  );
  exportTestContainer(tree, options.name);

  await formatFiles(tree);
}

function exportTestContainer(tree: Tree, name: string) {
  const filePath = `libs/common/testing-containers/src/index.ts`;
  const contents = tree.read(filePath).toString();
  const newContents = contents + `export * from './lib/${name}-container';\n`;
  tree.write(filePath, newContents);
}

export default workerGenerator;
