import {
  chain, externalSchematic, Rule, schematic, SchematicContext,
  SchematicsException,
  Tree
} from '@angular-devkit/schematics';
import { Schema } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      defaultProject(),
      schematic('starter', _options),
      externalSchematic('@wizsolucoes/ng-material-theme', 'ng-add', {
        'white-label': _options['white-label'],
      }),
    ])(tree, _context);
  };
}


function defaultProject(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const packageJsonBuffer = tree.read('angular.json');

    if (!packageJsonBuffer) {
      throw new SchematicsException('error angular.json');
    }
    const packageJsonObject = JSON.parse(packageJsonBuffer.toString());


    /// Has to be the same name of the project
    if(packageJsonObject['defaultProject']) {
      return tree;
    }

    /// Set the default project
    const projects = Object.keys(packageJsonObject['projects']);

    if (!projects[0]) {
      throw new SchematicsException('Not found projects in angular.json');
    }
    
    packageJsonObject['defaultProject'] = projects[0];
    
    tree.overwrite('angular.json', JSON.stringify(packageJsonObject, null, 2));

    return tree;
  };
}