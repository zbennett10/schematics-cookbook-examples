import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  template,
  move,
  chain,
  mergeWith
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Schema as NodeApiSchematicOptions } from './schema';

export function nodeApi(options: NodeApiSchematicOptions): Rule {
    const templateDirectory = `${options.directory ? options.directory : ''}/${options.name}`;
    const templateSource = apply(
      url('./files'), [
        template({
          ...strings,
          'if-flat': (s: string) => s,
          ...options,
        }),
        move(templateDirectory)
      ]
    );
    
    return chain([
      mergeWith(templateSource),
      installNodeDependencies(templateDirectory)
    ]);
}

function installNodeDependencies(workingDirectory: string): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageInstallOptions = { workingDirectory };
    context.addTask(new NodePackageInstallTask(packageInstallOptions));

    return tree;
  }
}
