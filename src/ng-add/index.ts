import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic,
  externalSchematic,
} from '@angular-devkit/schematics';
import { Schema } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      schematic('starter', _options),
      externalSchematic('@wizsolucoes/ng-material-theme', 'ng-add', {
        'white-label': _options['white-label'],
      }),
    ])(tree, _context);
  };
}
