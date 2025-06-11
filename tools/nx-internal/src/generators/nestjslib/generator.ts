import { formatFiles, generateFiles, Tree, updateJson } from '@nx/devkit';
import * as path from 'path';
import { INestjslibGeneratorSchema } from './schema';

export async function nestjslibGenerator(tree: Tree, options: INestjslibGeneratorSchema) {
  const projectRoot = `libs/${options.name}`;
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  updateJson(tree, 'tsconfig.base.json', (tsConfig) => {
    tsConfig['compilerOptions']['paths'][`@ecoma/${options.name}`] = [`libs/${options.name}/src/index.ts`];
    return tsConfig;
  });
  await formatFiles(tree);
}

export default nestjslibGenerator;
