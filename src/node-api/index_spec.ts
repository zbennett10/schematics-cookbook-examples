import { SchematicsException } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('node-api', () => {
  it('creates the necessary Node API boilerplate', () => {
    const runner = new SchematicTestRunner('cookbook', collectionPath),
            tree = runner.runSchematic('node-api', { name: 'test-app' }),
       { files } = tree;

    expect(files.length).toBe(9);
  });

  it('runs successfully via the "api" alias', () => {
    const runner = new SchematicTestRunner('cookbook', collectionPath),
            tree = runner.runSchematic('api', { name: 'test-app' }),
       { files } = tree;

    expect(files.length).toBe(9);
  });

  it('templates boilerplate files with the correct name', () => {
    const name   = 'test-app',
          runner = new SchematicTestRunner('cookbook', collectionPath),
            tree = runner.runSchematic('api', { name }),
       filePaths = [
          `/${name}/package.json`,
          `/${name}/README.md`
        ];

    expect(filePaths.every(path => {
      const fileContents: Buffer | null = tree.read(path);
      if(!fileContents) throw new SchematicsException(`Unable to read ${fileContents} at path: ${path}`);
      return fileContents.toString('utf-8').includes('test-app');
    })).toBe(true);
  });

  it('creates boilerplate at the correct directory when specified', () => {
    const name   = 'test-app',
       directory = '/test/dir',
          runner = new SchematicTestRunner('cookbook', collectionPath),
            tree = runner.runSchematic('api', { name, directory }),
       { files } = tree,
       filePaths = [
          `${directory}/${name}/package.json`,
          `${directory}/${name}/README.md`,
          `${directory}/${name}/src/server.ts`,
          `${directory}/${name}/src/routes.ts`,
          `${directory}/${name}/src/index.types.ts`,
          `${directory}/${name}/src/mock/books.json`,
        ];

    expect(filePaths.every(path => files.includes(path))).toBe(true);
  });
});
