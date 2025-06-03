import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { InestjsappGeneratorSchema } from './schema';

export async function nestjsappGenerator(tree: Tree, options: InestjsappGeneratorSchema) {
  const projectRoot = `apps`;
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
}

export default nestjsappGenerator;
