import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as AngularWorkspaceOptions} from '@schematics/angular/workspace/schema';
import { Schema as AngularApplicationOptions} from '@schematics/angular/application/schema';
import { Schema as CookbookComponentOptions } from './schema';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');
const angularSchematicsCollectionPath = require.resolve('@schematics/angular/collection.json');

describe('cookbook-component schematic', () => {
  const angularRunner = new SchematicTestRunner('@schematics/angular', angularSchematicsCollectionPath);
  const cookbookRunner = new SchematicTestRunner('cookbook', collectionPath);
  const workspaceOptions: AngularWorkspaceOptions = {
    name: 'test-app-name',
    newProjectRoot: 'test-app-root',
    version: '7.0.3',
  };

  const appOptions: AngularApplicationOptions = {
    name: 'test-app-name'
  };

  let angularApplicationTree: UnitTestTree;
  beforeEach(() => {
    angularApplicationTree = angularRunner.runSchematic('workspace', workspaceOptions);
    angularApplicationTree = angularRunner.runSchematic('application', appOptions, angularApplicationTree);
  });

  it('creates a <comp-name>.service.ts file when the service option is given', () => {
    const options: CookbookComponentOptions = {
      name: 'test-component',
      service: true
    };

    const tree = cookbookRunner.runSchematic('cookbook-component', options, angularApplicationTree);
    console.log(tree.files);

    expect(tree.files.indexOf(
      `/test-app-root/${appOptions.name}/src/app/${options.name}/${options.name}.service.ts`
    )).toBeGreaterThan(-1);
  });

  it('doesn\'t create a <comp-name>.service.ts file when the service option is not given', () => {
    const options: CookbookComponentOptions = { name: 'test-component' , project: 'test-app-name'};

    const tree = cookbookRunner.runSchematic('cookbook-component', options, angularApplicationTree);

    expect(options.service).toBeFalsy();
    expect(tree.files.indexOf(
      `/test-app-root/${options.project}/src/app/${options.name}/${options.name}.service.ts`
    )).toBe(-1);
  });
});
