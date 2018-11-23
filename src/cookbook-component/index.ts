import { strings } from '@angular-devkit/core';
import { 
  Rule, 
  SchematicsException,
  Tree, 
  externalSchematic,
  branchAndMerge,
  mergeWith,
  chain,
  apply,
  url,
  template,
  move,
  noop,
  empty
} from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import { getWorkspace } from '@schematics/angular/utility/config';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';

import { Schema as CookbookComponentOptions } from './schema';

/*
  This schematic builds upon Angular CLI's `ng g component` command by adding in the ability to generate
  an optional, side-car service file alongside the generated component file.
*/
export function cookbookComponent(options: CookbookComponentOptions): Rule {
  return (tree: Tree) => {
    const needsToGenerateService = options.service ? true : false;
    let serviceTemplateSource = empty();

    if (needsToGenerateService) {
      const workspace = getWorkspace(tree);
      const projectName = options.project || workspace.defaultProject;
      if (!options.project) options.project = projectName;

      if (!projectName) {
        throw new SchematicsException('The option \'project\' is required');
      }
      
      const project = getProject(tree, projectName);

      if (options.path === undefined || options.path === null) {
        options.path = buildDefaultPath(project);
      }

      const serviceLocation = parseName(options.path, options.name);
      const servicePath = serviceLocation.path + `/${options.name}`;
      serviceTemplateSource = apply(url('./files'), [
        template({
          ...strings,
          'if-flat': (s: string) => options.flat ? '' : s,
          ...options,
        }),
        move(servicePath),
      ]);
    }

    return branchAndMerge(
      chain([
        externalSchematic('@schematics/angular', 'component', options),
        needsToGenerateService ? mergeWith(serviceTemplateSource) : noop()
      ])
    );
  };
}
