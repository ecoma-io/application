import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { IAngularappGeneratorSchema } from './schema';

export async function angularappGenerator(tree: Tree, options: IAngularappGeneratorSchema) {
  const projectRoot = `apps/${options.name}`;
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

export default angularappGenerator;
