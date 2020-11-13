import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  schematic,
  externalSchematic,
  noop
} from "@angular-devkit/schematics";
import { Schema } from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAdd(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      _options["white-label"] ? schematic("white-label", _options) : noop(),
      !_options["white-label"] ? schematic("starter", _options) : noop(),
      externalSchematic(
        "@wizsolucoes/ng-material-theme",
        "ng-add",
        { 'white-label': _options["white-label"] }
      ),
    ])(tree, _context);
  };
}
